/**
 * VubGlossary — plain-language help modal for older veteran learners.
 *
 * Auto-mounts a floating "?" button and modal on any page that includes this
 * script. Term data is embedded so the file works equally well from a web
 * server or via file:// (offline-first).
 *
 * To add or edit terms: scroll to TERMS array below.
 */
(function (global) {
  'use strict';

  // ─── Auto-load sibling glossary.css ──────────────────────
  // Lets pages include only this script (not also a separate stylesheet link).
  (function loadStyles() {
    if (document.querySelector('link[data-vub-glossary-css]')) return;
    let scriptSrc = '';
    if (document.currentScript && document.currentScript.src) {
      scriptSrc = document.currentScript.src;
    } else {
      // Fallback: find the script tag whose src ends in /glossary.js
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && /glossary\.js(\?.*)?$/.test(scripts[i].src)) {
          scriptSrc = scripts[i].src;
          break;
        }
      }
    }
    if (!scriptSrc) return;
    const cssHref = scriptSrc.replace(/glossary\.js(\?.*)?$/, 'glossary.css');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.setAttribute('data-vub-glossary-css', 'true');
    document.head.appendChild(link);
  })();

  // ─── Term data ──────────────────────────────────────────
  // Edit freely. Categories group terms in the modal. `aliases` are also
  // searched (so "2FA" finds "Two-factor authentication").
  const TERMS = [
    // ── Web & Browsing ─────────────────────
    { term: 'URL', cat: 'Web & Browsing', aliases: ['web address', 'link'],
      def: 'The address of a webpage. It usually starts with "https://". You type or paste it into your browser to visit that page.' },
    { term: 'Browser', cat: 'Web & Browsing', aliases: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      def: 'The program you use to visit websites — like Microsoft Edge, Google Chrome, or Firefox.' },
    { term: 'Browser tab', cat: 'Web & Browsing', aliases: ['tab'],
      def: 'A single open page inside your browser. You can have many tabs open at once across the top of the browser window.' },
    { term: 'Address bar', cat: 'Web & Browsing',
      def: 'The long text box at the top of your browser where the website address (URL) appears. You can type or paste a new address there.' },
    { term: 'Refresh / Reload', cat: 'Web & Browsing', aliases: ['F5'],
      def: 'Tells the browser to fetch the latest version of a page. The button is usually a circular arrow near the address bar; pressing F5 also works.' },
    { term: 'Bookmark', cat: 'Web & Browsing', aliases: ['favorite'],
      def: 'A saved shortcut to a website you visit often, so you don\'t have to remember the address.' },
    { term: 'Search engine', cat: 'Web & Browsing', aliases: ['Google', 'Bing'],
      def: 'A website like Google or Bing where you type what you\'re looking for and it shows you matching pages.' },
    { term: 'Wi-Fi', cat: 'Web & Browsing', aliases: ['wireless internet', 'wifi'],
      def: 'Wireless internet. Your device connects to a Wi-Fi network using a name (SSID) and usually a password.' },

    // ── Accounts & Security ────────────────
    { term: 'Login / Sign in', cat: 'Accounts & Security',
      def: 'Proving you are you on a website by typing your username and password.' },
    { term: 'Username', cat: 'Accounts & Security', aliases: ['user ID'],
      def: 'The name you use to identify yourself on a website. Often it\'s your email address.' },
    { term: 'Password', cat: 'Accounts & Security',
      def: 'A secret word or phrase you use to prove an account belongs to you. Never share it with anyone.' },
    { term: 'Two-factor authentication', cat: 'Accounts & Security', aliases: ['2FA', 'MFA', 'verification code'],
      def: 'An extra security step. After your password, the website sends a short code to your phone or email that you also have to type in.' },
    { term: 'ID.me', cat: 'Accounts & Security',
      def: 'A trusted identity service that VA uses to confirm you\'re really you. You verify once with ID.me, then use that login to access VA.gov, MyHealtheVet, and more.' },
    { term: 'Phishing', cat: 'Accounts & Security', aliases: ['scam email', 'spoof'],
      def: 'A scam where someone pretends to be a trusted company (the VA, your bank, etc.) to trick you into giving up your password or money. If something feels off, don\'t click — go to the real website yourself.' },
    { term: 'Account', cat: 'Accounts & Security',
      def: 'Your personal record on a website. It remembers things like your settings, files, and history once you log in.' },

    // ── Files & Folders ────────────────────
    { term: 'File', cat: 'Files & Folders', aliases: ['document'],
      def: 'A single saved item on your computer — like a letter, photo, or spreadsheet.' },
    { term: 'Folder', cat: 'Files & Folders', aliases: ['directory'],
      def: 'A container that holds files (and other folders). Just like a paper file folder, but on your computer.' },
    { term: 'Download', cat: 'Files & Folders',
      def: 'Bringing a file from the internet onto your computer so you can keep it. Downloads usually land in your "Downloads" folder.' },
    { term: 'Upload', cat: 'Files & Folders',
      def: 'Sending a file from your computer up to a website (like attaching a photo to an email or putting a document in Google Drive).' },
    { term: 'Cloud storage', cat: 'Files & Folders', aliases: ['Google Drive', 'OneDrive', 'iCloud'],
      def: 'Files saved on the internet instead of on your computer. You can reach them from any device after you log in.' },
    { term: 'File Explorer', cat: 'Files & Folders', aliases: ['Windows Explorer'],
      def: 'The Windows program for browsing your files and folders. The yellow folder icon on the taskbar opens it.' },
    { term: 'Drive (C:, D:)', cat: 'Files & Folders', aliases: ['hard drive'],
      def: 'A storage area on your computer. C: is usually the main one where Windows lives. External drives often appear as D: or E:.' },
    { term: 'Attachment', cat: 'Files & Folders', aliases: ['email attachment'],
      def: 'A file (photo, document, etc.) sent along with an email. The paperclip icon usually means there\'s an attachment.' },

    // ── Windows & Keyboard ─────────────────
    { term: 'Window', cat: 'Windows & Keyboard',
      def: 'A box on your screen showing one program or document. You can have many open at once and move between them.' },
    { term: 'Minimize', cat: 'Windows & Keyboard',
      def: 'Hides a window down to the taskbar without closing it. Click the dash button (–) in the top-right.' },
    { term: 'Maximize', cat: 'Windows & Keyboard',
      def: 'Makes a window fill the whole screen. Click the square button next to the X in the top-right.' },
    { term: 'Snap (window snapping)', cat: 'Windows & Keyboard',
      def: 'Drag a window to the edge of the screen, or press Windows-Key + Arrow, to make it fill half the screen automatically. Great for working with two windows side-by-side.' },
    { term: 'Taskbar', cat: 'Windows & Keyboard',
      def: 'The bar across the bottom of the screen showing your open programs and the Start button.' },
    { term: 'Start menu', cat: 'Windows & Keyboard',
      def: 'The menu that opens when you click the Windows logo in the bottom-left corner. Use it to find programs and shut down the computer.' },
    { term: 'Keyboard shortcut', cat: 'Windows & Keyboard', aliases: ['hotkey'],
      def: 'A combination of keys (like Ctrl+C) that does something quickly. Faster than using the mouse for common actions.' },
    { term: 'Right-click', cat: 'Windows & Keyboard',
      def: 'Pressing the right mouse button. Usually opens a small menu with options like Copy, Paste, or Properties.' },
    { term: 'Screenshot', cat: 'Windows & Keyboard', aliases: ['screen capture', 'PrtScn'],
      def: 'A picture of what\'s on your screen. Press Windows-Key + Shift + S to grab any part of the screen, or PrtScn for the whole thing.' },

    // ── Email ─────────────────────────────
    { term: 'Inbox', cat: 'Email',
      def: 'Where new email arrives. Most email programs open to your inbox by default.' },
    { term: 'CC vs. BCC', cat: 'Email', aliases: ['carbon copy', 'blind carbon copy'],
      def: 'CC ("carbon copy") sends a copy to others — everyone can see who got it. BCC ("blind carbon copy") hides those addresses from the other recipients.' },
    { term: 'Reply / Reply All / Forward', cat: 'Email',
      def: 'Reply answers just the sender. Reply All answers the sender and everyone else who got the email. Forward sends the email to someone new.' },
    { term: 'Spam', cat: 'Email', aliases: ['junk mail'],
      def: 'Unwanted bulk email — ads, scams, or junk. Most email programs sort it into a "Spam" or "Junk" folder automatically.' },
    { term: 'Draft', cat: 'Email',
      def: 'An email you started writing but haven\'t sent yet. Most email saves drafts automatically.' },

    // ── AI Tools ──────────────────────────
    { term: 'Artificial Intelligence (AI)', cat: 'AI Tools',
      def: 'Software that can answer questions, summarize text, and have conversations. ChatGPT and Microsoft Copilot are common examples.' },
    { term: 'ChatGPT', cat: 'AI Tools',
      def: 'A free AI tool from OpenAI. You type a question or request and it writes back. Great for explanations, summaries, and brainstorming — but always double-check important facts.' },
    { term: 'Prompt', cat: 'AI Tools',
      def: 'The question or instruction you type to an AI tool. Better, clearer prompts give better answers.' },

    // ── VA & Veterans Services ────────────
    { term: 'VA.gov', cat: 'VA & Veterans Services',
      def: 'The main website for Department of Veterans Affairs services — benefits, healthcare, records, and more. Sign in with ID.me.' },
    { term: 'MyHealtheVet', cat: 'VA & Veterans Services', aliases: ['MHV'],
      def: 'The VA\'s online health portal. Refill prescriptions, send secure messages to your care team, and view test results and appointments.' },
    { term: 'eBenefits', cat: 'VA & Veterans Services',
      def: 'Older VA portal for benefits and military records. Many features have moved to VA.gov, but eBenefits still hosts some.' },

    // ── Financial Readiness ───────────────
    { term: 'TSP', cat: 'Financial Readiness', aliases: ['Thrift Savings Plan'],
      def: 'Thrift Savings Plan — the federal government\'s retirement savings plan, similar to a civilian 401(k).' },
    { term: 'TRICARE', cat: 'Financial Readiness',
      def: 'Health insurance for military members, retirees, and their families. TRICARE for Life works with Medicare for retirees over 65.' },
    { term: 'Medicare', cat: 'Financial Readiness',
      def: 'Federal health insurance for people 65 and older. Part A covers hospitals, Part B doctors, Part C is private "Advantage" plans, Part D is prescription drugs.' },
    { term: 'Social Security', cat: 'Financial Readiness',
      def: 'Federal retirement income earned through your working years. The age you start claiming changes how much you receive each month.' },
    { term: 'COLA', cat: 'Financial Readiness', aliases: ['Cost of Living Adjustment'],
      def: 'Cost of Living Adjustment — a yearly raise to retirement and disability payments to keep up with inflation.' },
    { term: 'CRDP', cat: 'Financial Readiness', aliases: ['Concurrent Retirement and Disability Pay'],
      def: 'Concurrent Retirement and Disability Pay — lets eligible retirees receive both military retirement pay and VA disability without one reducing the other.' },
    { term: 'CRSC', cat: 'Financial Readiness', aliases: ['Combat-Related Special Compensation'],
      def: 'Combat-Related Special Compensation — tax-free pay for retirees with combat-related disabilities. You may have to choose between CRSC and CRDP.' },
    { term: 'SBP', cat: 'Financial Readiness', aliases: ['Survivor Benefit Plan'],
      def: 'Survivor Benefit Plan — an annuity that continues paying a portion of military retired pay to your spouse after you pass away.' },
    { term: 'RMD', cat: 'Financial Readiness', aliases: ['Required Minimum Distribution'],
      def: 'Required Minimum Distribution — once you reach age 73, you must withdraw a minimum amount from retirement accounts each year (or face a tax penalty).' },
    { term: 'A&A', cat: 'Financial Readiness', aliases: ['Aid and Attendance', 'Aid & Attendance'],
      def: 'Aid & Attendance — an extra VA pension benefit for veterans (or surviving spouses) who need help with daily living or are housebound.' },
    { term: 'Beneficiary', cat: 'Financial Readiness',
      def: 'The person you name to receive money from a benefit, insurance policy, or retirement account when you pass away.' }
  ];

  // ─── DOM & state ────────────────────────────────────────
  let mounted = false;
  let overlayEl = null;
  let searchEl = null;
  let listEl = null;
  let lastFocus = null;

  function buildModal() {
    const overlay = document.createElement('div');
    overlay.className = 'vub-help-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'vubHelpTitle');

    const modal = document.createElement('div');
    modal.className = 'vub-help-modal';
    modal.innerHTML =
      '<div class="vub-help-header" style="position:relative;">' +
        '<button type="button" class="vub-help-close" aria-label="Close help">&times;</button>' +
        '<p class="vub-help-eyebrow">Quick Help</p>' +
        '<h2 class="vub-help-title" id="vubHelpTitle">What does that mean?</h2>' +
        '<input type="search" class="vub-help-search" placeholder="Search terms (e.g., URL, TSP, attachment)" aria-label="Search glossary terms">' +
      '</div>' +
      '<div class="vub-help-body" id="vubHelpBody"></div>' +
      '<div class="vub-help-footer">' +
        'Press <kbd>Esc</kbd> to close · <kbd>Tab</kbd> to navigate' +
      '</div>';

    overlay.appendChild(modal);

    // Click-outside to close
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    modal.querySelector('.vub-help-close').addEventListener('click', close);

    overlayEl = overlay;
    searchEl = modal.querySelector('.vub-help-search');
    listEl = modal.querySelector('#vubHelpBody');

    searchEl.addEventListener('input', filterTerms);
    document.body.appendChild(overlay);

    renderTerms('');
  }

  function renderTerms(query) {
    const q = (query || '').trim().toLowerCase();
    listEl.innerHTML = '';

    // Filter matching terms
    const matches = TERMS.filter(function (t) {
      if (!q) return true;
      if (t.term.toLowerCase().includes(q)) return true;
      if (t.def.toLowerCase().includes(q)) return true;
      if (t.aliases && t.aliases.some(function (a) { return a.toLowerCase().includes(q); })) return true;
      return false;
    });

    if (matches.length === 0) {
      listEl.innerHTML =
        '<div class="vub-help-empty">' +
          'No terms matched <strong>"' + escapeHtml(q) + '"</strong>.<br>' +
          'Try a different word, or clear the search to see all terms.' +
        '</div>';
      return;
    }

    // Group by category preserving original order
    const seenCats = [];
    const byCat = {};
    matches.forEach(function (t) {
      if (!byCat[t.cat]) { byCat[t.cat] = []; seenCats.push(t.cat); }
      byCat[t.cat].push(t);
    });

    seenCats.forEach(function (cat) {
      const heading = document.createElement('h3');
      heading.className = 'vub-help-category';
      heading.textContent = cat;
      listEl.appendChild(heading);

      byCat[cat].forEach(function (t) {
        const div = document.createElement('div');
        div.className = 'vub-help-term';
        let html = '<div class="vub-help-term-name">' + escapeHtml(t.term) + '</div>' +
                   '<div class="vub-help-term-def">' + escapeHtml(t.def) + '</div>';
        if (t.aliases && t.aliases.length) {
          html += '<span class="vub-help-term-aliases">Also: ' + escapeHtml(t.aliases.join(', ')) + '</span>';
        }
        div.innerHTML = html;
        listEl.appendChild(div);
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function filterTerms() { renderTerms(searchEl.value); }

  function open() {
    if (!overlayEl) buildModal();
    lastFocus = document.activeElement;
    overlayEl.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { searchEl.focus(); searchEl.select(); }, 30);
    document.addEventListener('keydown', handleKey);
  }

  function close() {
    if (!overlayEl) return;
    overlayEl.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKey);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function handleKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
    if (e.key === 'Tab') {
      // Simple focus trap
      const focusables = overlayEl.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function mountFab() {
    if (mounted) return;
    mounted = true;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vub-help-fab';
    btn.setAttribute('aria-label', 'Open glossary and quick help');
    btn.innerHTML = '<span class="vub-help-fab-icon" aria-hidden="true">?</span><span>Help</span>';
    btn.addEventListener('click', open);
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFab);
  } else {
    mountFab();
  }

  global.VubGlossary = { open: open, close: close, terms: TERMS };
})(window);
