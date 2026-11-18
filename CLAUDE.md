# Xinics 공식 홈페이지 — 작업 규칙

자이닉스(Xinics) 회사 홈페이지. Figma Sites(home.xinics.com)와 Notion 회사소개 사이트를 하나로 통합해 새로 만든다.

**목적: 회사 소개.** 우리 회사에 들어올 사람들이 "이런 곳이구나" 알 수 있으면 된다. 유입·데이터 수집·영업 전환이 목적이 아니다.

- 페이지 구성·카피·제품 정보: `docs/SITE_SPEC.md`
- **디자인 기준 화면: `docs/design-reference.html`** (브라우저로 열어 확인. `#home` / `#learn` / `#titles` 세 화면). 레이아웃·간격·컴포넌트·모션은 이 파일을 기준으로 맞춘다. 단 이 파일은 미리보기용이라 Google Fonts·Canvas 코드가 한 파일에 섞여 있다. 그대로 복사하지 말고 아래 구조와 토큰으로 다시 구현한다.

작업 전에 두 문서를 반드시 읽을 것.

## 스택 (변경 금지)

- 순수 HTML + CSS + 최소한의 바닐라 JS. 프레임워크·번들러·npm 의존성 없음.
- 빌드 단계 없음. 저장소 파일이 그대로 웹서버(회사 서버, Nginx/Apache 정적 서빙)에 올라간다.
- 외부 CDN 사용 금지. 폰트·아이콘·이미지는 전부 저장소 안에 둔다.
  - 예외: 오시는 길(Contact)의 카카오맵 "지도 퍼가기" 스크립트만 허용(2026-11-17 결정). JS가 없거나 막혀도 주소·교통편·카카오맵 링크가 보이게 둔다.
- JS 없이도 모든 콘텐츠가 보여야 한다.

## 폴더 구조

```
/
├── index.html
├── solutions/        teach.html · learn.html · assess.html · campus.html
├── services.html
├── customers.html
├── company/          about.html · culture.html · recruit.html
├── contact.html
├── 404.html
├── partials/         header.html · footer.html   (원본. 직접 배포되지 않음)
├── css/              tokens.css · base.css · components.css · pages.css
├── js/               main.js · flow-canvas.js · tabs.js
├── assets/
│   ├── fonts/        Pretendard (woff2, subset)
│   ├── images/       webp 우선, 파일명 kebab-case
│   ├── logos/        customers/ 고객사 로고 (svg 또는 png)
│   └── icons/        svg
├── docs/             SITE_SPEC.md · design-reference.html (배포 제외)
├── scripts/          sync-partials.py (배포 제외)
├── sitemap.xml · robots.txt · favicon.ico
└── README.md         배포 방법 (서버팀 전달용)
```

## 공통 헤더/푸터 규칙

빌드가 없으므로 헤더·푸터는 각 HTML에 복사돼 있다. 대신 원본은 `partials/` 하나만 둔다.

- 각 페이지에서 헤더는 `<!-- HEADER:START -->` ~ `<!-- HEADER:END -->`, 푸터는 `<!-- FOOTER:START -->` ~ `<!-- FOOTER:END -->` 사이에 둔다.
- 헤더/푸터를 바꿀 땐 `partials/`만 수정하고 `python scripts/sync-partials.py`로 전체 페이지에 반영한다. 페이지 파일의 마커 안쪽을 직접 고치지 않는다.
- `sync-partials.py`는 표준 라이브러리만 사용. 현재 페이지 경로에 맞춰 상대경로(`../`)와 메뉴 활성 상태(`aria-current="page"`)를 처리한다.
- 제품명·회사 정보처럼 여러 페이지에 반복되는 텍스트를 바꿀 땐 전체 검색 후 일괄 수정하고, 바꾼 파일 목록을 보고한다.

## 디자인 방향

세 가지 표현을 위치별로 나눠 쓴다.

| 위치 | 방식 | 내용 |
|---|---|---|
| **홈 첫 화면** | A · 루미너스 플로우 | 딥 네이비 배경, 4색 흐름선과 빛 점(Canvas), 큰 헤드라인, 오른쪽에 AI Tutor 대화 패널, 하단 숫자 4개 |
| **본문 전체** | B · 리빙 프로덕트 | 흰 배경과 넉넉한 여백. HTML로 그린 예시 UI 카드가 떠 있고 움직임(대시보드·퀴즈·자막·채점). 4단계 탭, 벤토 그리드 |
| **모든 서브페이지 상단** | C · 컬러 블록 타이틀 | 큰 라운드 컬러 블록 + 아주 큰 제목 + 배경에 영문 대형 워드마크. 솔루션 페이지는 영역 색, 그 외 페이지는 브랜드 네이비/잉크 |

