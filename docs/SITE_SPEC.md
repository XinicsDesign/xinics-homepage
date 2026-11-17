# Xinics 홈페이지 사이트 스펙 v0.2

- 작성: 2026-11-17 (v0.2: 홈·서브페이지 구성을 design-reference.html 기준으로 갱신, 제품 캡처 미사용)
- 개정: 2026-11-17 — 목적은 회사 소개(입사할 사람이 "이런 곳이구나" 알 정도). 유입·데이터 수집용이 아님. CTA(도입 문의/도입 상담 신청, 소개서 받기 등 행동 유도 버튼) 전부 제거하고 정보 전달용 콜아웃으로 대체
- 출처: 현 홈페이지(home.xinics.com), Notion 회사소개(Product/People/Culture/Recruit), Confluence「AI 제품 포트폴리오 및 상품 라인업 구상」·「Commons EX 제품 요약」·「2026년 11월 - LearningHUB」
- 상태 표기: ✅ 확정 · ⚠️ 확인 필요 · ✏️ 카피 작성 필요

---

## 0. 오픈 전 확인 필요 (작업 차단 요소)

| # | 항목 | 확인 대상 |
|---|---|---|
| 1 | 제품명 최종본: LearningHUB(구 XN Learn/Student Front), AI Commons vs AI 강의조교, AI Quiz → XN Quiz 통합 표기 | 제품기획(이현경) |
| 2 | 공개 가능 제품: GradeFlow, LearningHUB, 교수자 AI 대시보드는 시범운영 중 | 제품기획 |
| 3 | 티어(BASE/FLOW/PRIME)는 사이트에 노출하지 않음. 2027.02 라인업 확정 후 별도 반영 | — |
| 4 | 수치 통일: Zoom 운영 기관 "약 50여 개" vs "60여 개 이상" (Notion 내 불일치) | 사업본부 |
| 5 | 제품 설명이 없는 항목(아래 ✏️) 1~2줄 설명 | 각 제품 담당 |
| 6 | 로고(svg), 고객사 로고 원본. **제품 화면 캡처는 쓰지 않음** — 제품 UI는 HTML로 그린 예시 카드(아래 2-0) | 디자인 |
| 7 | 문의 방식: 오픈 시점엔 폼 없이 mailto/전화. 폼은 서버팀 일정 확정 후 | 서버관리팀 |
| 8 | Notion 사이트 종료 시 사람인·잡코리아 채용공고의 회사소개 링크를 새 주소로 교체 | 경영지원팀 |
| 10 | 고객사 대학명을 홈 마퀴·사례에 노출해도 되는지 | 사업본부 |
| 9 | **Notion 출처 내용 전체 최신화** (아래 0-1) — Notion은 구버전이라 그대로 쓰지 않는다 | 경영지원팀·사업본부 |

### 0-1. Notion 출처 내용 최신화 체크리스트

Notion 회사소개는 오래된 자료다. 아래 항목은 **구조 참고용**이고, 문구·수치는 확인 전까지 `⚠️ 최신화` 표시로 둔다. Claude Code는 이 항목들을 마크업하되 텍스트 옆에 `<!-- TODO: 최신화 확인 -->`를 남긴다.

| 페이지 | 항목 | 확인할 내용 |
|---|---|---|
| Services | Zoom 파트너십 | 파트너 계약 유지 여부, 운영 기관 수(50/60 불일치), ZoomX 현행 제공 여부 |
| Services | 교육 시설 인프라 | 사업 지속 여부, 구축 실적 수(70+), 대표 구축 사례 |
| Services | 클라우드 MSP | 운영 대학 수(50+), 공공/민간 클라우드 파트너명(NHN·KT·네이버 등 표기 가능 여부) |
| Services | 서비스 데스크 | 원격교육운영센터(ontactlearning.com)는 더 이상 쓰지 않아 서비스 데스크로 대체 |
| About | 조직(People) | 현행 팀 구성. 팀 나열 대신 "하는 일" 4~5개로 재구성하는 안 권장 |
| Culture | 복지 | 항목별 현행 유지 여부, 신규 복지 추가 |
| Recruit | 채용 절차·FAQ | 현행 절차와 일치 여부, 결과 안내 기간(1주일/5일) |
| 공통 | 연락처 | recruit@xinics.com 사용 여부 |

---

## 1. 사이트맵

