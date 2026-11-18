/* ==========================================================================
   Xinics — flow-canvas.js : 흐름선 Canvas
   M1  홈 히어로   <canvas data-flow="hero">  4색 곡선 물결 + 빛 점(좌→우)
   M12 CTA 블록    <canvas data-flow="cta">   느린 버전, 빛 점 없음

   - Canvas 는 aria-hidden="true" (장식)
   - 화면 밖이면 렌더링 중지 (IntersectionObserver)
   - 동작 줄이기: 정지 프레임 1장만 그림
   - 정지 버튼: 가까운 [data-pausable] 이 .is-paused 면 그 Canvas 만 멈춤 (hero)
   - CTA(마지막 안내 블록)는 화면에 보인 뒤 5초 동안만 움직이고 멈춤 → 정지 버튼 불필요 (WCAG 2.2.2)
   - 색은 tokens.css 의 --teach/--learn/--assess/--campus 를 읽어 씀
   - CPU 4x 감속에서 끊기면 PARTICLES = 0 으로 빛 점부터 제거
   ========================================================================== */
(function () {
  'use strict';

  var canvases = document.querySelectorAll('canvas[data-flow]');
  if (!canvases.length || !window.requestAnimationFrame) return;

  var motion = (window.XN && window.XN.motion) || { paused: false, reduced: false, onChange: function () {} };
  var PARTICLES = 3;   // 선마다 빛 점 수 (hero)
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var css = getComputedStyle(document.documentElement);
  var colors = ['--teach', '--learn', '--assess', '--campus'].map(function (v) {
    return hexToRgb(css.getPropertyValue(v).trim() || '#888888');
  });
  var white = hexToRgb(css.getPropertyValue('--bg').trim() || '#ffffff');
  var brand = hexToRgb(css.getPropertyValue('--brand').trim() || '#2F5BFF');

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgba(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  var items = Array.prototype.map.call(canvases, function (cv) {
    var mode = cv.getAttribute('data-flow') === 'cta' ? 'cta' : 'hero';
    var parts = [];
    if (mode === 'hero') {
      for (var i = 0; i < 4; i++) {
        for (var k = 0; k < PARTICLES; k++) parts.push({ line: i, p: Math.random() });
      }
    }
    return { cv: cv, ctx: cv.getContext('2d'), mode: mode, parts: parts, visible: true, W: 0, H: 0, t: 0, done: false };
  });

  function size(o) {
    var r = o.cv.getBoundingClientRect();
    o.W = r.width;
    o.H = r.height;
    o.cv.width = Math.round(o.W * DPR);
    o.cv.height = Math.round(o.H * DPR);
    o.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  var CTA_LIMIT = 5;   // 초

  function yAt(o, i, x) {
    var W = o.W, H = o.H, t = o.t;
    if (o.mode === 'hero') {
      return H * (0.26 + i * 0.1) +
        Math.sin(x / W * Math.PI * 2.2 + t * 0.35 + i * 1.3) * H * 0.08 +
        Math.sin(x / W * Math.PI * 3.4 - t * 0.22 + i) * H * 0.03;
    }
    return H * (0.62 + i * 0.06) +
      Math.sin(x / W * 6.3 + t * 0.4 + i * 1.1) * H * 0.08 +
      Math.sin(x / W * 2.1 - t * 0.25) * H * 0.05;
  }

  function draw(o) {
    var x = o.ctx, W = o.W, H = o.H;
    if (!W || !H) return;
    x.clearRect(0, 0, W, H);

    if (o.mode === 'hero') {
      var g = x.createRadialGradient(W * 0.78, H * 0.4, 0, W * 0.78, H * 0.4, W * 0.45);
      g.addColorStop(0, rgba(brand, 0.25));
      g.addColorStop(1, rgba(brand, 0));
      x.fillStyle = g;
      x.fillRect(0, 0, W, H);
    }

    for (var i = 0; i < 4; i++) {
      x.beginPath();
      for (var px = -8; px <= W + 8; px += 7) {
        var y = yAt(o, i, px);
        if (px < 0) x.moveTo(px, y); else x.lineTo(px, y);
      }
      var lg = x.createLinearGradient(0, 0, W, 0);
      var c = colors[i];
      if (o.mode === 'hero') {
        // 왼쪽(텍스트 쪽)은 투명도 낮게
        lg.addColorStop(0, rgba(c, 0.08));
        lg.addColorStop(0.45, rgba(c, 0.25));
        lg.addColorStop(0.8, rgba(c, 0.75));
        lg.addColorStop(1, rgba(c, 0.5));
      } else {
        lg.addColorStop(0, rgba(c, 0));
        lg.addColorStop(0.5, rgba(c, 0.69));
        lg.addColorStop(1, rgba(c, 0));
      }
      x.strokeStyle = lg;
      x.lineWidth = o.mode === 'hero' ? 1.5 : 1.3;
      if (o.mode === 'hero') {
        x.shadowColor = rgba(c, 1);
        x.shadowBlur = 10;
      }
      x.stroke();
      x.shadowBlur = 0;
    }

    if (o.mode === 'hero') {
      o.parts.forEach(function (p) {
        var px = p.p * W;
        var py = yAt(o, p.line, px);
        x.globalAlpha = Math.min(1, 0.1 + px / W * 1.3);
        var r = x.createRadialGradient(px, py, 0, px, py, 14);
        r.addColorStop(0, rgba(white, 0.95));
        r.addColorStop(0.25, rgba(colors[p.line], 1));
        r.addColorStop(1, rgba(colors[p.line], 0));
        x.fillStyle = r;
        x.beginPath();
        x.arc(px, py, 14, 0, Math.PI * 2);
        x.fill();
        x.globalAlpha = 1;
      });
    }
  }

  var running = false;
  var last = 0;

  function frame(now) {
    if (!running) return;
    var dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    items.forEach(function (o) {
      if (!isActive(o)) return;
      o.t += dt;
      if (o.mode === 'cta' && o.t >= CTA_LIMIT) o.done = true;
      o.parts.forEach(function (p) {
        p.p = (p.p + (0.09 + p.line * 0.012) * dt) % 1;
      });
      draw(o);
    });
    window.requestAnimationFrame(frame);
  }

  function isActive(o) {
    return o.visible && !o.done && !o.cv.closest('.is-paused');
  }

  function shouldRun() {
    return !motion.paused && items.some(isActive);
  }

  function update() {
    if (shouldRun()) {
      if (!running) {
        running = true;
        last = performance.now();
        window.requestAnimationFrame(frame);
      }
    } else {
      running = false;
    }
  }

  function resizeAll() {
    items.forEach(function (o) { size(o); draw(o); });
  }

  resizeAll();
  window.addEventListener('resize', resizeAll);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        items.forEach(function (o) {
          if (o.cv === entry.target) o.visible = entry.isIntersecting;
        });
      });
      update();
    });
    items.forEach(function (o) { io.observe(o.cv); });
  }

  motion.onChange(update);
  document.addEventListener('xn:pausechange', update);
  update();
})();
