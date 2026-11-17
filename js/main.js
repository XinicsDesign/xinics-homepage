/* ==========================================================================
   Xinics — main.js (v0.2)
   JS 없이도 모든 콘텐츠가 최종 상태로 보인다. 여기서는 UI 보조와 모션만 담당.

   0. Motion       모션 상태 (window.XN.motion) — 동작 줄이기 설정이면 정지
   1. GNB          모바일 메뉴, 드롭다운 aria-expanded, Esc 닫기 + 포커스 복귀
   2. Header       M5 다크 히어로 위 투명 → 벗어나면 흰 배경
   3. In-view      [data-inview] 진입 시 .is-inview (진도 막대 등)
   4. Count-up     M4 [data-countup]
   5. Marquee      M9 [data-marquee] 트랙 복제 (hover 시 정지)
   6. UI cards     M3 타이핑 [data-typing] · M6 자막 순환 [data-cycle] · 퀴즈 정답 [data-quiz]
   7. Loops        [data-loop] 화면 밖이면 .is-offscreen (CSS 애니메이션 정지)
   8. Pause        요소별 정지 버튼 button[data-pause] → 가장 가까운 [data-pausable] 에 .is-paused
   ========================================================================== */
(function () {
  'use strict';

  // head 인라인 스크립트의 안전장치: 이 값이 3초 안에 없으면 no-js 로 되돌린다
  window.XN_READY = true;

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktop = window.matchMedia('(min-width: 1024px)');
  var hasIO = 'IntersectionObserver' in window;

  function each(selector, fn, ctx) {
    Array.prototype.forEach.call((ctx || document).querySelectorAll(selector), fn);
  }

  /* ------------------------------------------------------------------------
     0. Motion — 동작 줄이기 설정이면 모든 자동 모션 정지.
        다른 스크립트(tabs.js, flow-canvas.js)도 이 객체를 본다.
        (전역 정지 버튼은 2026-11-17 피드백으로 제거 — hover 시 일시정지·화면 밖 정지는 유지)
     ------------------------------------------------------------------------ */
  var listeners = [];
  var motion = {
    reduced: reduceMotion.matches,
    paused: reduceMotion.matches,
    set: function (paused) {
      motion.paused = paused;
      root.classList.toggle('motion-paused', paused);
      listeners.forEach(function (fn) { fn(paused); });
    },
    onChange: function (fn) { listeners.push(fn); }
  };
  window.XN = window.XN || {};
  window.XN.motion = motion;
  root.classList.toggle('motion-paused', motion.paused);
  // 이전 버전의 정지 버튼 저장값 정리 (버튼이 없으니 남아 있으면 안 됨)
  try { window.localStorage.removeItem('xn-motion-paused'); } catch (e) { /* 무시 */ }

  /* ------------------------------------------------------------------------
     1. GNB
     ------------------------------------------------------------------------ */
  var header = document.querySelector('[data-header]');

  function initNav() {
    if (!header) return;

    var toggle = header.querySelector('[data-nav-toggle]');
    var toggleLabel = header.querySelector('[data-nav-toggle-label]');
    var subToggles = Array.prototype.slice.call(header.querySelectorAll('[data-sub-toggle]'));

    function setSub(btn, open) { btn.setAttribute('aria-expanded', String(open)); }
    function closeSubs(except) { subToggles.forEach(function (b) { if (b !== except) setSub(b, false); }); }
    function openSub() {
      for (var i = 0; i < subToggles.length; i++) {
        if (subToggles[i].getAttribute('aria-expanded') === 'true') return subToggles[i];
      }
      return null;
    }

    subToggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        if (desktop.matches) closeSubs(btn);
        setSub(btn, open);
      });
    });

    function isMenuOpen() { return header.classList.contains('is-menu-open'); }

    function setMenu(open) {
      if (!toggle) return;
      toggle.setAttribute('aria-expanded', String(open));
      if (toggleLabel) toggleLabel.textContent = open ? '메뉴 닫기' : '메뉴 열기';
      header.classList.toggle('is-menu-open', open);
      root.classList.toggle('menu-open', open);
      if (open) {
        subToggles.forEach(function (btn) {
          if (btn.parentNode.classList.contains('is-current')) setSub(btn, true);
        });
      } else {
        closeSubs();
      }
    }

    if (toggle) toggle.addEventListener('click', function () { setMenu(!isMenuOpen()); });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var sub = openSub();
      if (sub && desktop.matches) {
        setSub(sub, false);
        sub.focus();
      } else if (isMenuOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (desktop.matches && !header.contains(e.target)) closeSubs();
    });

    header.addEventListener('focusout', function (e) {
      if (!desktop.matches) return;
      var item = e.target.closest('.has-sub');
      if (item && !item.contains(e.relatedTarget)) setSub(item.querySelector('[data-sub-toggle]'), false);
    });

    var onBp = function () { if (desktop.matches) setMenu(false); else closeSubs(); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBp);
    else if (desktop.addListener) desktop.addListener(onBp);
  }

  /* ------------------------------------------------------------------------
     2. Header (M5)
     ------------------------------------------------------------------------ */
  function initHeaderScroll() {
    if (!header) return;
    var hero = document.querySelector('[data-hero]');
    if (!hero || !document.body.classList.contains('page--dark-hero')) {
      header.classList.add('is-solid');
      return;
    }
    var ticking = false;
    function update() {
      ticking = false;
      var bottom = hero.getBoundingClientRect().bottom;
      header.classList.toggle('is-solid', bottom <= header.offsetHeight);
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------------
     3. In-view
     ------------------------------------------------------------------------ */
  function initInview() {
    var targets = document.querySelectorAll('[data-inview]');
    if (!targets.length) return;
    if (!hasIO) {
      each('[data-inview]', function (el) { el.classList.add('is-inview'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    each('[data-inview]', function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     4. Count-up (M4) — 최종값은 HTML 에. 표시용 span 만 0부터 1.5초
       <dd data-countup="500" [data-decimals="1"]>
         <span class="sr-only">500곳 이상</span>
         <span aria-hidden="true"><span data-countup-value>500</span>+<span class="stat-num__unit">곳</span></span>
       </dd>
     ------------------------------------------------------------------------ */
  var COUNT_MS = 1500;

  function initCountup() {
    if (!hasIO || motion.reduced) return;
    var items = document.querySelectorAll('[data-countup]');
    if (!items.length) return;

    function run(el) {
      var out = el.querySelector('[data-countup-value]');
      var to = parseFloat(el.getAttribute('data-countup'));
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var final = out.getAttribute('data-final');
      var start = null;
      var done = false;
      function frame(now) {
        if (done) return;
        if (start === null) start = now;
        var t = Math.min((now - start) / COUNT_MS, 1);
        out.textContent = (to * (1 - Math.pow(1 - t, 4))).toFixed(dec);
        if (t < 1) window.requestAnimationFrame(frame);
        else { done = true; out.textContent = final; }
      }
      window.requestAnimationFrame(frame);
      // 탭이 백그라운드라 rAF 가 멈춰도 최종 숫자는 반드시 보이게
      window.setTimeout(function () { done = true; out.textContent = final; }, COUNT_MS + 300);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target);
      });
    }, { threshold: 0.5 });

    Array.prototype.forEach.call(items, function (el) {
      var out = el.querySelector('[data-countup-value]');
      if (!out || isNaN(parseFloat(el.getAttribute('data-countup')))) return;
      // 폭 고정 → Layout Shift 방지
      out.style.display = 'inline-block';
      out.style.minWidth = out.getBoundingClientRect().width + 'px';
      out.style.textAlign = 'left';
      out.setAttribute('data-final', out.textContent);
      out.textContent = '0';
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     5. Marquee (M9)
     ------------------------------------------------------------------------ */
  function initMarquee() {
    if (motion.reduced) return;
    each('[data-marquee]', function (m) {
      var inner = m.querySelector('.marquee__inner');
      var track = m.querySelector('.marquee__track');
      if (!inner || !track) return;
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      each('img', function (img) { img.alt = ''; }, clone);
      inner.appendChild(clone);
      m.classList.add('is-animated');

    });
  }

  /* ------------------------------------------------------------------------
     6. 예시 UI 카드 모션 — 모두 role="img" 안의 aria-hidden 영역
     ------------------------------------------------------------------------ */
  function isHeld(el) {
    // 동작 줄이기, 화면 밖, hover·포커스 시 일시정지
    if (motion.paused || el.closest('.is-paused')) return true;
    var box = el.closest('[data-loop]');
    if (!box) return false;
    return box.classList.contains('is-offscreen') || box.matches(':hover') || box.matches(':focus-within');
  }

  function initTyping() {
    if (motion.reduced) return;   // 동작 줄이기: 전체 문장 그대로
    each('[data-typing]', function (el) {
      var full = el.textContent;
      var once = el.getAttribute('data-typing') === 'once';   // 한 번만 쓰고 끝 (정지 버튼 불필요)
      var n = 0;
      var HOLD = 50;   // 다 쓴 뒤 멈춰 있는 틱 수 (반복 시)
      el.classList.add('ui-caret');
      el.textContent = '';
      (function tick() {
        if (!isHeld(el)) {
          n += 1;
          if (n > full.length + HOLD) n = 0;
        }
        el.textContent = full.slice(0, Math.min(n, full.length));
        if (once && n >= full.length) {
          el.classList.remove('ui-caret');
          return;
        }
        window.setTimeout(tick, 48);
      })();
    });
  }

  function initCycle() {
    if (motion.reduced) return;
    var items = [];
    each('[data-cycle]', function (el) {
      try {
        var list = JSON.parse(el.getAttribute('data-cycle'));
        if (Array.isArray(list) && list.length) items.push({ el: el, list: [el.textContent].concat(list) });
      } catch (e) { /* 잘못된 데이터 무시 */ }
    });
    if (!items.length) return;
    var i = 0;
    window.setInterval(function () {
      if (items.every(function (it) { return isHeld(it.el); })) return;
      i += 1;
      items.forEach(function (it) {
        if (!isHeld(it.el)) it.el.textContent = it.list[i % it.list.length];
      });
    }, 3000);
  }

  function initQuiz() {
    if (motion.reduced) return;
    each('[data-quiz]', function (q) {
      var hit = q.querySelector('[data-correct]');
      if (!hit) return;
      hit.classList.remove('is-hit');
      var step = 0;
      window.setInterval(function () {
        if (isHeld(q)) return;
        step = (step + 1) % 3;
        hit.classList.toggle('is-hit', step === 1);
      }, 1400);
    });
  }

  /* ------------------------------------------------------------------------
     7. Loops — 화면 밖이면 정지
     ------------------------------------------------------------------------ */
  function initLoops() {
    if (!hasIO) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
      });
    });
    each('[data-loop]', function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     8. Pause — 요소별 정지 버튼 (WCAG 2.2.2)
     ------------------------------------------------------------------------ */
  function initPauseButtons() {
    if (motion.reduced) return;   // 동작 줄이기: 움직임이 없으니 버튼도 숨김 유지
    each('button[data-pause]', function (btn) {
      var box = btn.closest('[data-pausable]');
      if (!box) return;
      var name = btn.getAttribute('data-pause-name') || '움직임';
      function render() {
        var paused = box.classList.contains('is-paused');
        btn.setAttribute('aria-label', name + (paused ? ' 재생' : ' 멈추기'));
        btn.title = btn.getAttribute('aria-label');
      }
      btn.hidden = false;
      btn.addEventListener('click', function () {
        box.classList.toggle('is-paused');
        render();
        document.dispatchEvent(new CustomEvent('xn:pausechange'));
      });
      render();
    });
  }

  initNav();
  initPauseButtons();
  initHeaderScroll();
  initInview();
  initCountup();
  initMarquee();
  initLoops();
  initTyping();
  initCycle();
  initQuiz();
})();