원칙

- 여백 넉넉하게, 문장보다 키워드. 섹션당 메시지 하나.
- **제품 스크린샷은 쓰지 않는다.** 제품은 HTML/CSS로 그린 단순화된 예시 UI 카드로 보여준다(규칙: SITE_SPEC 2-0). 스톡 사진도 쓰지 않는다.
- 섹션 리듬: 다크(홈 히어로) → 라이트 본문 → 다크(마지막 콜아웃). 다크/라이트를 그 이상 교차하지 않는다.
- **CTA 대신 콜아웃.** 행동을 유도하는 버튼("도입 문의/도입 상담 신청", "소개서 받기", "신청하기" 등)을 넣지 않는다. 강조 블록은 정보 전달용 콜아웃(라벨·제목·설명·사실 나열, 버튼 없음). 히어로에도 버튼 대신 정보(4영역 요약). 페이지 이동용 텍스트 링크(자세히 보기, 다음 단계)는 둘러보기용이라 허용. 헤더의 Contact 는 일반 링크.
- 금지: 보라-네온 그라데이션 면 배경, 글래스모피즘 남발, 의미 없는 3D 오브젝트, 이모지 아이콘.

## 디자인 토큰 (`css/tokens.css`)

하드코딩 금지 — 항상 변수로 참조. 색을 바꿀 땐 이 파일만 고친다. 로고 색이 확정되면 `--ink`·`--brand`만 맞춘다.

```css
:root {
  /* 텍스트·면 */
  --ink:#0B0D17;  --ink-2:#2A2E3F;
  --sub:#5E6479;   /* 흰 배경 5.9:1 */
  --mute:#676D83;  /* 흰 배경 4.8:1, #F7F8FA 위 4.8:1 — 텍스트 최소 기준 */
  --deco:#C9CDD8;  /* 장식 전용. 텍스트 금지 */
  --line:#ECEDF2;  --line-2:#E2E4EC;
  --bg:#FFFFFF;    --bg-2:#F7F8FA;

  /* 다크 섹션 */
  --night:#060A22; --night-2:#0E1436; --night-sub:#9AA1C7; /* night 위 7.7:1 */

  /* 브랜드 */
  --brand:#2F5BFF;      /* 흰 글자 5.2:1 — 버튼·링크·포커스 */
  --brand-soft:#EEF2FF;

  /* 영역 컬러 — 점·선·아이콘 전용 (텍스트·흰 글자 배경 금지) */
  --teach:#2F6BFF; --learn:#10A88E; --assess:#7C5CFF; --campus:#F2722B;

  /* 영역 컬러 진한 톤 — 컬러 블록(흰 글자) 전용 */
  --teach-d:#1E4FD8;   /* 6.6:1 */
  --learn-d:#0A7564;   /* 5.6:1 */
  --assess-d:#5B3BD1;  /* 7.0:1 */
  --campus-d:#A84A12;  /* 5.8:1 */
  --brand-d:#1C2A6B;   /* 13.2:1 — Services·Customers 타이틀 */
  /* Company 계열 타이틀은 --ink (19.4:1) */

  /* 타이포 */
  --font-sans:"Pretendard", system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif;
  --fs-hero:  clamp(2.5rem, 5.6vw, 4.5rem);  /* 홈 h1 */
  --fs-title: clamp(2.75rem, 6vw, 5.25rem);  /* 서브페이지 타이틀 블록 h1 */
  --fs-h2:    clamp(2rem, 4vw, 3.25rem);
  --fs-h3:    1.375rem;
  --fs-lead:  1.125rem;
  --fs-body:  1rem;
  --fs-small: .875rem;
  --tracking-tight: -.045em;  /* hero/title */
  --tracking-head:  -.035em;  /* h2/h3 */

  /* 레이아웃 */
  --container:1200px; --gutter:clamp(20px,4vw,32px);
  --section-y:clamp(96px,11vw,150px);
  --r-sm:12px; --r-md:18px; --r-lg:28px; --r-xl:40px; /* xl = 타이틀 블록 */
  --shadow:0 1px 1px rgba(11,13,23,.03),0 8px 24px -8px rgba(11,13,23,.10),0 40px 80px -40px rgba(11,13,23,.22);

  /* 모션 */
  --ease:cubic-bezier(.22,1,.36,1);
  --dur-fast:200ms; --dur-base:400ms; --dur-slow:900ms;
}
```

