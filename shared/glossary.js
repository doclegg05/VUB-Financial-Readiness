(function () {
  if (window.VubGlossary) return;

  window.VubGlossary = {
    terms: {},
    init() {},
    register(terms) {
      if (!terms || typeof terms !== "object") return;
      Object.assign(this.terms, terms);
    },
  };
})();
