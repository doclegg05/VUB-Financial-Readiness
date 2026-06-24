/**
 * VubTextSize — global text-size control for both shell and legacy pages.
 * Uses the same persisted html[data-text-size] attribute as shared/shell.js.
 */
(function (global) {
  'use strict';

  var TS_KEY = 'vub:textsize:v1';
  var SIZES = ['sm', '', 'lg', 'xl', 'xxl'];
  var LABELS = {
    sm: 'Smaller text',
    '': 'Default text',
    lg: 'Large text',
    xl: 'Larger text',
    xxl: 'Largest text'
  };

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function readSize() {
    try {
      var saved = localStorage.getItem(TS_KEY) || '';
      return SIZES.indexOf(saved) >= 0 ? saved : '';
    } catch (e) {
      return '';
    }
  }

  function writeSize(value) {
    try { localStorage.setItem(TS_KEY, value); } catch (e) {}
  }

  function applyTextSize(value) {
    if (value) document.documentElement.setAttribute('data-text-size', value);
    else document.documentElement.removeAttribute('data-text-size');
    syncControls(value);
  }

  function step(direction) {
    var current = readSize();
    var index = SIZES.indexOf(current);
    if (index < 0) index = 1;
    index = Math.min(SIZES.length - 1, Math.max(0, index + direction));
    var next = SIZES[index];
    writeSize(next);
    applyTextSize(next);
  }

  function syncControls(value) {
    var label = LABELS[value || ''] || LABELS[''];
    document.querySelectorAll('[data-vub-textsize-status]').forEach(function (node) {
      node.textContent = label;
    });
    document.querySelectorAll('[data-vub-textsize-minus]').forEach(function (button) {
      button.disabled = SIZES.indexOf(value || '') <= 0;
    });
    document.querySelectorAll('[data-vub-textsize-plus]').forEach(function (button) {
      button.disabled = SIZES.indexOf(value || '') >= SIZES.length - 1;
    });
  }

  function installStyles() {
    if (document.getElementById('vub-text-size-styles')) return;
    document.head.appendChild(el(
      '<style id="vub-text-size-styles">' +
        '@media screen{' +
        'html[data-text-size="sm"]{font-size:94%;--fs-base:16px;--fs-slide:22px;--lh:1.6;--vub-text-min:16px;--vub-ui-min:15px;--vub-line-height:1.6}' +
        'html[data-text-size="lg"]{font-size:112.5%;--fs-base:22px;--fs-slide:32px;--lh:1.85;--vub-text-min:21px;--vub-ui-min:18px;--vub-line-height:1.85}' +
        'html[data-text-size="xl"]{font-size:125%;--fs-base:26px;--fs-slide:38px;--lh:1.95;--vub-text-min:24px;--vub-ui-min:20px;--vub-line-height:1.95}' +
        'html[data-text-size="xxl"]{font-size:137.5%;--fs-base:30px;--fs-slide:44px;--lh:2.05;--vub-text-min:28px;--vub-ui-min:22px;--vub-line-height:2.05}' +
        'html[data-text-size] body{font-size:var(--fs-base)!important;line-height:var(--vub-line-height)!important}' +
        'html[data-text-size] :where(p,li,dd,dt,td,th,label,input,textarea,select,summary,figcaption,blockquote){font-size:max(1em,var(--vub-text-min))!important;line-height:var(--vub-line-height)!important}' +
        'html[data-text-size] :where(button,a,.btn,.slide-link,.resource-link,.nav-links a,.detail,.meta,.caption,.small){font-size:max(1em,var(--vub-ui-min))!important;line-height:1.45!important}' +
        '}' +
        '.vub-textsize-fab{position:fixed;right:18px;top:18px;z-index:10000;display:inline-flex;align-items:center;gap:8px;padding:7px;border:1px solid rgba(228,196,90,.65);border-radius:10px;background:linear-gradient(180deg,#0C2E55,#07223F);color:#fff;box-shadow:0 8px 22px rgba(0,0,0,.28);font-family:Source Sans 3,Segoe UI,Verdana,sans-serif}' +
        '.vub-textsize-fab .lab{font-size:13px;font-weight:800;white-space:nowrap}.vub-textsize-fab .status{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}' +
        '.vub-textsize-fab button{min-width:44px;min-height:38px;border:1px solid rgba(94,134,196,.8);border-radius:8px;background:rgba(7,34,63,.35);color:#fff;font-size:17px;font-weight:800;cursor:pointer;letter-spacing:.01em}.vub-textsize-fab button:disabled{opacity:.45;cursor:not-allowed}' +
        '@media(max-width:520px){.vub-textsize-fab{right:10px;top:10px}.vub-textsize-fab .lab{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}}' +
        '@media print{.vub-textsize-fab{display:none!important}}' +
      '</style>'
    ));
  }

  function bindControls(root) {
    var minus = root.querySelector('[data-vub-textsize-minus], .minus');
    var plus = root.querySelector('[data-vub-textsize-plus], .plus');
    if (minus && !minus.dataset.vubBound) {
      minus.dataset.vubBound = 'true';
      minus.setAttribute('data-vub-textsize-minus', '');
      minus.addEventListener('click', function () { step(-1); });
    }
    if (plus && !plus.dataset.vubBound) {
      plus.dataset.vubBound = 'true';
      plus.setAttribute('data-vub-textsize-plus', '');
      plus.addEventListener('click', function () { step(1); });
    }
  }

  function ensureControl() {
    var shellControl = document.querySelector('.vub-appbar .vub-textsize');
    if (shellControl) {
      if (!shellControl.querySelector('[data-vub-textsize-status]')) {
        shellControl.appendChild(el('<span class="status" data-vub-textsize-status></span>'));
      }
      bindControls(shellControl);
      return;
    }

    if (!document.querySelector('.vub-textsize-fab')) {
      document.body.appendChild(el(
        '<div class="vub-textsize-fab vub-textsize" role="group" aria-label="Text size">' +
          '<span class="lab">Text Size</span>' +
          '<button type="button" class="minus" data-vub-textsize-minus aria-label="Decrease text size">A−</button>' +
          '<button type="button" class="plus" data-vub-textsize-plus aria-label="Increase text size">A+</button>' +
          '<span class="status" data-vub-textsize-status></span>' +
        '</div>'
      ));
    }
    bindControls(document.querySelector('.vub-textsize-fab'));
  }

  function init() {
    installStyles();
    applyTextSize(readSize());
    // Shell pages create their app bar on DOMContentLoaded. Defer one tick so
    // this module can attach to it instead of adding a duplicate floating group.
    setTimeout(function () {
      ensureControl();
      syncControls(readSize());
    }, 0);
  }

  global.VubTextSize = {
    apply: applyTextSize,
    read: readSize,
    step: step,
    sizes: SIZES.slice()
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);
