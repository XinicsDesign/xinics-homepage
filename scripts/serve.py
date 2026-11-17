#!/usr/bin/env python3
"""로컬 미리보기 서버 (개발용, 배포 제외). 표준 라이브러리만 사용.

사용법 (저장소 루트에서):
    python scripts/serve.py          # http://127.0.0.1:8000
    python scripts/serve.py 8765

- 캐시를 끈다 (Cache-Control: no-store) → CSS/JS 수정이 바로 보임
- 없는 경로는 운영 서버처럼 404.html 을 404 상태로 돌려준다
"""
import functools
import http.server
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".woff2": "font/woff2",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_error(self, code, message=None, explain=None):
        page = ROOT / "404.html"
        if code == 404 and page.exists():
            body = page.read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(Handler, directory=str(ROOT))
    with http.server.ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print(f"http://127.0.0.1:{port}/  (Ctrl+C 로 종료)")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
