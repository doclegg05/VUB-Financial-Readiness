/**
 * VubProgress — unified progress tracking for VUB Lessons.
 *
 * Storage model (single localStorage key `vub:progress:v1`):
 *   {
 *     ics: { "1": { slide, total, lastVisited, completed }, ... },
 *     fr:  { "1": { visited, lastVisited, completed }, ... },
 *     dl1: { "1": { slide, total, lastVisited, completed }, ... },
 *     _meta: { lastCourse, lastWeek, lastUrl }
 *   }
 *
 * Course IDs:
 *   ics = Intermediate Computer Skills (8 slide-based weeks)
 *   fr  = Financial Readiness (6 section-based modules)
 *   dl1 = Digital Literacy Level 1 (IC3 GS6 aligned, 5 weeks)
 */
(function (global) {
  'use strict';

  // ─── Auto-load shared print stylesheet (sibling print.css) ──
  // Pages that include progress.js automatically get the print stylesheet too.
  (function loadPrintCss() {
    if (document.querySelector('link[data-vub-print-css]')) return;
    let scriptSrc = '';
    if (document.currentScript && document.currentScript.src) {
      scriptSrc = document.currentScript.src;
    } else {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && /progress\.js(\?.*)?$/.test(scripts[i].src)) {
          scriptSrc = scripts[i].src;
          break;
        }
      }
    }
    if (!scriptSrc) return;
    const cssHref = scriptSrc.replace(/progress\.js(\?.*)?$/, 'print.css');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.media = 'print';
    link.href = cssHref;
    link.setAttribute('data-vub-print-css', 'true');
    // Append immediately if <head> exists, else wait for it.
    if (document.head) {
      document.head.appendChild(link);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        document.head.appendChild(link);
      });
    }
  })();

  const KEY = 'vub:progress:v1';
  // A week/module is "complete" when the learner reaches the final slide of the deck.
  // Once complete, it stays complete until the learner resets progress.

  // ─── Migration: rewrite legacy keys into unified store ──────
  const LEGACY_KEYS_ICS = [
    { week: 1, key: 'vub-week1-progress' },
    { week: 2, key: 'vub_week2_progress' },
    { week: 3, key: 'vub-week3-slide' },
    { week: 4, key: 'vub-week4-slide' },
    { week: 5, key: 'vub-week5-slide' },
    { week: 6, key: 'vub-week6-slide' },
    { week: 7, key: 'vub-week7-progress' },
    { week: 8, key: 'vub-week8-progress' }
  ];

  const LEGACY_KEYS_FR = [
    { module: 'module1', key: 'vub_fin_module1_progress' },
    { module: 'module2', key: 'vub_fin_module2_progress' },
    { module: 'module3', key: 'vub_fin_module3_progress' },
    { module: 'module4', key: 'vub_fin_module4_progress' },
    { module: 'module5', key: 'vub_fin_module5_progress' },
    { module: 'final-review', key: 'vub_fin_final-review_progress' }
  ];

  function safeRead() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ics: {}, fr: {}, dl1: {}, _meta: {} };
      const parsed = JSON.parse(raw);
      if (!parsed.ics) parsed.ics = {};
      if (!parsed.fr) parsed.fr = {};
      if (!parsed.dl1) parsed.dl1 = {};
      if (!parsed._meta) parsed._meta = {};
      return parsed;
    } catch (e) {
      return { ics: {}, fr: {}, dl1: {}, _meta: {} };
    }
  }

  function safeWrite(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage may be disabled (private browsing); fail silently.
    }
  }

  function migrateLegacyKeys() {
    const data = safeRead();
    let migrated = false;
    LEGACY_KEYS_ICS.forEach(({ week, key }) => {
      const old = localStorage.getItem(key);
      if (old !== null && !data.ics[week]) {
        const slide = parseInt(old, 10);
        if (!isNaN(slide)) {
          data.ics[week] = {
            slide: slide,
            total: null,
            lastVisited: Date.now(),
            completed: false
          };
          migrated = true;
        }
      }
      try { localStorage.removeItem(key); } catch (e) {}
    });
    LEGACY_KEYS_FR.forEach(({ module, key }) => {
      const old = localStorage.getItem(key);
      if (old !== null && !data.fr[module]) {
        const slide = parseInt(old, 10);
        if (!isNaN(slide)) {
          data.fr[module] = {
            slide: slide,
            total: null,
            visited: true,
            lastVisited: Date.now(),
            completed: false
          };
          migrated = true;
        }
      }
      try { localStorage.removeItem(key); } catch (e) {}
    });
    if (migrated) safeWrite(data);
  }

  migrateLegacyKeys();

  // ─── Public API ─────────────────────────────────────────────

  const VubProgress = {
    /**
     * Record progress on a slide-based lesson (Computer Course).
     * @param {string} courseId — 'ics'
     * @param {number|string} weekId — 1..8
     * @param {number} slideIndex — 0-based current slide
     * @param {number} totalSlides — total slides in deck
     */
    saveSlide(courseId, weekId, slideIndex, totalSlides) {
      const data = safeRead();
      if (!data[courseId]) data[courseId] = {};
      const key = String(weekId);
      const prev = data[courseId][key] || {};
      const wasComplete = prev.completed === true;
      const reachedEnd = totalSlides > 0 && slideIndex >= totalSlides - 1;
      data[courseId][key] = {
        slide: slideIndex,
        total: totalSlides,
        lastVisited: Date.now(),
        completed: wasComplete || reachedEnd
      };
      data._meta.lastCourse = courseId;
      data._meta.lastWeek = key;
      data._meta.lastUrl = location.pathname + location.search + location.hash;
      safeWrite(data);
    },

    /**
     * Record visit to a section-based module (Financial Readiness).
     * @param {string} courseId — 'fr'
     * @param {number|string} sectionId — 1..6 (or 'final-review', 'resources')
     */
    saveSection(courseId, sectionId) {
      const data = safeRead();
      if (!data[courseId]) data[courseId] = {};
      const key = String(sectionId);
      const prev = data[courseId][key] || {};
      data[courseId][key] = {
        visited: true,
        lastVisited: Date.now(),
        completed: prev.completed === true // section-based completion is manual or final-review-driven
      };
      data._meta.lastCourse = courseId;
      data._meta.lastWeek = key;
      data._meta.lastUrl = location.pathname + location.search + location.hash;
      safeWrite(data);
    },

    /**
     * Mark a section as completed (e.g. when learner finishes the module's final slide/quiz).
     */
    markComplete(courseId, weekId) {
      const data = safeRead();
      if (!data[courseId]) data[courseId] = {};
      const key = String(weekId);
      data[courseId][key] = Object.assign({}, data[courseId][key], {
        completed: true,
        lastVisited: Date.now()
      });
      safeWrite(data);
    },

    /**
     * Get progress for a single week/section.
     * @returns {{slide, total, percent, lastVisited, completed, visited}|null}
     */
    get(courseId, weekId) {
      const data = safeRead();
      const entry = data[courseId] && data[courseId][String(weekId)];
      if (!entry) return null;
      const percent = entry.total
        ? Math.round((entry.slide / Math.max(entry.total - 1, 1)) * 100)
        : (entry.visited ? 0 : 0);
      return Object.assign({ percent }, entry);
    },

    /**
     * Summary across an entire course.
     * @returns {{started, completed, lastWeek, lastWeekPercent}}
     */
    getCourseSummary(courseId) {
      const data = safeRead();
      const course = data[courseId] || {};
      const weeks = Object.keys(course);
      const started = weeks.length;
      const completed = weeks.filter(w => course[w].completed).length;
      let lastWeek = null;
      let lastTime = 0;
      weeks.forEach(w => {
        if (course[w].lastVisited > lastTime) {
          lastTime = course[w].lastVisited;
          lastWeek = w;
        }
      });
      const lastWeekData = lastWeek ? this.get(courseId, lastWeek) : null;
      return {
        started,
        completed,
        lastWeek,
        lastWeekPercent: lastWeekData ? lastWeekData.percent : 0,
        lastVisited: lastTime || null
      };
    },

    /**
     * Get the most recent activity across all courses (for top-level dashboard).
     * @returns {{courseId, weekId, url, lastVisited}|null}
     */
    getLastActivity() {
      const data = safeRead();
      const meta = data._meta || {};
      if (!meta.lastCourse || !meta.lastWeek) return null;
      const entry = this.get(meta.lastCourse, meta.lastWeek);
      if (!entry) return null;
      return {
        courseId: meta.lastCourse,
        weekId: meta.lastWeek,
        url: meta.lastUrl,
        lastVisited: entry.lastVisited,
        percent: entry.percent
      };
    },

    /**
     * Reset progress. Pass a courseId to reset just one course; omit to reset all.
     */
    reset(courseId) {
      if (!courseId) {
        try { localStorage.removeItem(KEY); } catch (e) {}
        return;
      }
      const data = safeRead();
      data[courseId] = {};
      // Clear meta if it pointed at this course
      if (data._meta && data._meta.lastCourse === courseId) {
        data._meta = {};
      }
      safeWrite(data);
    }
  };

  global.VubProgress = VubProgress;
})(window);
