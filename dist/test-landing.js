(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/js/config.js
  function isProduction() {
    return window.location.hostname === "ntgcentral.nt.gov.au";
  }
  function getConfig() {
    const config = {
      isProduction: isProduction(),
      liveApiUrl: "https://ntgcentral.nt.gov.au/services-and-support/ict-services-websites/artificial-intelligence/ai-knowledge-base/configuration/listing/articles/_nocache",
      fallbackJsonUrl: "./dist/search.json",
      workAreasUrl: isProduction() ? "https://ntgcentral.nt.gov.au/services-and-support/ict-services-websites/artificial-intelligence/ai-knowledge-base/configuration/listing/work-areas/_nocache" : "./src/data/work-areas.json"
    };
    return config;
  }
  function getPrimaryDataSource() {
    const config = getConfig();
    return config.isProduction ? config.liveApiUrl : config.fallbackJsonUrl;
  }
  function getFallbackDataSource() {
    const config = getConfig();
    return config.isProduction ? config.fallbackJsonUrl : null;
  }
  function getWorkAreasDataSource() {
    const config = getConfig();
    return config.workAreasUrl;
  }
  var NOISE_WORDS;
  var init_config = __esm({
    "src/js/config.js"() {
      NOISE_WORDS = /* @__PURE__ */ new Set([
        "a",
        "au",
        "all",
        "am",
        "an",
        "and",
        "any",
        "are",
        "as",
        "at",
        "be",
        "been",
        "but",
        "by",
        "can",
        "cant",
        "co",
        "com",
        "de",
        "do",
        "eg",
        "else",
        "etc",
        "for",
        "from",
        "get",
        "go",
        "had",
        "has",
        "hasnt",
        "have",
        "he",
        "hence",
        "her",
        "here",
        "hers",
        "him",
        "his",
        "how",
        "http",
        "https",
        "i",
        "ie",
        "if",
        "in",
        "is",
        "it",
        "its",
        "la",
        "me",
        "my",
        "nor",
        "not",
        "now",
        "of",
        "off",
        "on",
        "or",
        "our",
        "ours",
        "pm",
        "put",
        "re",
        "she",
        "so",
        "than",
        "that",
        "the",
        "their",
        "them",
        "then",
        "there",
        "these",
        "they",
        "this",
        "those",
        "thus",
        "to",
        "too",
        "uk",
        "un",
        "until",
        "up",
        "upon",
        "us",
        "very",
        "via",
        "was",
        "we",
        "well",
        "were",
        "what",
        "when",
        "where",
        "which",
        "while",
        "who",
        "why",
        "www",
        "you",
        "your",
        "yours"
      ]);
    }
  });

  // src/js/offline-search.js
  function tokenizeQuery(query) {
    const cleaned = query.replace(/[^\w\s]/g, " ").trim();
    if (!cleaned) return [];
    const words = cleaned.split(/\s+/).filter((word) => word.length > 0);
    const tokens = words.filter((word) => {
      const lowerWord = word.toLowerCase();
      if (NOISE_WORDS.has(lowerWord)) {
        return word === word.toUpperCase() && word.length >= 2;
      }
      return true;
    });
    return tokens.map((token) => token.toLowerCase());
  }
  function normalizeText(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/[^\w\s]/g, " ");
  }
  function countTermFrequency(text, term) {
    if (!text || !term) return { fullWordMatches: 0, partialMatches: 0 };
    const normalized = normalizeText(text);
    const fullWordRegex = new RegExp(`\\b${term}\\b`, "gi");
    const fullWordMatches = normalized.match(fullWordRegex);
    const fullWordCount = fullWordMatches ? fullWordMatches.length : 0;
    const partialRegex = new RegExp(term, "gi");
    const allMatches = normalized.match(partialRegex);
    const totalMatches = allMatches ? allMatches.length : 0;
    const partialCount = Math.max(0, totalMatches - fullWordCount);
    return {
      fullWordMatches: fullWordCount,
      partialMatches: partialCount
    };
  }
  function extractMetadata(result) {
    const parts = [];
    if (result.listMetadata) {
      if (result.listMetadata["Work area"]) {
        parts.push(...result.listMetadata["Work area"]);
      }
      if (result.listMetadata["Roles"]) {
        parts.push(...result.listMetadata["Roles"]);
      }
      if (result.listMetadata["Benefits"]) {
        parts.push(...result.listMetadata["Benefits"]);
      }
    }
    return parts.join(" ");
  }
  function scoreTermInResult(result, term) {
    const titleText = result.title || "";
    const summaryText = result.summary || "";
    const metadataText = extractMetadata(result);
    const titleTF = countTermFrequency(titleText, term);
    const summaryTF = countTermFrequency(summaryText, term);
    const metadataTF = countTermFrequency(metadataText, term);
    const titleScore = titleTF.fullWordMatches * 5 + titleTF.partialMatches * 2;
    const summaryScore = summaryTF.fullWordMatches * 2 + summaryTF.partialMatches * 1;
    const metadataScore = metadataTF.fullWordMatches * 3 + metadataTF.partialMatches * 1.5;
    const totalScore = titleScore + summaryScore + metadataScore;
    return {
      titleTF: titleTF.fullWordMatches + titleTF.partialMatches,
      titleFullWord: titleTF.fullWordMatches,
      titlePartial: titleTF.partialMatches,
      summaryTF: summaryTF.fullWordMatches + summaryTF.partialMatches,
      summaryFullWord: summaryTF.fullWordMatches,
      summaryPartial: summaryTF.partialMatches,
      metadataTF: metadataTF.fullWordMatches + metadataTF.partialMatches,
      metadataFullWord: metadataTF.fullWordMatches,
      metadataPartial: metadataTF.partialMatches,
      titleScore,
      summaryScore,
      metadataScore,
      totalScore,
      hasMatch: totalScore > 0
    };
  }
  function getDocumentLength(result) {
    const titleLength = (result.title || "").length;
    const summaryLength = (result.summary || "").length;
    const metadataLength = extractMetadata(result).length;
    return titleLength + summaryLength + metadataLength;
  }
  function searchLocalData(keywords, results) {
    if (!keywords || !results || results.length === 0) {
      return [];
    }
    const terms = tokenizeQuery(keywords);
    if (terms.length === 0) {
      return [];
    }
    const scoredResults = results.map((result) => {
      let totalScore = 0;
      const matchedTerms = [];
      const termScores = {};
      terms.forEach((term) => {
        const termScore = scoreTermInResult(result, term);
        if (termScore.hasMatch) {
          matchedTerms.push(term);
          totalScore += termScore.totalScore;
          termScores[term] = termScore;
        }
      });
      const docLength = getDocumentLength(result);
      const normalizedScore = docLength > 0 ? totalScore / docLength * 1e3 : 0;
      return {
        ...result,
        _offlineScore: normalizedScore,
        _rawScore: totalScore,
        _matchedTerms: matchedTerms,
        _termScores: termScores,
        _docLength: docLength
      };
    });
    const matchedResults = scoredResults.filter(
      (result) => result._matchedTerms.length > 0
    );
    matchedResults.sort((a, b) => b._offlineScore - a._offlineScore);
    return matchedResults;
  }
  function getCachedData() {
    if (window.aikbSearchCache && Array.isArray(window.aikbSearchCache)) {
      return window.aikbSearchCache;
    }
    return null;
  }
  var init_offline_search = __esm({
    "src/js/offline-search.js"() {
      init_config();
    }
  });

  // src/js/pagination.js
  var pagination_exports = {};
  __export(pagination_exports, {
    getCurrentPage: () => getCurrentPage,
    getCurrentPageResults: () => getCurrentPageResults,
    getTotalPages: () => getTotalPages,
    initializePagination: () => initializePagination,
    updatePagination: () => updatePagination
  });
  function initializePagination(results, perPage = 10) {
    allResults = results;
    itemsPerPage = perPage;
    totalItems = results.length;
    currentPage = 1;
    ensurePaginationContainer();
    renderPaginationControls();
  }
  function getCurrentPageResults() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allResults.slice(startIndex, endIndex);
  }
  function getCurrentPage() {
    return currentPage;
  }
  function getTotalPages() {
    return Math.ceil(totalItems / itemsPerPage);
  }
  function ensurePaginationContainer() {
    paginationContainer = document.getElementById("aikb-pagination");
    if (!paginationContainer) {
      const searchResultsContainer = document.getElementById(
        "search-results-list"
      );
      if (searchResultsContainer && searchResultsContainer.parentNode) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "aikb-pagination";
        paginationContainer.className = "aikb-pagination";
        searchResultsContainer.parentNode.insertBefore(
          paginationContainer,
          searchResultsContainer.nextSibling
        );
      }
    }
  }
  function renderPaginationControls() {
    if (!paginationContainer) return;
    const totalPages = getTotalPages();
    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      paginationContainer.style.display = "none";
      return;
    }
    paginationContainer.style.display = "flex";
    const wrapper = document.createElement("div");
    wrapper.className = "aikb-pagination__wrapper";
    const prevButton = createControlButton("Previous", currentPage > 1, () => {
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    });
    wrapper.appendChild(prevButton);
    const pageNumbers = createPageNumbers(totalPages);
    wrapper.appendChild(pageNumbers);
    const nextButton = createControlButton(
      "Next",
      currentPage < totalPages,
      () => {
        if (currentPage < totalPages) {
          goToPage(currentPage + 1);
        }
      }
    );
    wrapper.appendChild(nextButton);
    paginationContainer.innerHTML = "";
    paginationContainer.appendChild(wrapper);
  }
  function createControlButton(label, enabled, onClick) {
    const button = document.createElement("div");
    button.className = "aikb-pagination__control";
    if (!enabled) {
      button.classList.add("aikb-pagination__control--disabled");
    }
    const iconLabel = document.createElement("div");
    iconLabel.className = "aikb-pagination__icon-label";
    if (label === "Previous") {
      const icon = document.createElement("span");
      icon.className = "fal fa-chevron-left";
      icon.setAttribute("aria-hidden", "true");
      iconLabel.appendChild(icon);
    }
    const text = document.createElement("span");
    text.className = "aikb-pagination__text";
    text.textContent = label;
    iconLabel.appendChild(text);
    if (label === "Next") {
      const icon = document.createElement("span");
      icon.className = "fal fa-chevron-right";
      icon.setAttribute("aria-hidden", "true");
      iconLabel.appendChild(icon);
    }
    button.appendChild(iconLabel);
    if (enabled) {
      button.addEventListener("click", onClick);
      button.style.cursor = "pointer";
    }
    return button;
  }
  function createPageNumbers(totalPages) {
    const container = document.createElement("div");
    container.className = "aikb-pagination__pages";
    const pages = calculatePageRange(currentPage, totalPages);
    pages.forEach((page) => {
      if (page === "...") {
        const ellipsis = document.createElement("span");
        ellipsis.className = "aikb-pagination__ellipsis";
        ellipsis.textContent = "...";
        container.appendChild(ellipsis);
      } else {
        const pageButton = document.createElement("div");
        pageButton.className = "aikb-pagination__page-number";
        if (page === currentPage) {
          pageButton.classList.add("aikb-pagination__page-number--active");
        }
        const pageText = document.createElement("span");
        pageText.textContent = page;
        pageButton.appendChild(pageText);
        pageButton.addEventListener("click", () => goToPage(page));
        pageButton.style.cursor = "pointer";
        container.appendChild(pageButton);
      }
    });
    return container;
  }
  function calculatePageRange(current, total) {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (current > 3) {
      pages.push("...");
    }
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (current < total - 2) {
      pages.push("...");
    }
    pages.push(total);
    return pages;
  }
  function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    currentPage = page;
    renderPaginationControls();
    const event = new CustomEvent("aikb-pagination-change", {
      detail: {
        page: currentPage,
        results: getCurrentPageResults()
      }
    });
    document.dispatchEvent(event);
    const searchResultsContainer = document.getElementById("search-results-list");
    if (searchResultsContainer) {
      const offset = 100;
      const top = searchResultsContainer.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
  function updatePagination(results) {
    allResults = results;
    totalItems = results.length;
    currentPage = 1;
    renderPaginationControls();
  }
  var currentPage, itemsPerPage, totalItems, allResults, paginationContainer;
  var init_pagination = __esm({
    "src/js/pagination.js"() {
      currentPage = 1;
      itemsPerPage = 10;
      totalItems = 0;
      allResults = [];
      paginationContainer = null;
    }
  });

  // src/js/search-card-template.js
  var search_card_template_exports = {};
  __export(search_card_template_exports, {
    renderResults: () => renderResults
  });
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const monthYearPattern = /^[A-Z][a-z]+ \d{4}$/;
    if (monthYearPattern.test(dateStr)) {
      return dateStr;
    }
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      }
    } catch (e) {
    }
    return dateStr;
  }
  function highlightMatches(text, matchedTerms) {
    if (!text || !matchedTerms || matchedTerms.length === 0) {
      return text;
    }
    let highlighted = text;
    const sortedTerms = [...matchedTerms].sort((a, b) => b.length - a.length);
    sortedTerms.forEach((term) => {
      const regex = new RegExp(`(?!<mark[^>]*>)(${term})(?![^<]*</mark>)`, "gi");
      highlighted = highlighted.replace(regex, "<mark>$1</mark>");
    });
    return highlighted;
  }
  function setHighlightedHTML(element, htmlString) {
    element.innerHTML = "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    Array.from(doc.body.childNodes).forEach((node) => {
      element.appendChild(node.cloneNode(true));
    });
  }
  function createSearchCard(result) {
    if (!result.title || !result.summary || !result.liveUrl) {
      return null;
    }
    const card = document.createElement("div");
    card.className = "aikb-search-card";
    const relevance = result._offlineScore || (result.rank ? -result.rank : result.score || 0);
    card.setAttribute("data-sort-relevance", relevance);
    card.setAttribute("data-sort-title", result.title);
    const dateTimestamp = result.dateTimestamp || 0;
    card.setAttribute("data-sort-date", dateTimestamp);
    const inner = document.createElement("div");
    inner.className = "aikb-search-card__inner";
    const content = document.createElement("div");
    content.className = "aikb-search-card__content";
    const textSection = document.createElement("div");
    textSection.className = "aikb-search-card__text";
    const title = document.createElement("h3");
    title.className = "aikb-search-card__title";
    if (result._matchedTerms && result._matchedTerms.length > 0) {
      const highlightedTitle = highlightMatches(
        result.title,
        result._matchedTerms
      );
      setHighlightedHTML(title, highlightedTitle);
    } else {
      title.textContent = result.title;
    }
    textSection.appendChild(title);
    const summary = document.createElement("p");
    summary.className = "aikb-search-card__summary";
    if (result._matchedTerms && result._matchedTerms.length > 0) {
      const highlightedSummary = highlightMatches(
        result.summary,
        result._matchedTerms
      );
      setHighlightedHTML(summary, highlightedSummary);
    } else {
      summary.textContent = result.summary;
    }
    textSection.appendChild(summary);
    content.appendChild(textSection);
    const workAreas = result.listMetadata && result.listMetadata["Work area"] ? result.listMetadata["Work area"] : [];
    if (workAreas && workAreas.length > 0) {
      const tagsContainer = document.createElement("div");
      tagsContainer.className = "aikb-search-card__tags";
      workAreas.forEach((workArea) => {
        if (workArea && workArea.trim()) {
          const tag = document.createElement("div");
          tag.className = "aikb-search-card__tag";
          tag.textContent = workArea.trim();
          tagsContainer.appendChild(tag);
        }
      });
      if (tagsContainer.children.length > 0) {
        content.appendChild(tagsContainer);
      }
    }
    inner.appendChild(content);
    const actions = document.createElement("div");
    actions.className = "aikb-search-card__actions";
    const button = document.createElement("a");
    button.href = result.liveUrl;
    button.className = "ntgc-btn ntgc-btn--secondary";
    const buttonText = document.createElement("span");
    buttonText.textContent = "See more";
    button.appendChild(buttonText);
    const icon = document.createElement("span");
    icon.className = "fal fa-long-arrow-right";
    icon.setAttribute("aria-hidden", "true");
    button.appendChild(icon);
    actions.appendChild(button);
    const metadata = document.createElement("div");
    metadata.className = "aikb-search-card__metadata";
    const roles = result.listMetadata && result.listMetadata["Roles"] ? result.listMetadata["Roles"] : [];
    if (roles && roles.length > 0) {
      const usefulRow = document.createElement("div");
      usefulRow.className = "aikb-search-card__useful-for";
      const value = document.createElement("span");
      value.className = "aikb-search-card__useful-value";
      const label = document.createElement("strong");
      label.textContent = "Good for: ";
      value.appendChild(label);
      const rolesText = roles.join(", ");
      if (result._matchedTerms && result._matchedTerms.length > 0) {
        const highlightedRoles = highlightMatches(
          rolesText,
          result._matchedTerms
        );
        const tempSpan = document.createElement("span");
        setHighlightedHTML(tempSpan, highlightedRoles);
        Array.from(tempSpan.childNodes).forEach((node) => {
          value.appendChild(node);
        });
      } else {
        const text = document.createTextNode(rolesText);
        value.appendChild(text);
      }
      usefulRow.appendChild(value);
      metadata.appendChild(usefulRow);
    }
    if (result.date) {
      const dateEl = document.createElement("div");
      dateEl.className = "aikb-search-card__date";
      dateEl.textContent = `Last updated: ${formatDate(result.date)}`;
      metadata.appendChild(dateEl);
    }
    actions.appendChild(metadata);
    inner.appendChild(actions);
    card.appendChild(inner);
    return card;
  }
  function renderResults(results, containerId = "search-results-list", usePagination = true) {
    let container = document.getElementById(containerId);
    if (!container) {
      const $container = window.$ ? window.$(`#${containerId}`) : null;
      container = $container && $container.length > 0 ? $container[0] : null;
    }
    if (!container) {
      return;
    }
    container.innerHTML = "";
    if (results.length === 0) {
      const noResults = document.createElement("p");
      noResults.textContent = "No results found.";
      noResults.style.padding = "24px 48px";
      container.appendChild(noResults);
      return;
    }
    if (usePagination) {
      Promise.resolve().then(() => (init_pagination(), pagination_exports)).then(
        ({ initializePagination: initializePagination2, getCurrentPageResults: getCurrentPageResults2 }) => {
          initializePagination2(results, 10);
          const pageResults = getCurrentPageResults2();
          const cards = pageResults.map((result) => createSearchCard(result)).filter((card) => card !== null);
          cards.forEach((card) => container.appendChild(card));
        }
      );
    } else {
      const cards = results.map((result) => createSearchCard(result)).filter((card) => card !== null);
      cards.forEach((card) => container.appendChild(card));
    }
  }
  var paginationListenerAdded;
  var init_search_card_template = __esm({
    "src/js/search-card-template.js"() {
      window.aikbRenderResults = renderResults;
      paginationListenerAdded = false;
      if (!paginationListenerAdded) {
        document.addEventListener("aikb-pagination-change", (event) => {
          const { results } = event.detail;
          const container = document.getElementById("search-results-list");
          if (container && results) {
            container.innerHTML = "";
            const cards = results.map((result) => createSearchCard(result)).filter((card) => card !== null);
            cards.forEach((card) => container.appendChild(card));
          }
        });
        paginationListenerAdded = true;
      }
    }
  });

  // src/js/populate-dropdowns.js
  function extractWorkAreas(results) {
    const workAreaSet = /* @__PURE__ */ new Set();
    results.forEach((result) => {
      if (result.listMetadata && result.listMetadata["Work area"]) {
        const workAreas = result.listMetadata["Work area"];
        if (Array.isArray(workAreas)) {
          workAreas.forEach((area) => {
            const trimmed = area.trim();
            if (trimmed) {
              workAreaSet.add(trimmed);
            }
          });
        }
      }
    });
    return Array.from(workAreaSet).sort((a, b) => {
      return a.localeCompare(b);
    });
  }
  function setStaticWorkAreas(workAreas) {
    staticWorkAreas = workAreas;
  }
  function populateWorkAreaDropdown(workAreas) {
    const dropdown = document.getElementById("document_type");
    if (!dropdown) {
      return;
    }
    dropdown.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "All work areas";
    allOption.textContent = "All work areas";
    allOption.selected = true;
    dropdown.appendChild(allOption);
    workAreas.forEach((workArea) => {
      if (workArea === "All work areas") {
        return;
      }
      const option = document.createElement("option");
      option.value = workArea;
      option.textContent = workArea;
      dropdown.appendChild(option);
    });
  }
  function populateSortDropdown() {
    const container = document.getElementById("select-question-3");
    if (!container) {
      return;
    }
    let dropdown = document.getElementById("owner");
    if (!dropdown) {
      const label = container.querySelector("label");
      container.innerHTML = "";
      if (label) {
        container.appendChild(label);
      } else {
        const newLabel = document.createElement("label");
        newLabel.className = "ntgc-form-input--label";
        newLabel.setAttribute("for", "select-input-2");
        newLabel.textContent = "Sort";
        container.appendChild(newLabel);
      }
      const wrapper = document.createElement("div");
      wrapper.className = "aikb-dropdown-wrapper";
      const inner = document.createElement("div");
      inner.className = "aikb-dropdown-inner";
      dropdown = document.createElement("select");
      dropdown.name = "sort";
      dropdown.className = "ntgc-select ntgc-select--block ntgc-select-input--filter";
      dropdown.id = "owner";
      inner.appendChild(dropdown);
      wrapper.appendChild(inner);
      container.appendChild(wrapper);
    } else {
      dropdown.innerHTML = "";
    }
    const sortOptions = [
      { value: "relevance", label: "Relevance", selected: true },
      { value: "date-newest", label: "Date (newest first)" },
      { value: "date-oldest", label: "Date (oldest first)" },
      { value: "title-az", label: "Title (A-Z)" },
      { value: "title-za", label: "Title (Z-A)" }
    ];
    sortOptions.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      if (opt.selected) option.selected = true;
      dropdown.appendChild(option);
    });
  }
  function addDropdownIcons() {
    const workAreaDropdown = document.getElementById("document_type");
    if (workAreaDropdown && !workAreaDropdown.parentElement.querySelector(".aikb-dropdown-icon")) {
      const icon = document.createElement("div");
      icon.className = "aikb-dropdown-icon";
      icon.setAttribute("data-colour", "NTG Blue");
      const wrapper = workAreaDropdown.closest(".aikb-dropdown-wrapper");
      if (wrapper) {
        const inner = wrapper.querySelector(".aikb-dropdown-inner");
        if (inner) {
          inner.appendChild(icon);
        }
      }
    }
    const sortDropdown = document.getElementById("owner");
    if (sortDropdown && !sortDropdown.parentElement.querySelector(".aikb-dropdown-icon")) {
      const icon = document.createElement("div");
      icon.className = "aikb-dropdown-icon";
      icon.setAttribute("data-colour", "NTG Blue");
      const wrapper = sortDropdown.closest(".aikb-dropdown-wrapper");
      if (wrapper) {
        const inner = wrapper.querySelector(".aikb-dropdown-inner");
        if (inner) {
          inner.appendChild(icon);
        }
      }
    }
  }
  function initializeDropdowns(results, workAreasFromFetch = null) {
    let workAreas;
    if (workAreasFromFetch && workAreasFromFetch.length > 0) {
      workAreas = workAreasFromFetch;
    } else if (staticWorkAreas.length > 0) {
      workAreas = staticWorkAreas;
    } else {
      workAreas = extractWorkAreas(results);
    }
    populateWorkAreaDropdown(workAreas);
    populateSortDropdown();
    addDropdownIcons();
  }
  var staticWorkAreas;
  var init_populate_dropdowns = __esm({
    "src/js/populate-dropdowns.js"() {
      staticWorkAreas = [];
    }
  });

  // src/js/applied-filters.js
  function displayAppliedFilters(filters) {
    const section = document.getElementById("appliedFiltersSection");
    const container = document.getElementById("appliedFilters");
    const clearAllBtn = document.getElementById("clearAllBtn");
    if (!section || !container) {
      return;
    }
    container.innerHTML = "";
    let hasFilters = false;
    if (filters.searchQuery && filters.searchQuery.trim()) {
      hasFilters = true;
      const pill = createFilterPill(
        "Search",
        filters.searchQuery,
        "bg-success",
        "search"
      );
      container.appendChild(pill);
    }
    if (filters.workArea && filters.workArea !== "All work areas" && filters.workArea.trim()) {
      hasFilters = true;
      const pill = createFilterPill(
        "Work area",
        filters.workArea,
        "bg-primary",
        "work-area"
      );
      container.appendChild(pill);
    }
    if (clearAllBtn) {
      clearAllBtn.style.display = hasFilters ? "inline-flex" : "none";
      clearAllBtn.style.marginLeft = "8px";
      clearAllBtn.style.verticalAlign = "middle";
      clearAllBtn.style.alignItems = "center";
      container.appendChild(clearAllBtn);
    }
    section.style.display = hasFilters ? "block" : "none";
  }
  function createFilterPill(label, value, badgeClass, filterType, filterValue) {
    const pill = document.createElement("span");
    pill.className = `badge ${badgeClass} filter-pill d-inline-flex align-items-center`;
    const pillLabel = document.createElement("span");
    pillLabel.className = "pill-label";
    pillLabel.textContent = `${label}:`;
    const pillValue = document.createElement("span");
    pillValue.className = "pill-value";
    pillValue.textContent = value;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "pill-remove";
    removeButton.title = `Remove ${label}: ${value}`;
    removeButton.setAttribute("data-filter-type", filterType);
    if (filterValue) {
      removeButton.setAttribute("data-filter-value", filterValue);
    }
    const icon = document.createElement("span");
    icon.className = "fas fa-times";
    removeButton.appendChild(icon);
    removeButton.addEventListener("click", (e) => {
      e.preventDefault();
      removeFilter(filterType, filterValue);
    });
    pill.appendChild(pillLabel);
    pill.appendChild(pillValue);
    pill.appendChild(removeButton);
    return pill;
  }
  async function removeFilter(filterType, filterValue) {
    switch (filterType) {
      case "search":
        const searchInput = document.getElementById("search");
        if (searchInput) {
          searchInput.value = "";
          const updatedFilters = getCurrentFilters();
          displayAppliedFilters(updatedFilters);
          const { loadInitialResults: loadInitialResults2 } = await Promise.resolve().then(() => (init_load_initial_results(), load_initial_results_exports));
          loadInitialResults2();
        }
        break;
      case "work-area":
        const workAreaDropdown = document.getElementById("document_type");
        if (workAreaDropdown) {
          workAreaDropdown.value = "All work areas";
          const changeEvent = new Event("change", { bubbles: true });
          workAreaDropdown.dispatchEvent(changeEvent);
        }
        break;
    }
  }
  async function clearAllFilters() {
    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.value = "";
    }
    const workAreaDropdown = document.getElementById("document_type");
    if (workAreaDropdown) {
      workAreaDropdown.value = "All work areas";
    }
    const section = document.getElementById("appliedFiltersSection");
    if (section) {
      section.style.display = "none";
    }
    const { loadInitialResults: loadInitialResults2 } = await Promise.resolve().then(() => (init_load_initial_results(), load_initial_results_exports));
    loadInitialResults2();
  }
  function initClearAllButton() {
    const clearAllBtn = document.getElementById("clearAllBtn");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        clearAllFilters();
      });
    }
  }
  function getCurrentFilters() {
    const searchInput = document.getElementById("search");
    const workAreaDropdown = document.getElementById("document_type");
    const sortDropdown = document.getElementById("sort") || document.getElementById("owner");
    const filters = {
      searchQuery: searchInput ? searchInput.value : "",
      workArea: workAreaDropdown ? workAreaDropdown.value : "All work areas",
      sort: sortDropdown ? sortDropdown.value : "relevance"
    };
    return filters;
  }
  var init_applied_filters = __esm({
    "src/js/applied-filters.js"() {
    }
  });

  // src/js/search-filters.js
  function storeResults(results) {
    const seenKeys = /* @__PURE__ */ new Set();
    const deduplicatedResults = [];
    results.forEach((result, index) => {
      const uniqueKey = result.liveUrl || result.url || result.title || JSON.stringify(result) + index;
      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);
        deduplicatedResults.push(result);
      }
    });
    allResults2 = deduplicatedResults;
  }
  function filterByWorkArea(selectedWorkArea) {
    if (!selectedWorkArea || selectedWorkArea === "All work areas") {
      return allResults2;
    }
    const filtered = allResults2.filter((result) => {
      if (!result.listMetadata || !result.listMetadata["Work area"]) {
        return false;
      }
      const resultWorkAreas = result.listMetadata["Work area"];
      if (!Array.isArray(resultWorkAreas)) {
        return false;
      }
      return resultWorkAreas.includes(selectedWorkArea);
    });
    return filtered;
  }
  function sortResults(results, sortBy) {
    const sorted = [...results];
    switch (sortBy) {
      case "relevance":
        sorted.sort((a, b) => {
          if (a.rank && b.rank) {
            return a.rank - b.rank;
          }
          if (a.score && b.score) {
            return b.score - a.score;
          }
          return 0;
        });
        break;
      case "date-newest":
        sorted.sort((a, b) => {
          const dateA = a.dateTimestamp || 0;
          const dateB = b.dateTimestamp || 0;
          return dateB - dateA;
        });
        break;
      case "date-oldest":
        sorted.sort((a, b) => {
          const dateA = a.dateTimestamp || 0;
          const dateB = b.dateTimestamp || 0;
          return dateA - dateB;
        });
        break;
      case "title-az":
        sorted.sort((a, b) => {
          const titleA = a.title || "";
          const titleB = b.title || "";
          return titleA.localeCompare(titleB);
        });
        break;
      case "title-za":
        sorted.sort((a, b) => {
          const titleA = a.title || "";
          const titleB = b.title || "";
          return titleB.localeCompare(titleA);
        });
        break;
      default:
        break;
    }
    return sorted;
  }
  function sortCardsInDOM(sortBy) {
    const container = document.getElementById("search-results-list");
    if (!container) return;
    const cards = Array.from(container.querySelectorAll(".aikb-search-card"));
    cards.sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          const relA = parseFloat(a.getAttribute("data-sort-relevance")) || 0;
          const relB = parseFloat(b.getAttribute("data-sort-relevance")) || 0;
          return relB - relA;
        case "date-newest":
          const dateA = parseFloat(a.getAttribute("data-sort-date")) || 0;
          const dateB = parseFloat(b.getAttribute("data-sort-date")) || 0;
          return dateB - dateA;
        case "date-oldest":
          const dateC = parseFloat(a.getAttribute("data-sort-date")) || 0;
          const dateD = parseFloat(b.getAttribute("data-sort-date")) || 0;
          return dateC - dateD;
        case "title-az":
          const titleA = a.getAttribute("data-sort-title") || "";
          const titleB = b.getAttribute("data-sort-title") || "";
          return titleA.localeCompare(titleB);
        case "title-za":
          const titleC = a.getAttribute("data-sort-title") || "";
          const titleD = b.getAttribute("data-sort-title") || "";
          return titleD.localeCompare(titleC);
        default:
          return 0;
      }
    });
    cards.forEach((card) => container.appendChild(card));
  }
  async function applyFiltersAndSort() {
    if (isApplying) {
      return;
    }
    isApplying = true;
    try {
      const workAreaDropdown = document.getElementById("document_type");
      const sortDropdown = document.getElementById("sort") || document.getElementById("owner");
      if (!workAreaDropdown || !sortDropdown) {
        return;
      }
      const selectedWorkArea = workAreaDropdown.value || "All work areas";
      const selectedSort = sortDropdown.value || "relevance";
      let filtered = filterByWorkArea(selectedWorkArea);
      let sorted = sortResults(filtered, selectedSort);
      const { renderResults: renderResults2 } = await Promise.resolve().then(() => (init_search_card_template(), search_card_template_exports));
      renderResults2(sorted, "search-results-list");
      sortCardsInDOM(selectedSort);
      const currentFilters = getCurrentFilters();
      displayAppliedFilters(currentFilters);
    } finally {
      isApplying = false;
    }
  }
  function initializeFiltersAndSort() {
    if (listenersInitialized) {
      return;
    }
    const workAreaDropdown = document.getElementById("document_type");
    const sortDropdown = document.getElementById("sort") || document.getElementById("owner");
    if (workAreaDropdown) {
      workAreaDropdown.addEventListener("change", function() {
        applyFiltersAndSort();
      });
    }
    if (sortDropdown) {
      sortDropdown.addEventListener("change", function() {
        applyFiltersAndSort();
      });
    }
    listenersInitialized = true;
  }
  var allResults2, isApplying, listenersInitialized;
  var init_search_filters = __esm({
    "src/js/search-filters.js"() {
      init_applied_filters();
      allResults2 = [];
      isApplying = false;
      listenersInitialized = false;
    }
  });

  // src/js/load-initial-results.js
  var load_initial_results_exports = {};
  __export(load_initial_results_exports, {
    loadInitialResults: () => loadInitialResults
  });
  async function fetchWorkAreasList() {
    const workAreasSource = getWorkAreasDataSource();
    try {
      const response = await fetch(workAreasSource);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return null;
    }
  }
  function loadInitialResults() {
    const searchResultsContainer = document.getElementById("search-results-list");
    if (!searchResultsContainer) {
      return;
    }
    const config = getConfig();
    const primarySource = getPrimaryDataSource();
    const fallbackSource = getFallbackDataSource();
    fetchWorkAreasList().then((workAreas) => {
      if (workAreas) {
        fetchedWorkAreas = workAreas;
        setStaticWorkAreas(workAreas);
      }
    });
    fetch(primarySource).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      processAndRenderResults(data, config.isProduction ? "live-api" : "local");
    }).catch((primaryError) => {
      if (fallbackSource) {
        fetch(fallbackSource).then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        }).then((data) => {
          processAndRenderResults(data, "fallback");
        }).catch((fallbackError) => {
          displayErrorMessage();
        });
      } else {
        displayErrorMessage();
      }
    });
  }
  function displayErrorMessage() {
    const container = document.getElementById("search-results-list");
    if (container) {
      container.innerHTML = '<p class="aikb-error">Unable to load search results. Please check your connection and try again later.</p>';
    }
  }
  function processAndRenderResults(data, source = "unknown") {
    const results = Array.isArray(data) ? data : [];
    const mappedResults = results.map((result) => {
      const dateTimestamp = result["last-updated"] ? new Date(result["last-updated"]).getTime() : 0;
      return {
        title: result.title || "",
        summary: result.description || result.summary || "",
        listMetadata: {
          "Work area": result["work-area"] || [],
          Roles: result.roles || [],
          Benefits: result.benefits || []
        },
        date: result["last-updated"] ? new Date(result["last-updated"]).toLocaleDateString("en-AU", {
          year: "numeric",
          month: "long"
        }) : "",
        dateTimestamp,
        liveUrl: result.url || result.liveUrl || "",
        submittedBy: result["submitted-by"] || "",
        rank: result.rank || 0,
        score: result.score || 0
      };
    });
    const seenKeys = /* @__PURE__ */ new Set();
    const deduplicatedResults = [];
    mappedResults.forEach((result, index) => {
      const uniqueKey = result.liveUrl || result.url || result.title || JSON.stringify(result) + index;
      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);
        deduplicatedResults.push(result);
      }
    });
    storeResults(deduplicatedResults);
    window.aikbSearchCache = deduplicatedResults;
    initializeDropdowns(deduplicatedResults, fetchedWorkAreas);
    initializeFiltersAndSort();
    renderResults(deduplicatedResults, "search-results-list");
  }
  var fetchedWorkAreas;
  var init_load_initial_results = __esm({
    "src/js/load-initial-results.js"() {
      init_search_card_template();
      init_populate_dropdowns();
      init_search_filters();
      init_config();
      fetchedWorkAreas = null;
      window.addEventListener("load", function() {
        setTimeout(loadInitialResults, 200);
      });
    }
  });

  // src/js/search-form-handler.js
  var require_search_form_handler = __commonJS({
    "src/js/search-form-handler.js"() {
      init_offline_search();
      init_load_initial_results();
      init_search_card_template();
      init_search_filters();
      window.addEventListener("DOMContentLoaded", function() {
        const searchInput = document.getElementById("search");
        if (!searchInput) {
          return;
        }
        searchInput.addEventListener("keydown", function(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query === "") {
              loadInitialResults();
            } else {
              const cachedData = getCachedData();
              if (cachedData && cachedData.length > 0) {
                const results = searchLocalData(query, cachedData);
                storeResults(results);
                applyFiltersAndSort();
              } else {
                const $container = window.$("#search-results-list");
                if ($container && $container.length > 0) {
                  $container.html(
                    '<p class="aikb-error">Unable to load search results. Please check your connection and try again.</p>'
                  );
                }
              }
            }
          }
        });
      });
    }
  });

  // src/js/cta-button-alias.js
  var require_cta_button_alias = __commonJS({
    "src/js/cta-button-alias.js"() {
      var CTA_SELECTOR = 'div[data-hydration-component="squiz-call-to-action"] a';
      function applyCtaButtonAlias(root = document) {
        const anchors = root.querySelectorAll(CTA_SELECTOR);
        anchors.forEach((anchor) => {
          anchor.classList.add("ntgc-btn", "ntgc-btn--primary");
        });
      }
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => applyCtaButtonAlias());
      } else {
        applyCtaButtonAlias();
      }
    }
  });

  // src/js/landing-page.js
  var require_landing_page = __commonJS({
    "src/js/landing-page.js"() {
      init_config();
      var import_search_form_handler = __toESM(require_search_form_handler());
      init_search_filters();
      init_search_card_template();
      init_populate_dropdowns();
      init_offline_search();
      init_load_initial_results();
      var import_cta_button_alias = __toESM(require_cta_button_alias());
      init_pagination();
      init_applied_filters();
      window.addEventListener("load", function() {
        initClearAllButton();
      });
    }
  });
  require_landing_page();
})();