- 폰트는 Pretendard 하나. 300/400/500/600/700/800 서브셋. 큰 숫자는 300(Light) + `tabular-nums`.
- 한글은 `word-break: keep-all;`, 제목은 `text-wrap: balance;`.

## 서브페이지 타이틀 블록 (C)

모든 서브페이지 첫 요소. `docs/design-reference.html#titles`, `#learn` 참고.

- 구조: `<section class="page-title" style="--dc: var(--learn-d)">` 안에 위치 표시(예: "솔루션 · 02"), `h1`, 설명 1줄, (솔루션 페이지만) 4단계 이동 칩, 오른쪽 제품 UI 카드 1개.
- 배경 워드마크(Teach/Learn/…)는 `aria-hidden="true"`, 흰색 10% 투명도.
- 색 매핑: teach/learn/assess/campus → `--*-d`, services/customers → `--brand-d`, company/about/culture/recruit/contact → `--ink`.
- 솔루션 페이지 4단계 칩: 현재 페이지에 `aria-current="page"`.
- 높이: 솔루션 페이지 560px 내외, 그 외 300px 내외.

## 웹 접근성 (필수)

기준: **KWCAG 2.2(한국형 웹 콘텐츠 접근성 지침) 및 WCAG 2.1 AA**. 공공·대학 고객 대상이라 인증 심사 수준으로 맞춘다.

### 구조

- 모든 페이지 첫 요소로 **"본문 바로가기"** 링크(`<a class="skip" href="#main">`), 포커스 시 보이게.
- 랜드마크: `header` / `nav[aria-label]` / `main#main` / `footer`. 페이지당 `h1` 1개, 제목 단계 건너뛰지 않음.
- 페이지별 고유 `<title>`: `페이지명 | Xinics` 형식. `lang="ko"`, 영문 블록은 `lang="en"`.
- 링크 텍스트만으로 목적을 알 수 있게. "자세히" 같은 반복 링크에는 `<span class="sr-only">` 로 대상 이름 보충.

### 색과 대비

- 일반 텍스트 4.5:1, 18.66px 이상 굵은 글자·24px 이상 글자 3:1, UI 경계·아이콘 3:1 이상.
- 영역 컬러 기본 톤(`--teach` 등)은 텍스트로 쓰지 않는다. 흰 글자 배경에는 반드시 `--*-d`.
- 색만으로 정보를 구분하지 않는다(예: "관심 학생"은 주황 점 + 텍스트 라벨).
- 새 색을 추가하면 대비값을 토큰 주석에 적는다.

### 키보드·포커스

- 모든 기능을 키보드로 사용 가능. 포커스 순서는 화면 순서와 같게.
- `:focus-visible`에 2px 이상 윤곽선(`--brand`, offset 3px). `outline: none` 금지.
- 4단계 탭은 WAI-ARIA Tabs 패턴: `role=tablist/tab/tabpanel`, `aria-selected`, `aria-controls`, 화살표·Home·End 키, roving `tabindex`. 비활성 패널은 `inert` + `aria-hidden="true"`.
- 드롭다운 메뉴·모바일 메뉴: `aria-expanded`, Esc로 닫기, 닫으면 여는 버튼으로 포커스 복귀.
- FAQ는 `<details>/<summary>`.

### 움직이는 콘텐츠

- 5초 넘게 자동으로 움직이는 것(흐름선, 로고 마퀴, 탭 자동 전환, 자막 순환, 타이핑)은 **정지 버튼 제공** + hover 시 일시정지. hover 정지만으로는 키보드·터치 사용자에게 정지 수단이 아니므로 버튼이 필요하다.
- 정지 버튼은 헤더 같은 전역 위치가 아니라 **움직이는 요소 바로 옆에 작은 아이콘 버튼**으로 둔다(히어로 우하단, 마퀴 끝, 탭 목록 아래). `aria-label`로 "… 멈추기/재생" 상태를 이름에 담는다.
- 탭 자동 전환: 탭을 클릭하면 그 탭부터 진행 바가 다시 시작되고 자동 진행은 계속된다. 키보드 포커스가 탭에 있는 동안만 일시정지.
- 초당 3회 이상 깜빡임 금지.
- `prefers-reduced-motion: reduce`이면 모든 자동 모션을 끄고 최종 상태 표시(타이핑은 전체 문장, 카운트업은 최종 숫자).
- 자동 갱신 텍스트에 `aria-live` 쓰지 않는다(스크린리더 소음).

### 이미지·장식 UI

