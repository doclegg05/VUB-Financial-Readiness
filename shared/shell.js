/**
 * VubShell — injects the shared app bar + footer on any page that includes it.
 * Owns the Text-Size control (persisted) and the Help hook (VubGlossary).
 * Reads optional window.VUB_PAGE = { course, lesson } for the breadcrumb (M5).
 */
(function (global) {
  'use strict';
  var TS_KEY = 'vub:textsize:v1';
  var SIZES = ['', 'lg', 'xl'];                 // '' = default
  var SEAL = '/assets/vub-seal-white.png';

  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function safeTxt(s) { var d = document.createElement('span'); d.textContent = String(s); return d.innerHTML; }

  function applyTextSize(v) {
    if (v) document.documentElement.setAttribute('data-text-size', v);
    else document.documentElement.removeAttribute('data-text-size');
  }
  function readSize() { try { return localStorage.getItem(TS_KEY) || ''; } catch (e) { return ''; } }
  function writeSize(v) { try { localStorage.setItem(TS_KEY, v); } catch (e) {} }
  function step(dir) {
    var i = SIZES.indexOf(readSize()); if (i < 0) i = 0;
    i = Math.min(SIZES.length - 1, Math.max(0, i + dir));
    writeSize(SIZES[i]); applyTextSize(SIZES[i]);
  }

  function buildAppBar() {
    var bar = el(
      '<header class="vub-appbar"><div class="in">' +
        '<a class="home" href="/" aria-label="VUB Learning home">' +
          '<img class="seal" src="' + SEAL + '" alt="Veterans Upward Bound seal">' +
          '<span><span class="bn">VUB Learning</span><br><span class="bt">Veterans Upward Bound</span></span>' +
        '</a>' +
        '<span class="sp"></span>' +
        '<nav class="vub-controls" aria-label="Site controls">' +
          '<span class="vub-textsize"><span class="lab">Text Size</span>' +
            '<button type="button" class="minus" aria-label="Decrease text size">−</button>' +
            '<button type="button" class="plus" aria-label="Increase text size">+</button></span>' +
          '<a class="vub-help" href="#"><span class="i" aria-hidden="true">?</span> Help</a>' +
          '<a class="vub-instr" href="/instructors/">For Instructors <span aria-hidden="true">▸</span></a>' +
        '</nav>' +
      '</div></header>');
    bar.querySelector('.minus').addEventListener('click', function () { step(-1); });
    bar.querySelector('.plus').addEventListener('click', function () { step(1); });
    bar.querySelector('.vub-help').addEventListener('click', function (e) {
      e.preventDefault();
      if (global.VubGlossary && global.VubGlossary.open) global.VubGlossary.open();
    });
    return bar;
  }

  function buildBreadcrumb() {
    var p = global.VUB_PAGE; if (!p || !p.course) return null;
    var html = '<div class="vub-crumb"><div class="in"><a href="/">Home</a> › <b>' +
      safeTxt(p.course) + '</b>' + (p.lesson ? ' › ' + safeTxt(p.lesson) : '') + '</div></div>';
    return el(html);
  }

  function buildFooter() {
    return el('<footer class="vub-footer"><div class="in">' +
      '<img src="' + SEAL + '" alt=""> A TRIO program · U.S. Department of Education · Veterans Upward Bound' +
      '</div></footer>');
  }

  function init() {
    if (document.querySelector('.vub-appbar')) return;   // already initialized
    document.body.classList.add('vub-has-shell');     // hides glossary's duplicate FAB (see shell.css)
    applyTextSize(readSize());
    var bar = buildAppBar();
    document.body.insertBefore(bar, document.body.firstChild);
    var crumb = buildBreadcrumb();
    if (crumb) bar.insertAdjacentElement('afterend', crumb);
    document.body.appendChild(buildFooter());
    // reduced-motion: pause SMIL flag animation so motion-off users get a still flag
    if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { var f = document.querySelector('svg.vub-flag'); if (f && f.pauseAnimations) f.pauseAnimations(); } catch (e) {}
      document.documentElement.classList.add('vub-reduced-motion');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.VubShell = { applyTextSize: applyTextSize, init: init };
})(window);
