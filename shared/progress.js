(function () {
  const STORAGE_PREFIX = "vub_progress";
  const LEGACY_FIN_PREFIX = "vub_fin_";

  function canUseStorage() {
    try {
      const testKey = "__vub_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  function normalizeId(value) {
    return String(value || "").trim();
  }

  function storageKey(course, moduleId) {
    return `${STORAGE_PREFIX}:${normalizeId(course)}:${normalizeId(moduleId)}`;
  }

  function legacyFinancialKey(moduleId) {
    return `${LEGACY_FIN_PREFIX}${normalizeId(moduleId)}_progress`;
  }

  function safeParse(raw) {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function enrichEntry(course, moduleId, entry) {
    if (!entry) return null;

    const slide = Number.isFinite(Number(entry.slide)) ? Number(entry.slide) : null;
    const total = Number.isFinite(Number(entry.total)) ? Number(entry.total) : null;
    const completed = Boolean(entry.completed || (total && slide !== null && slide >= total - 1));
    const percent = total && slide !== null
      ? Math.min(100, Math.max(0, Math.round(((slide + 1) / total) * 100)))
      : (completed ? 100 : Number(entry.percent) || 0);

    return {
      course: normalizeId(course),
      moduleId: normalizeId(moduleId),
      slide,
      total,
      percent,
      completed,
      updatedAt: Number(entry.updatedAt) || 0,
    };
  }

  function get(course, moduleId) {
    if (!canUseStorage()) return null;

    const normalizedCourse = normalizeId(course);
    const normalizedModule = normalizeId(moduleId);
    const stored = enrichEntry(
      normalizedCourse,
      normalizedModule,
      safeParse(window.localStorage.getItem(storageKey(normalizedCourse, normalizedModule)))
    );

    if (stored) return stored;

    if (normalizedCourse === "fr") {
      const legacySlide = window.localStorage.getItem(legacyFinancialKey(normalizedModule));
      if (legacySlide !== null) {
        return enrichEntry(normalizedCourse, normalizedModule, {
          slide: parseInt(legacySlide, 10) || 0,
          updatedAt: 0,
        });
      }
    }

    return null;
  }

  function saveSlide(course, moduleId, slide, total) {
    if (!canUseStorage()) return null;

    const normalizedCourse = normalizeId(course);
    const normalizedModule = normalizeId(moduleId);
    const slideNumber = Math.max(0, parseInt(slide, 10) || 0);
    const totalNumber = Math.max(0, parseInt(total, 10) || 0);
    const entry = enrichEntry(normalizedCourse, normalizedModule, {
      slide: slideNumber,
      total: totalNumber,
      completed: totalNumber > 0 && slideNumber >= totalNumber - 1,
      updatedAt: Date.now(),
    });

    window.localStorage.setItem(storageKey(normalizedCourse, normalizedModule), JSON.stringify(entry));
    return entry;
  }

  function list(course) {
    if (!canUseStorage()) return [];

    const normalizedCourse = normalizeId(course);
    const prefix = `${STORAGE_PREFIX}:${normalizedCourse}:`;
    const entries = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key || !key.startsWith(prefix)) continue;

      const moduleId = key.slice(prefix.length);
      const entry = enrichEntry(normalizedCourse, moduleId, safeParse(window.localStorage.getItem(key)));
      if (entry) entries.push(entry);
    }

    return entries.sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function getCourseSummary(course) {
    const entries = list(course);
    const started = entries.filter(entry => typeof entry.slide === "number").length;
    const completed = entries.filter(entry => entry.completed).length;
    const last = entries[0] || null;

    return {
      total: entries.length,
      started,
      completed,
      percent: entries.length ? Math.round((completed / entries.length) * 100) : 0,
      last,
      lastWeek: last ? last.moduleId : null,
      entries,
    };
  }

  function reset(course) {
    if (!canUseStorage()) return;

    const normalizedCourse = normalizeId(course);
    const prefix = `${STORAGE_PREFIX}:${normalizedCourse}:`;
    const keys = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key && key.startsWith(prefix)) keys.push(key);
      if (normalizedCourse === "fr" && key && key.startsWith(LEGACY_FIN_PREFIX)) keys.push(key);
    }

    keys.forEach(key => window.localStorage.removeItem(key));
  }

  window.VubProgress = {
    get,
    saveSlide,
    getCourseSummary,
    reset,
  };
})();
