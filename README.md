# Xinics 홈페이지 — 배포 안내

자이닉스(Xinics) 회사 홈페이지. **빌드 단계 없는 정적 사이트**입니다 (HTML · CSS · 바닐라 JS).
저장소 파일을 그대로 웹서버(Nginx 또는 Apache)에 올리면 됩니다. 외부 CDN·분석 스크립트 등 외부 요청은 없습니다. 예외는 Contact 페이지의 카카오맵 "지도 퍼가기" 스크립트(`t1.kakaocdn.net`, `mts.kakaocdn.net`) 하나이며, 막혀도 주소·교통편·카카오맵 링크는 그대로 보입니다.

---

## 1. 업로드 대상

사이트 **루트(도메인 최상위)** 에 아래만 올립니다. `404.html` 이 `/css/...` 같은 루트 기준 경로를 쓰므로 하위 경로(예: `example.com/home/`)에는 배포할 수 없습니다.

```
index.html  404.html  services.html  customers.html  contact.html
solutions/  company/
css/  js/  assets/
favicon.ico  robots.txt  sitemap.xml
```

**올리지 않는 것** (개발용): `docs/` `scripts/` `partials/` `README.md` `CLAUDE.md` `.gitignore` `.git/` `assets/fonts/_source/`

rsync 예시:

```bash
rsync -av --delete \
  --exclude '.git/' --exclude '.gitignore' \
  --exclude 'docs/' --exclude 'scripts/' --exclude 'partials/' \
  --exclude 'assets/fonts/_source/' \
  --exclude 'README.md' --exclude 'CLAUDE.md' \
  ./ user@server:/var/www/xinics-home/
```

## 2. 서버 설정

| 항목 | 설정 |
|---|---|
| 404 | 없는 경로는 `/404.html` 을 **404 상태코드로** 응답 |
| HTTPS | HTTP → HTTPS 301 리다이렉트 |
| MIME | `.woff2` → `font/woff2`, `.webp` → `image/webp`, `.svg` → `image/svg+xml` |
| 압축 | gzip(또는 brotli): html · css · js · svg · xml · txt. woff2 · webp · png 는 이미 압축됨 |
| 캐시 — HTML | `Cache-Control: no-cache` |
| 캐시 — CSS · JS | `Cache-Control: no-cache` (ETag/Last-Modified 로 재검증). 파일명에 버전이 없어서 길게 캐시하면 수정이 반영되지 않습니다 |
| 캐시 — 폰트 · 이미지 | `Cache-Control: public, max-age=2592000` (30일) |

### Nginx 예시

```nginx
server {
    listen 443 ssl http2;
    server_name home.xinics.com;
    root /var/www/xinics-home;
    index index.html;

    # ssl_certificate / ssl_certificate_key — 서버팀 인증서 경로

    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(?:html)$ {
        add_header Cache-Control "no-cache";
    }
    location ~* \.(?:css|js)$ {
        add_header Cache-Control "no-cache";
    }
    location ~* \.(?:woff2|webp|png|svg|ico)$ {
        add_header Cache-Control "public, max-age=2592000";
    }

    # 개발용 폴더가 실수로 올라간 경우 차단
    location ~ ^/(docs|scripts|partials)/ { return 404; }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/xml text/plain;

    # 권장 보안 헤더 (아래 CSP 주의사항 참고)
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}

server {
    listen 80;
    server_name home.xinics.com;
    return 301 https://$host$request_uri;
}
```

> - `types` 에 `font/woff2 woff2;` `image/webp webp;` 가 없으면 `mime.types` 에 추가해 주세요.
> - Nginx 는 `location` 안에 `add_header` 가 있으면 `server` 레벨 `add_header` 를 상속하지 않습니다. 보안 헤더를 모든 응답에 붙이려면 두 줄을 각 `location` 에도 넣거나 공통 파일로 `include` 해 주세요.

### Apache 예시 (`.htaccess` 또는 VirtualHost)

```apache
ErrorDocument 404 /404.html

AddType font/woff2 .woff2
AddType image/webp .webp

<IfModule mod_headers.c>
  <FilesMatch "\.(html|css|js)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  <FilesMatch "\.(woff2|webp|png|svg|ico)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml text/plain
</IfModule>

RedirectMatch 404 ^/(docs|scripts|partials)/
```

### CSP(Content-Security-Policy)를 쓸 경우

각 페이지 `<head>` 에 짧은 인라인 스크립트 1개(JS 동작 여부 표시)가 있고, Solutions 페이지에 인라인 `style` 속성이 있습니다. 적용한다면 아래처럼 시작해 주세요.

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; frame-ancestors 'self'; base-uri 'self'
```

## 3. 배포 후 확인

- [ ] `https://home.xinics.com/` 접속, 메뉴 전 페이지 이동
- [ ] 없는 주소(예: `/abc`) → 404 페이지가 스타일 포함해 정상 표시, 응답 코드 404
- [ ] `/docs/`, `/scripts/` 접근 시 404
- [ ] 개발자도구 Network: 외부 도메인 요청 없음(Contact 의 카카오맵 제외), `.woff2` 의 Content-Type 이 `font/woff2`
- [ ] `/sitemap.xml`, `/robots.txt` 열림

## 4. 도메인 관련

- `sitemap.xml`, `robots.txt` 는 규격상 절대 URL이 필요해 `https://home.xinics.com` 으로 작성돼 있습니다.
- 각 페이지의 `canonical`, `og:url`, `og:image` 는 현재 루트 기준 상대 경로입니다. 도메인 적용 시점에 절대 URL로 바꿀 예정입니다 (`<!-- TODO: 도메인 … -->` 주석 위치).

---

## 개발자용 메모

- 작업 규칙: `CLAUDE.md`, 페이지 구성·카피 기준: `docs/SITE_SPEC.md`, 디자인 기준 화면: `docs/design-reference.html`
- JS: `js/main.js`(메뉴·헤더·전역 모션 정지·카운트업·마퀴·예시 카드 모션), `js/tabs.js`(홈 4단계 탭), `js/flow-canvas.js`(홈 히어로·CTA 흐름선)
- 접근성 점검: Chrome DevTools → Lighthouse → Accessibility (설치 불필요), 또는 axe DevTools 확장
- 헤더/푸터 수정: `partials/` 만 고친 뒤 `python scripts/sync-partials.py` (확인만: `--check`)
- 로컬 미리보기: `python scripts/serve.py` → http://127.0.0.1:8000 (캐시 끔, 없는 경로는 404.html)
- 페이지 점검: `python scripts/check-pages.py` (메타·제목 구조·이미지 속성·외부 요청·내부 링크)
- 컴포넌트 미리보기: `docs/components.html`
- 폰트 서브셋 재생성: `python scripts/subset-fonts.py` (원본은 `assets/fonts/_source/`, `fonttools` 필요)
- 영문 디스플레이 폰트: Montserrat 500~800 라틴 서브셋 (`assets/fonts/Montserrat-*.subset.woff2`, SIL OFL 1.1). `assets/fonts/` 아래 하위 폴더는 원본 보관용이라 저장소·배포에서 제외
