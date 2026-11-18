#!/usr/bin/env python3
"""Pretendard 원본(woff2)에서 사이트용 서브셋을 만든다. (개발용, 배포 제외)

사용법 (저장소 루트에서):
    python -m pip install --user fonttools brotli   # 최초 1회
    python scripts/subset-fonts.py

입력:  assets/fonts/_source/Pretendard-{Light,Regular,Medium,SemiBold,Bold,ExtraBold}.woff2  (git 제외)
출력:  assets/fonts/Pretendard-{굵기}.subset.woff2

포함 글자:
  - 기본 라틴(ASCII), Latin-1 기호, 일반 문장부호(· — ‘ ’ “ ” … 등), 화살표, ©, ™
  - 한글 KS X 1001 완성형 2,350자 + 호환 자모(ㄱ~ㅣ)
  - 저장소 HTML·docs 에 실제로 쓰인 모든 글자 (완성형 밖 글자 대비)
글꼴 기능(tnum 등)은 전부 유지한다.
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from fontTools import subset
except ImportError:
    sys.exit("fonttools 가 필요합니다: python -m pip install --user fonttools brotli")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "fonts" / "_source"
OUT = ROOT / "assets" / "fonts"
WEIGHTS = ["Light", "Regular", "Medium", "SemiBold", "Bold", "ExtraBold"]


def charset() -> set[str]:
    chars: set[str] = set()
    ranges = [
        (0x0020, 0x007E),  # ASCII
        (0x00A0, 0x00FF),  # Latin-1 기호
        (0x2010, 0x205E),  # 일반 문장부호
        (0x2190, 0x21FF),  # 화살표
        (0x2122, 0x2122),  # ™
        (0x3131, 0x318E),  # 한글 호환 자모
        (0x3000, 0x303F),  # CJK 기호·문장부호 (「」 등)
    ]
    for start, end in ranges:
        chars.update(chr(c) for c in range(start, end + 1))

    # KS X 1001 완성형 2,350자 = EUC-KR 2바이트로 인코딩되는 한글 음절
    # (Python euc_kr 코덱은 나머지 음절을 8바이트 조합 시퀀스로 인코딩하므로 길이로 거른다)
    for c in range(0xAC00, 0xD7A4):
        ch = chr(c)
        try:
            if len(ch.encode("euc_kr")) == 2:
                chars.add(ch)
        except UnicodeEncodeError:
            continue

    # 실제 콘텐츠에 쓰인 글자
    for pattern in ("**/*.html", "docs/**/*.md"):
        for path in ROOT.glob(pattern):
            if any(p in {".git", "_source"} for p in path.parts):
                continue
            chars.update(path.read_text(encoding="utf-8"))

    return {ch for ch in chars if ch.isprintable() or ch == " "}


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except AttributeError:
        pass

    text = "".join(sorted(charset()))
    for weight in WEIGHTS:
        src = SRC / f"Pretendard-{weight}.woff2"
        if not src.exists():
            print(f"  없음: {src.relative_to(ROOT)}")
            return 1
        out = OUT / f"Pretendard-{weight}.subset.woff2"
        subset.main([
            str(src),
            f"--text={text}",
            f"--output-file={out}",
            "--flavor=woff2",
            "--layout-features=*",
            "--no-hinting",
            "--desubroutinize",
        ])
        print(f"  {out.relative_to(ROOT).as_posix()}: "
              f"{src.stat().st_size // 1024}KB → {out.stat().st_size // 1024}KB")
    print(f"완료 — 글자 {len(text)}개")
    return 0


if __name__ == "__main__":
    sys.exit(main())