```
/                         Home
/solutions/teach.html     Teach  · 수업 설계·콘텐츠 제작
/solutions/learn.html     Learn  · 학습 경험
/solutions/assess.html    Assess · 평가
/solutions/campus.html    Campus · 운영·분석
/services.html            Services · Zoom 파트너십 · 교육 시설 구축 · 클라우드 운영
/customers.html           Customers
/company/about.html       About · 회사 소개 · 조직
/company/culture.html     Culture · 일하는 방식 · 복지
/company/recruit.html     Recruit · 채용 안내 · FAQ
/contact.html             Contact
/404.html
```

### GNB

`Solutions ▾(Teach/Learn/Assess/Campus)` · `Services` · `Customers` · `Company ▾(About/Culture/Recruit)` · `Contact` (일반 링크, 버튼 아님)

### Footer

- 로고 + "Exciting Technology Companions"
- 주소: 서울특별시 구로구 디지털로31길 53, 1101 (이앤씨벤처드림타워5차 11층)
- T. 02-865-8801 · contact@xinics.com · 채용 recruit@xinics.com
- 링크: 서비스 데스크 https://xinics.atlassian.net/servicedesk/customer/portals
- © 2026 Xinics Inc. All rights reserved. (연도는 JS 없이 하드코딩, 매년 수정)

---

## 2. 페이지별 구성

### 2-0. 제품 UI 예시 카드 (캡처 대체)

제품 스크린샷은 쓰지 않는다. 대신 HTML/CSS로 단순화한 "예시 UI 카드"를 그린다. `docs/design-reference.html`의 카드가 기준.

- 실제 제품 화면을 흉내 내지 않는다. 제품의 **핵심 동작 하나**만 보여주는 도식(예: 튜터 질문→근거 표시 답변, 진도 막대와 관심 학생 라벨, 퀴즈 정답 표시, 한/영 자막).
- 실제 제품에 없는 기능을 그리지 않는다. 카드 내용은 SITE_SPEC 제품 설명 범위 안에서만.
- 학생 이름·과목·수치는 예시값. 예시 화면 영역(스테이지·탭 패널)의 **오른쪽 하단**에 작은 글씨로 "화면은 이해를 돕기 위한 예시입니다." 표기. 카드 묶음(벤토·제품 목록)은 묶음 아래 오른쪽 정렬. 히어로 대화 패널에는 넣지 않음.
- 컴포넌트로 만든다: `ui-card`(공통 틀) + 변형 `ui-dashboard` · `ui-tutor` · `ui-quiz` · `ui-caption` · `ui-grade` · `ui-ask` · `ui-phone` · `ui-log`. 페이지마다 조합만 바꿔 재사용.
- 접근성: 묶음에 `role="img"` + 설명 `aria-label`, 내부 `aria-hidden="true"` (CLAUDE.md 웹 접근성 참고).

### 2-1. Home `/`  — 화면 기준: design-reference.html `#home`