- 의미 있는 이미지는 내용을 설명하는 `alt`, 장식은 `alt=""`.
- **HTML로 그린 제품 UI 카드(대시보드·퀴즈·자막 등)는 장식 겸 예시**다. 묶음 컨테이너에 `role="img"` + 무엇을 보여주는지 한두 문장 `aria-label`, 내부는 `aria-hidden="true"`. 타이핑·자막 순환 텍스트도 이 안에 둔다.
- Canvas는 `aria-hidden="true"`.

### 폼(문의 폼 활성화 시)

- 모든 입력에 `<label>`, 필수 항목 표시와 `aria-required`, 오류는 텍스트로 알리고 해당 필드에 `aria-describedby`.

### 점검 (페이지 완료 조건)

- axe DevTools 또는 Lighthouse 접근성 100점, 오류 0.
- 키보드만으로 전 페이지 순회. 화면 낭독기(NVDA 또는 VoiceOver)로 홈·서브 1개씩 확인.
- 200% 확대, 320px 너비에서 가로 스크롤 없이 읽힘.

## 모션 디자인

라이브러리 없음. CSS 애니메이션 + `IntersectionObserver` + Canvas 2D. `transform`/`opacity`만 애니메이션.

| # | 위치 | 모션 | 상세 |
|---|---|---|---|
| M1 | 홈 히어로 | 흐름선 + 빛 점 | Canvas. 4색 곡선이 천천히 물결, 선 위로 빛 점이 좌→우 이동. 왼쪽(텍스트 쪽)은 투명도 낮게. 화면 밖이면 렌더링 중지 |
| M2 | 홈 히어로 | 텍스트 진입 | 배지 → h1 → 설명 → 버튼 → 패널 순 80ms 간격, 18px 위로 + 페이드, `--dur-slow` |
| M3 | 홈 히어로 | AI 답변 타이핑 | 문장 타이핑 후 잠시 멈췄다 반복. 장식 영역(`role="img"`) 안에서만 |
| M4 | 홈 숫자 | 카운트업 | 최종값을 HTML에 두고 화면 진입 시 0→최종 1.5초, 한 번만 |
| M5 | 홈 히어로→본문 | 헤더 전환 | 다크 히어로 위 투명·흰 글자 → 벗어나면 흰 배경·블러·하단 보더 |
| M6 | 제품 UI 스테이지 | 떠 있는 카드 | 카드마다 6~7.5초 주기로 10px 상하 부유, 진도 막대 차오름, 퀴즈 정답 하이라이트, 자막 한/영 순환 |
| M7 | 4단계 탭 | 자동 진행 | 활성 탭 상단 2px 진행 바 6초 → 다음 탭. 패널은 페이드 + scale .98→1. hover·포커스 시 일시정지 |
| M8 | 벤토·제품 카드 | hover | 4px 상승 + 그림자, 카드 상단 영역색 3px 라인 좌→우 채움, 폰 목업 14px 상승 |
| M9 | 로고 마퀴 | 상시 흐름 | 50초 주기, hover 시 정지 |
| M10 | 서브 타이틀 블록 | 원형 펄스 | 반투명 원 7초 주기 scale 1→1.12 |
| M11 | "다음 단계" 카드 | hover | 원 확대, 화살표 버튼 8px 이동 |
| M12 | 마지막 콜아웃 | 흐름선 | M1의 느린 버전, 빛 점 없음. 보인 뒤 5초만 움직이고 멈춤 |

금지: 패럴랙스 배경, 커서 따라다니는 효과, 스크롤 하이재킹, 로드 후 1초 넘게 콘텐츠를 가리는 인트로.

점검: 스크롤 60fps, Layout Shift 0, CPU 4x 감속에서 M1이 끊기면 빛 점부터 제거.

## 품질 기준 (각 페이지 완료 조건)

- 위 "웹 접근성 > 점검" 통과.
- 반응형: 360 / 768 / 1024 / 1440px. 모바일 우선 CSS.
- `<head>`: `title`, `meta description`, OG 태그, canonical.
- 이미지: webp, `width`/`height` 명시, 첫 화면 외 `loading="lazy"`.
- 외부 요청 없음 — 카카오맵 지도 예외 제외 (분석 스크립트는 확정 후 — TODO).

## 작업 방식

- 한 번에 한 페이지씩. 페이지마다 PR(또는 커밋)을 나눈다. `main` 직접 push 금지.
- 스펙에 없는 문구를 지어내지 않는다. 비어 있으면 `<!-- TODO: ... -->`로 남기고 마지막에 TODO 목록을 보고한다.
- 제품 공개 여부가 "확인 필요"인 항목은 마크업은 만들되 `data-status="pending"` + `hidden`.
- 비밀번호·API 키·내부 서버 정보는 어떤 파일에도 넣지 않는다.
