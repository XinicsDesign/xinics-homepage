#!/usr/bin/env python3
"""partials/header.html · footer.html 을 모든 페이지의 마커 사이에 반영한다.

사용법 (저장소 루트에서):
    python scripts/sync-partials.py           # 반영
    python scripts/sync-partials.py --check   # 반영 필요 여부만 확인 (필요하면 exit 1)

partials 안에서 쓰는 치환자:
    {{root}}            현재 페이지 기준 사이트 루트. 루트 페이지 "./", 한 단계 아래 "../"
                        404.html 은 서버가 임의 경로에서 내려주므로 절대경로 "/"
    href="{{root}}경로"  경로가 현재 페이지와 같으면 aria-current="page" 를 붙인다.
                        href="{{root}}" 는 index.html 로 취급
    {{current:접두어}}   현재 페이지 경로가 접두어로 시작하면 " is-current", 아니면 빈 문자열
                        (예: class="nav-item has-sub{{current:solutions/}}")

표준 라이브러리만 사용.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTIALS = {
    "HEADER": ROOT / "partials" / "header.html",
    "FOOTER": ROOT / "partials" / "footer.html",
}
EXCLUDE_DIRS = {".git", "partials", "scripts", "node_modules"}
ABSOLUTE_ROOT_PAGES = {"404.html"}

HREF_RE = re.compile(r'href="\{\{root\}\}([^"]*)"')
CURRENT_RE = re.compile(r"\{\{current:([^}]*)\}\}")
LEFTOVER_RE = re.compile(r"\{\{[^}]*\}\}")


def root_prefix(rel: str) -> str:
    if rel in ABSOLUTE_ROOT_PAGES:
        return "/"
    depth = rel.count("/")
    return "../" * depth if depth else "./"


def render(template: str, rel: str) -> str:
    prefix = root_prefix(rel)

    def replace_href(m: re.Match) -> str:
        path = m.group(1)
        target = path.split("#", 1)[0].split("?", 1)[0] or "index.html"
        current = ' aria-current="page"' if target == rel else ""
        return f'href="{prefix}{path}"{current}'

    out = HREF_RE.sub(replace_href, template)
    out = CURRENT_RE.sub(lambda m: " is-current" if rel.startswith(m.group(1)) else "", out)
    out = out.replace("{{root}}", prefix)

    leftover = LEFTOVER_RE.search(out)
    if leftover:
        raise ValueError(f"알 수 없는 치환자: {leftover.group(0)}")
    return out


def apply_block(text: str, name: str, block: str, newline: str) -> tuple[str, int]:
    pattern = re.compile(
        rf"(<!-- {name}:START -->)(.*?)(<!-- {name}:END -->)", re.S
    )
    found = len(pattern.findall(text))
    if found == 0:
        return text, 0
    if found > 1:
        raise ValueError(f"{name} 마커가 {found}쌍 있음 (1쌍만 허용)")
    body = block.strip("\r\n").replace("\r\n", "\n").replace("\n", newline)
    new = pattern.sub(lambda m: m.group(1) + newline + body + newline + m.group(3), text)
    return new, 1


def iter_pages():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in EXCLUDE_DIRS:
            continue
        yield path, rel.as_posix()


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

    parser = argparse.ArgumentParser(description="partials 를 각 페이지에 반영")
    parser.add_argument("--check", action="store_true", help="쓰지 않고 차이만 확인")
    args = parser.parse_args()

    templates = {name: p.read_text(encoding="utf-8") for name, p in PARTIALS.items()}

    changed, unchanged, no_marker, errors = [], [], [], []

    for path, rel in iter_pages():
        with open(path, encoding="utf-8", newline="") as f:
            text = f.read()
        newline = "\r\n" if "\r\n" in text else "\n"

        new = text
        markers = 0
        try:
            for name, tpl in templates.items():
                if f"<!-- {name}:START -->" in new and f"<!-- {name}:END -->" not in new:
                    raise ValueError(f"{name}:END 마커 없음")
                new, n = apply_block(new, name, render(tpl, rel), newline)
                markers += n
        except ValueError as e:
            errors.append(f"{rel}: {e}")
            continue

        if markers == 0:
            no_marker.append(rel)
        elif new != text:
            changed.append(rel)
            if not args.check:
                with open(path, "w", encoding="utf-8", newline="") as f:
                    f.write(new)
        else:
            unchanged.append(rel)

    verb = "반영 필요" if args.check else "반영함"
    for rel in changed:
        print(f"  {verb}: {rel}")
    for rel in no_marker:
        print(f"  마커 없음(건너뜀): {rel}")
    for msg in errors:
        print(f"  오류: {msg}")
    print(f"완료 — {verb} {len(changed)}, 변경 없음 {len(unchanged)}, "
          f"마커 없음 {len(no_marker)}, 오류 {len(errors)}")

    if errors or (args.check and changed):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
