/* ==========================================================================
   Xinics — tabs.js : 4단계 탭 (M7, WAI-ARIA Tabs 패턴)

   마크업 (JS 없으면 모든 단계·패널이 펼쳐진 목록으로 보임):
     <div class="tabs" data-tabs data-label="교육 단계">
       <div class="tabs__list">
         <button class="tab" type="button" data-area="teach">…</button> × N
       </div>
       <div class="tabs__stage">
         <div class="tab-panel">…</div> × N
       </div>
     </div>

   - role=tablist/tab/tabpanel, aria-selected, aria-controls, roving tabindex
   - ← → ↑ ↓ / Home / End, 비활성 패널은 inert + aria-hidden
   - 자동 진행: 활성 탭 진행 바(6초)가 끝나면 다음 탭
     탭을 클릭하면 그 탭부터 진행 바가 다시 시작되고 자동 진행은 계속 (2026-11-17 피드백)
     키보드 포커스가 탭에 있는 동안만 일시정지 (CSS :focus-visible)
     동작 줄이기면 자동 진행 안 함
   ========================================================================== */
(function () {
  'use strict';

  var motion = (window.XN && window.XN.motion) || { paused: false, reduced: false, onChange: function () {} };

  function init(root, idx) {
    var list = root.querySelector('.tabs__list');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.tab'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.tab-panel'));
    if (!list || !tabs.length || tabs.length !== panels.length) return;

    var current = 0;
    var auto = !motion.reduced;

    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', root.getAttribute('data-label') || '탭');
    list.setAttribute('aria-orientation', 'vertical');

    tabs.forEach(function (tab, i) {
      var tid = 'tab-' + idx + '-' + i;
      var pid = 'tabpanel-' + idx + '-' + i;
      tab.id = tid;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', pid);
      panels[i].id = pid;
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tid);
      // 패널 안에 포커스 가능한 요소가 없으므로 패널 자체를 탭 순서에 포함 (WAI-ARIA 권고)
      if (!panels[i].querySelector('a[href],button,input,select,textarea,[tabindex]')) panels[i].tabIndex = 0;
    });

    function select(i, focus) {
      current = i;
      tabs.forEach(function (tab, k) {
        var on = k === i;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        // 진행 바 애니메이션 재시작
        var bar = tab.querySelector('.tab__bar');
        if (bar && on) {
          bar.style.animation = 'none';
          void bar.offsetWidth;
          bar.style.animation = '';
        }
      });
      panels.forEach(function (p, k) {
        var on = k === i;
        p.classList.toggle('is-active', on);
        p.inert = !on;
        if (on) p.removeAttribute('aria-hidden');
        else p.setAttribute('aria-hidden', 'true');
      });
      if (focus) tabs[i].focus();
    }

    function syncAuto() {
      root.classList.toggle('is-auto', auto && !motion.paused);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(i);
      });

      tab.addEventListener('keydown', function (e) {
        var n = tabs.length;
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (current + 1) % n;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (current - 1 + n) % n;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = n - 1;
        if (next === null) return;
        e.preventDefault();
        select(next, true);
      });

      // 진행 바가 끝나면 다음 탭 (hover·포커스 중에는 CSS 가 바를 멈춰 이벤트가 오지 않음)
      var bar = tab.querySelector('.tab__bar');
      if (bar) {
        bar.addEventListener('animationend', function () {
          if (!auto || motion.paused || tab.getAttribute('aria-selected') !== 'true') return;
          select((current + 1) % tabs.length);
        });
      }
    });

    motion.onChange(syncAuto);
    root.classList.add('is-ready');
    select(0);
    syncAuto();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), init);
})();
