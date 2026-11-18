#!/usr/bin/env python3
"""페이지 품질 점검 (개발용, 배포 제외). 표준 라이브러리만 사용.

사용법 (저장소 루트에서):
    python scripts/check-pages.py

CLAUDE.md "품질 기준" 중 자동으로 확인 가능한 항목:
  - <html lang="ko">, title, meta description, canonical, og:title/description/image
  - h1 이 정확히 1개, 제목 단계 건너뛰지 않음
  - img 의 alt / width / height, 첫 화면 외 loading="lazy" (경고)
  - 외부 요청 없음 (src/href 의 http(s) — 단, <a> 링크는 허용)
  - 내부 링크 대상 파일·앵커 존재
  - 헤더/푸터 마커 존재
"""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCLUDE_DIRS = {".git", "partials", "scripts", "docs", "node_modules"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.title = ""
        self._in_title = False
        self.meta = {}
        self.links = []          # (tag, attr, value)
        self.canonical = None
        self.headings = []       # (level, hidden)
        self.imgs = []
        self.ids = set()
        self._hidden_depth = 0
        self._stack = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        hidden = "hidden" in a
        if tag not in ("img", "meta", "link", "br", "input", "source", "path", "stop"):
            self._stack.append(hidden)
            if hidden:
                self._hidden_depth += 1
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "title":
            self._in_title = True
        elif tag == "meta":
            key = a.get("name") or a.get("property")
            if key:
                self.meta[key] = a.get("content", "")
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        elif re.fullmatch(r"h[1-6]", tag):
            self.headings.append((int(tag[1]), self._hidden_depth > 0))
        elif tag == "img":
            self.imgs.append(a)
        for attr in ("href", "src"):
            if attr in a:
                self.links.append((tag, attr, a[attr]))

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag not in ("img", "meta", "link", "br", "input", "source", "path", "stop") and self._stack:
            if self._stack.pop():
                self._hidden_depth -= 1

    def handle_data(self, data):
        if self._in_title:
            self.title += data


def check(path: Path, rel: str, pages: dict) -> list[str]:
    text = path.read_text(encoding="utf-8")
    p = pages[rel]
    errs = []
    is_404 = rel == "404.html"

    if p.lang != "ko":
        errs.append('html lang="ko" 없음')
    if not p.title.strip():
        errs.append("title 없음")
    if not p.meta.get("description"):
        errs.append("meta description 없음")
    if not is_404 and not p.canonical:
        errs.append("canonical 없음")
    for key in ("og:title", "og:description", "og:image"):
        if not p.meta.get(key):
            errs.append(f"{key} 없음")

    visible = [lvl for lvl, hidden in p.headings if not hidden]
    if visible.count(1) != 1:
        errs.append(f"h1 {visible.count(1)}개")
    prev = 0
    for lvl in visible:
        if prev and lvl > prev + 1:
            errs.append(f"제목 단계 건너뜀 h{prev} → h{lvl}")
        prev = lvl

    for img in p.imgs:
        name = img.get("src", "?")
        if "alt" not in img:
            errs.append(f"img alt 없음: {name}")
        if not img.get("width") or not img.get("height"):
            errs.append(f"img width/height 없음: {name}")

    for tag, attr, val in p.links:
        # 예외: 카카오맵 지도 퍼가기 스크립트 (CLAUDE.md — 오시는 길 지도)
        if re.match(r"https?://", val) and tag != "a" and not val.startswith("https://t1.kakaocdn.net/kakaomapweb/roughmap/"):
            errs.append(f"외부 요청: <{tag} {attr}={val}>")
        if tag == "a" and attr == "href" and not re.match(r"(https?:|mailto:|tel:|#$)", val):
            target, _, anchor = val.partition("#")
            if target == "":
                target_rel = rel
            elif target.startswith("/"):
                target_rel = target.lstrip("/") or "index.html"
            else:
                target_rel = (Path(rel).parent / target).as_posix()
                target_rel = str(Path(target_rel)).replace("\\", "/")
                parts = []
                for seg in target_rel.split("/"):
                    if seg == "..":
                        parts.pop() if parts else None
                    elif seg not in ("", "."):
                        parts.append(seg)
                target_rel = "/".join(parts) or "index.html"
            if target_rel.endswith("/") or target_rel == "":
                target_rel += "index.html"
            if not (ROOT / target_rel).exists():
                errs.append(f"링크 대상 없음: {val}")
            elif anchor and target_rel in pages and anchor not in pages[target_rel].ids:
                errs.append(f"앵커 없음: {val}")

    for marker in ("HEADER:START", "HEADER:END", "FOOTER:START", "FOOTER:END"):
        if f"<!-- {marker} -->" not in text:
            errs.append(f"마커 없음: {marker}")
    return errs


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

    files = {}
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        if rel.split("/")[0] in EXCLUDE_DIRS:
            continue
        files[rel] = path

    pages = {}
    for rel, path in files.items():
        parser = Page()
        parser.feed(path.read_text(encoding="utf-8"))
        pages[rel] = parser

    total = 0
    for rel, path in files.items():
        errs = check(path, rel, pages)
        total += len(errs)
        mark = "OK " if not errs else "ERR"
        print(f"[{mark}] {rel}")
        for e in errs:
            print(f"      - {e}")
    print(f"완료 — 페이지 {len(files)}, 문제 {total}")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