| # | 섹션 | 방식 | 내용 |
|---|---|---|---|
| 1 | Hero | A (다크) | 배지 "New · XN Quiz · GradeFlow 시범운영 시작" ⚠️(공개 여부) / h1 "교육의 모든 과정을 AI로 연결합니다" ✏️(현 사이트 "AI로 진화하는 교육, 함께 하는 기술 동반자"와 택1) / 설명 "강의 설계부터 학습, 평가, 캠퍼스 운영까지. 400여 대학과 기관이 Xinics 하나로 수업을 운영합니다." / 4영역 요약(설계·제작 · 학습 · 평가 · 운영·분석, 링크 아님) / 오른쪽 `ui-tutor` / 하단 숫자 4개: 400+ 도입 대학·기관 · 1M+ 사용자 · 20+ 교육 솔루션 · 20+ 년 |
| 2 | 고객 | B | "400여 대학·기관이 Xinics와 함께합니다" + 대학 로고 이미지 마퀴 ⚠️(노출 동의, 0-#10). 원본 수급 전 임시 SVG |
| 3 | Live in classrooms | B | "오늘도 수업 안에서 이렇게 돌아갑니다" / 예시 UI 스테이지(`ui-dashboard` 중앙 + `ui-quiz`·`ui-caption`·`ui-grade` 부유) / 하단 4영역 링크(Teach·Learn·Assess·Campus → 각 Solutions 페이지) |
| 4 | One platform | B | "설계하고, 배우고, 평가하고, 운영하는 일이 하나로" / 4단계 탭(자동 진행) + 오른쪽 예시 UI 패널 |
| 5 | Products | B | "수업에 바로 쓰는 AI" / 벤토 5칸: AI TransLive · AI Commons · LearningHUB ⚠️ · TrustLock · LearningX AI 플랫폼 |
| 6 | Services | B | Zoom 파트너 · 교육 시설 구축 · 클라우드 매니지드 (수치 ⚠️ 0-1) |
| 7 | 콜아웃 | 다크 | 라벨 "About Xinics" / "Exciting Technology Companions" / "20년 이상 400여 대학·기관과 함께한 교육 혁신 파트너" / Integrate·Inspire·Impact 세 가치 (버튼 없음) |

> v0.1의 Why Xinics(Integrate·Inspire·Impact)는 홈에서 빼고 About으로 옮긴다.

### 2-2. 서브페이지 공통 — 화면 기준: design-reference.html `#learn`, `#titles`

모든 서브페이지는 **C 타이틀 블록**으로 시작한다(규칙은 CLAUDE.md "서브페이지 타이틀 블록").

Solutions 4페이지 구성:

```
1. 타이틀 블록 (C, 영역 진한 색)  4단계 칩 · "SOLUTIONS · 0N 영역명" · h1 · 설명 · 오른쪽 예시 UI 카드 1개
2. 제품 목록 (B)                  "N products" · h2 · 카드 그리드 3열
                                  대표 제품 1개는 2칸 와이드 + 예시 UI 카드
                                  카드: 아이콘 이니셜 · 배지(AI/시범운영/연동) · 제품명 · 한 줄 설명 · 핵심 기능 3개
                                  설명 미확정 제품은 점선 카드 + data-status="pending" hidden
3. 다음 단계 카드                  다음 영역 진한 색 블록 (Teach→Learn→Assess→Campus→Teach)
```

그 외 서브페이지(Services·Customers·About·Culture·Recruit·Contact): 타이틀 블록(300px, `--brand-d` 또는 `--ink`) → 본문 섹션(B 스타일). Culture 만 끝에 채용 콜아웃(버튼 없음, 사람인·잡코리아 게시 안내 + recruit@xinics.com).

제품별 상세 페이지는 만들지 않는다. 제품 카드에 별도 링크(소개서·문의) 없음.

### 2-3. Teach `/solutions/teach.html` — 수업 설계·콘텐츠 제작

메시지 ✏️: "강의 설계부터 콘텐츠 제작·배포까지, 한 흐름으로."

| 제품 | 설명 | 상태 |
|---|---|---|
| AI Commons (AI 강의조교) | 강의 설계 → 강의 콘텐츠·슬라이드·영상 제작을 AI가 지원. 강의계획서·스크립트·퀴즈 생성 | ✅ 명칭 ⚠️ |
| Commons EX | 교육 콘텐츠 제작·관리·배포/공유 통합 CMS. 영상·PDF·YouTube·자막 등록, 메타데이터 자동 추출, 과목·사용자 간 공유·재사용, AI 자막 연계 | ✅ |
| Cloud Editor | ✏️ | ⚠️ |
| Commons Remix Studio | ✏️ | ⚠️ |
| ReadyStream | 강의 콘텐츠 저작도구 ✏️ 상세 | ✅ |
| LectureDeck / LectureDeck Office | 강의 녹화·저작도구 ✏️ 상세 (Office 버전 구분 설명 필요) | ✅ |
| LectureCam | ✏️ | ⚠️ |
| EverLec | 강의 녹화 저작도구 ✏️ 상세 | ✅ |
| SyncThink | ✏️ (Commons 콘텐츠 시청 앱 연계 확인) | ⚠️ |

> 저작도구가 6종이라 카드가 많음. "AI 제작" / "녹화·저작도구" 두 그룹으로 나눠 배치.

### 2-4. Learn `/solutions/learn.html` — 학습 경험

메시지 ✏️: "학습자 한 명 한 명의 맥락을 읽는 학습 환경."

| 제품 | 설명 | 상태 |
|---|---|---|
| LearningX LMS | AI로 진화한 맞춤형 학습 플랫폼. HyFlex 수업 설계, 개인화 학습 리포트·스마트 알림, 참여·진도·과제 기반 위험군 예측, 교수자·학습자 대시보드, LXP 기반 콘텐츠 추천 | ✅ |
| LearningHUB | 학습자 경험 플랫폼. 통합 학습 홈(다과목 현황·우선 활동·일정), 과목 학습 화면, AI 검색, 학습자 대시보드, 모바일 | ⚠️ 시범운영 중 |
| AI Tutor | 강의자료·자막·강의계획서 기반 Q&A. 학습 가이드, 콘텐츠 추천, 과제 안내, 오답 피드백 | ✅ |
| AI Chat | 여러 AI 모델을 쓸 수 있는 범용 생성형 AI | ✅ |
| AI 자막 · AI 번역 | 강의 영상 자막 자동 생성과 다국어 번역으로 접근성 확대 | ✅ |
| AI TransLive | 실시간 강의 자막·통번역. 외국인 유학생·국제화 수업 | ✅ |
| WiseConnect Share | ✏️ (LearningX 연동, 이용현황 통계 제공) | ⚠️ |
| ZoomX | LearningX와 Zoom 연동 — LMS에서 화상강의 예약·실행·출결 관리 | ✅ |

### 2-5. Assess `/solutions/assess.html` — 평가

메시지 ✏️: "문항 생성부터 채점·피드백까지, 신뢰할 수 있는 평가."

| 제품 | 설명 | 상태 |
|---|---|---|
| XN Quiz | 강의자료 기반 AI 문항 생성 → 검토·승인 → 배포·응시·자동 채점. LMS 성적 연계. (AI Quiz 통합) | ✅ |
| GradeFlow | 서술형·풀이형 과제 AI 예비 채점과 피드백. 루브릭 설계, 교수자 수정·승인 | ⚠️ 시범운영 중 |
| TrustLock AI Proctoring | 온라인 시험 감독, 이상 행동 탐지로 부정행위 방지 | ✅ |
| 설문 | ✏️ (독립 제품인지 LearningX 기능인지 확인) | ⚠️ |

### 2-6. Campus `/solutions/campus.html` — 운영·분석

메시지 ✏️: "대학 운영에 필요한 지식과 데이터를 AI로."

| 제품 | 설명 | 상태 |
|---|---|---|
| AI Campus (구 대학 지식서비스) | 대학의 시스템·지식을 연결해 학사·행정 업무와 학생 문의 지원 | ✅ |
| 비교과/역량 시스템 | 비교과 운영·역량 관리·상담 | 개발 중 |
| AI Commons Neo · InteractFlow · LCDMS · ClassHUB | 신규 제품 (2026-11-16 회의록 기준) | 개발 중 |
| 교수자 AI 대시보드 | 학습 현황·관심 학생 후보군·학습 취약 영역 인사이트 | ⚠️ 개발 중 |
| LearningX AI 플랫폼 | 모델 관리, 권한·활성화 단위 통제, 사용량·감사 로그, AI 투명성 고지 — 모든 AI 서비스의 공통 기반 | ⚠️ 표현 수위 확인 |

> 제품 수가 적으면 Campus를 Learn 하단 섹션으로 합치는 안도 검토. 확정 전까지는 별도 페이지로 마크업.

### 2-7. Services `/services.html`

| 섹션 | 내용 (Notion Product 기반 — ⚠️ 최신화, 0-1 참고) |
|---|---|
| Zoom Education 공식 파트너 | 교육기관 대상 Zoom 리셀링 파트너. 계약부터 운영까지 지원, LMS 연동으로 화상강의 예약·실행·출결 관리. 기관 수 ⚠️(50 vs 60) |
| 교육 시설 인프라 구축 | 스마트 강의실, 강의 자동녹화 강의실, 셀프 스튜디오, 하이브리드 강의실, 대형 LED 컨퍼런스룸. 70여 개 대학·기관 구축 |
| 클라우드 서비스 (공공/민간) | Managed Service Provider — Web·DB 보안·성능 관리. 50여 개 대학 클라우드 인프라 운영 |
| 서비스 데스크 | 고객 문의·요청 접수 창구 (Atlassian 서비스 데스크) |

### 2-8. Customers `/customers.html`

- 헤드: "Xinics와 함께한 대학, 기관" / 400+
- 로고 그리드(그레이스케일 → hover 컬러). 대학 / 기관·기업 탭 구분 ✏️ 분류 필요
- 대표 사례 2~3건 카드 ✏️ (기관명 · 도입 제품 · 성과 한 줄). 사례 확보 전엔 섹션 숨김

### 2-9. About `/company/about.html`

| 섹션 | 내용 |
|---|---|
| Intro | "Exciting Technology Companions" / 20년 이상 400여 대학·기관과 함께한 교육 혁신 파트너 |
| Integrate · Inspire · Impact | Integrate(LMS·CMS·AI를 하나의 생태계로) · Inspire(교수자·학습자의 창의적 동기) · Impact(학습 성과를 증명하는 플랫폼) ✅ 확장 설명 ✏️ |
| 연혁 | ✏️ 자료 필요 (Presto → Commons → LearningX → AI 라인업 흐름) |
| 이렇게 일해요 (People) | 구성원이 하는 일 소개. 인사·조직 개편이 잦아 넓은 역할 8개로: 사업 / 기획 / 디자인 / 개발 / 구축 / 운영 / 매니지드서비스 / 경영지원, 각 한 줄 설명 |
| 오시는 길 | 주소 + 지도 이미지(정적, 외부 지도 임베드 금지) + 대중교통 ✏️ |

### 2-10. Culture `/company/culture.html`

현 사이트 Recruit의 3가지 가치 + Notion Culture 복지를 합친다. 복지 항목은 ⚠️ 최신화(0-1).

| 섹션 | 내용 |
|---|---|
| 일하는 방식 | 자율적인 조직 문화 / 교육에 대한 열정 / 기술 기반 실험 문화 ✅ |
| 각 개인을 위한 | 점심 식대 지원 · 원두커피 무제한 · 건강검진·예방접종 지원(필요 시 즉시 재택) · 생일·명절 선물 |
| 성과와 휴가 | 반반차 휴가 · 잔여 연차 수당 지급 · 출산/보건휴가·육아휴직 장려 · 연차·직급과 무관한 성과 지향 연봉 체계 |

> Notion 원문은 문장이 길다. 항목당 제목 + 1~2문장으로 압축. "코로나19 이후" 같은 시점 표현은 제거.

### 2-11. Recruit `/company/recruit.html`

| 섹션 | 내용 |
|---|---|
| Hero | "Xinics와 함께 미래 교육을 설계할 당신을 기다립니다." ✅ |
| 채용 공고 | 채용공고는 사람인·잡코리아에 수시 게시 → 두 버튼 (URL ✏️ 회사 페이지 주소) |
| 채용 절차 ⚠️ 최신화 | STEP 1 지원서 제출(자유 양식, 1주일 내 서류 결과) → STEP 2 실무진 인터뷰(약 1시간, 상호 인터뷰) → STEP 3 경영진 인터뷰(약 1시간, 비전·문화 Fit) → STEP 4 최종 합격(출근일 협의). 가로 스텝 UI |
| FAQ ⚠️ 최신화 (`<details>` 아코디언, JS 불필요) | ① 인터뷰 방식: 압박 면접 등 비인격적 요소 배제, 편안한 대화형 ② 어학점수·자격증 요건이 없는 이유: 숫자·문서보다 마음가짐과 가치관을 직접 보고자 함 ③ 신입/경력: 실무 판단 기준일 뿐, 의지와 용기가 더 중요 ④ 복장: 정장 불필요, 편안하고 깔끔한 복장 ⑤ 결과 안내: 최종 면접 후 최대 5일 이내(내부 일정에 따라 지연 가능) ⑥ 재지원: 가능. 이전과 달라진 점을 지원서에 충분히 서술 |
| 문의 | recruit@xinics.com |

### 2-12. Contact `/contact.html`

- 대표 연락처: contact@xinics.com, 02-865-8801
- 채용 문의: recruit@xinics.com
- 주소 + 지도 이미지
- 문의 폼: 오픈 범위 제외. 폼 마크업만 만들어 두고 `hidden` (서버 처리 방식 확정 후 활성화)

### 2-13. 404

- "페이지를 찾을 수 없습니다" + 홈/솔루션 링크. Notion 옛 링크로 들어오는 경우 고려해 Company 링크 포함.

---

## 3. 작업 순서 (Claude Code)

1. 골격: 폴더 구조, `tokens.css`·`base.css`, Pretendard 셋업, `partials/`, `scripts/sync-partials.py`, `404.html`
2. 컴포넌트: 모션 토큰·`js/main.js` 공통 모션 유틸(카운트업, 마퀴·탭 일시정지, 요소별 정지 버튼, reduced-motion 처리) 먼저 → 서브페이지 타이틀 블록, 버튼, 섹션 헤더, 제품 카드, 로고 그리드, 스텝, FAQ 아코디언, CTA 밴드, 영역 배지 → `components.css`. 컴포넌트 확인용 `docs/components.html`(배포 제외)
3. Home
4. Solutions 4페이지 (공통 템플릿 먼저)
5. Services · Customers
6. Company 3페이지 · Contact
7. 마무리: sitemap.xml, robots.txt, OG 이미지, 메타 점검, 전체 반응형·접근성 점검, TODO 목록 정리
8. README.md: 서버팀 배포 안내 (정적 파일 업로드 대상, 제외 폴더 `docs/ scripts/ partials/`, 404 설정, HTTPS, 캐시 정책)

각 단계 끝날 때마다: 변경 파일 목록, 남은 TODO, 확인이 필요한 질문을 보고.
