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
  var init_config = __esm({
    "src/js/config.js"() {
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
  function createSearchCard(result) {
    if (!result.title || !result.summary || !result.liveUrl) {
      console.warn("Skipping card with missing required fields:", result);
      return null;
    }
    const card = document.createElement("div");
    card.className = "aikb-search-card";
    const inner = document.createElement("div");
    inner.className = "aikb-search-card__inner";
    const content = document.createElement("div");
    content.className = "aikb-search-card__content";
    const textSection = document.createElement("div");
    textSection.className = "aikb-search-card__text";
    const title = document.createElement("h3");
    title.className = "aikb-search-card__title";
    title.textContent = result.title;
    textSection.appendChild(title);
    const summary = document.createElement("p");
    summary.className = "aikb-search-card__summary";
    summary.textContent = result.summary;
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
      const text = document.createTextNode(roles.join(", "));
      value.appendChild(text);
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
    console.log(
      `renderResults called with ${results.length} results for container #${containerId}`
    );
    let container = document.getElementById(containerId);
    console.log(`document.getElementById("${containerId}"):`, container);
    if (!container) {
      const $container = window.$ ? window.$(`#${containerId}`) : null;
      console.log(`jQuery selector $("#${containerId}"):`, $container);
      container = $container && $container.length > 0 ? $container[0] : null;
    }
    if (!container) {
      console.error(`Container #${containerId} not found`);
      console.log(
        "Available elements with id:",
        Array.from(document.querySelectorAll("[id]")).map((el) => el.id)
      );
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
          console.log(
            `Rendered ${cards.length} of ${results.length} search result cards (page 1)`
          );
        }
      );
    } else {
      const cards = results.map((result) => createSearchCard(result)).filter((card) => card !== null);
      cards.forEach((card) => container.appendChild(card));
      console.log(`Rendered ${cards.length} search result cards`);
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
            console.log(
              `Rendered ${cards.length} cards for page ${event.detail.page}`
            );
          }
        });
        paginationListenerAdded = true;
      }
    }
  });

  // src/js/multi-select-dropdown.js
  function initMultiSelect(selector) {
    const element = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!element) {
      console.warn("Multi-select element not found:", selector);
      return null;
    }
    return new MultiSelectDropdown(element);
  }
  var MultiSelectDropdown;
  var init_multi_select_dropdown = __esm({
    "src/js/multi-select-dropdown.js"() {
      MultiSelectDropdown = class {
        constructor(selectElement) {
          this.selectElement = selectElement;
          this.options = [];
          this.selectedValues = /* @__PURE__ */ new Set();
          this.tempSelectedValues = /* @__PURE__ */ new Set();
          this.isOpen = false;
          this.container = null;
          this.displayButton = null;
          this.dropdownPanel = null;
          this.init();
        }
        init() {
          this.selectElement.style.display = "none";
          this.createDropdownStructure();
          this.selectAllByDefault();
          this.bindEvents();
          this.container.__multiSelectInstance = this;
        }
        selectAllByDefault() {
          this.options.forEach((option) => {
            this.selectedValues.add(option.value);
          });
          this.syncNativeSelect();
          this.updateDisplayText();
          this.tempSelectedValues = new Set(this.selectedValues);
        }
        createDropdownStructure() {
          this.container = document.createElement("div");
          this.container.className = "aikb-multiselect-container";
          this.displayButton = document.createElement("button");
          this.displayButton.type = "button";
          this.displayButton.className = "aikb-multiselect-button";
          this.displayButton.innerHTML = `
      <span class="aikb-multiselect-text">Select Options</span>
      <span class="aikb-multiselect-icon"></span>
    `;
          this.dropdownPanel = document.createElement("div");
          this.dropdownPanel.className = "aikb-multiselect-panel";
          this.dropdownPanel.style.display = "none";
          const optionsList = document.createElement("div");
          optionsList.className = "aikb-multiselect-options";
          const selectAllItem = this.createOptionItem({
            value: "_select_all",
            label: "Select All",
            isSelectAll: true
          });
          optionsList.appendChild(selectAllItem);
          Array.from(this.selectElement.options).forEach((option) => {
            if (!option.disabled && option.value) {
              this.options.push({
                value: option.value,
                label: option.textContent
              });
              const optionItem = this.createOptionItem({
                value: option.value,
                label: option.textContent
              });
              optionsList.appendChild(optionItem);
            }
          });
          const actionsContainer = document.createElement("div");
          actionsContainer.className = "aikb-multiselect-actions";
          const okButton = document.createElement("button");
          okButton.type = "button";
          okButton.className = "aikb-multiselect-btn aikb-multiselect-btn-ok";
          okButton.textContent = "OK";
          okButton.addEventListener("click", () => this.handleOk());
          const cancelButton = document.createElement("button");
          cancelButton.type = "button";
          cancelButton.className = "aikb-multiselect-btn aikb-multiselect-btn-cancel";
          cancelButton.textContent = "Cancel";
          cancelButton.addEventListener("click", () => this.handleCancel());
          actionsContainer.appendChild(okButton);
          actionsContainer.appendChild(cancelButton);
          this.dropdownPanel.appendChild(optionsList);
          this.dropdownPanel.appendChild(actionsContainer);
          this.container.appendChild(this.displayButton);
          this.container.appendChild(this.dropdownPanel);
          this.selectElement.parentNode.insertBefore(
            this.container,
            this.selectElement.nextSibling
          );
        }
        createOptionItem(option) {
          const item = document.createElement("label");
          item.className = "aikb-multiselect-option";
          if (option.isSelectAll) {
            item.classList.add("aikb-multiselect-option-all");
          }
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "aikb-multiselect-checkbox";
          checkbox.value = option.value;
          checkbox.dataset.label = option.label;
          if (option.isSelectAll) {
            checkbox.addEventListener("change", (e) => this.handleSelectAll(e));
          } else {
            checkbox.addEventListener("change", () => this.updateSelectAllState());
          }
          const labelText = document.createElement("span");
          labelText.className = "aikb-multiselect-label";
          labelText.textContent = option.label;
          item.appendChild(checkbox);
          item.appendChild(labelText);
          return item;
        }
        bindEvents() {
          this.displayButton.addEventListener("click", (e) => {
            e.stopPropagation();
            this.toggle();
          });
          document.addEventListener("click", (e) => {
            if (!this.container.contains(e.target) && this.isOpen) {
              this.handleCancel();
            }
          });
        }
        toggle() {
          if (this.isOpen) {
            this.close();
          } else {
            this.open();
          }
        }
        open() {
          this.isOpen = true;
          this.dropdownPanel.style.display = "block";
          this.displayButton.classList.add("aikb-multiselect-open");
          this.tempSelectedValues = new Set(this.selectedValues);
          this.updateCheckboxes();
        }
        close() {
          this.isOpen = false;
          this.dropdownPanel.style.display = "none";
          this.displayButton.classList.remove("aikb-multiselect-open");
        }
        handleOk() {
          const checkboxes = this.dropdownPanel.querySelectorAll(
            '.aikb-multiselect-checkbox:not([value="_select_all"])'
          );
          this.selectedValues.clear();
          checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              this.selectedValues.add(checkbox.value);
            }
          });
          this.syncNativeSelect();
          this.updateDisplayText();
          this.triggerChange();
          this.close();
        }
        handleCancel() {
          this.tempSelectedValues = new Set(this.selectedValues);
          this.updateCheckboxes();
          this.close();
        }
        handleSelectAll(e) {
          const isChecked = e.target.checked;
          const checkboxes = this.dropdownPanel.querySelectorAll(
            '.aikb-multiselect-checkbox:not([value="_select_all"])'
          );
          checkboxes.forEach((checkbox) => {
            checkbox.checked = isChecked;
          });
        }
        updateSelectAllState() {
          const selectAllCheckbox = this.dropdownPanel.querySelector(
            '.aikb-multiselect-checkbox[value="_select_all"]'
          );
          const checkboxes = this.dropdownPanel.querySelectorAll(
            '.aikb-multiselect-checkbox:not([value="_select_all"])'
          );
          const checkedCount = Array.from(checkboxes).filter(
            (cb) => cb.checked
          ).length;
          if (selectAllCheckbox) {
            selectAllCheckbox.checked = checkedCount === checkboxes.length;
            selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
          }
        }
        updateCheckboxes() {
          const checkboxes = this.dropdownPanel.querySelectorAll(
            '.aikb-multiselect-checkbox:not([value="_select_all"])'
          );
          checkboxes.forEach((checkbox) => {
            checkbox.checked = this.tempSelectedValues.has(checkbox.value);
          });
          this.updateSelectAllState();
        }
        updateDisplayText() {
          const textElement = this.displayButton.querySelector(
            ".aikb-multiselect-text"
          );
          if (this.selectedValues.size === 0) {
            textElement.textContent = "Select Options";
            textElement.classList.remove("aikb-multiselect-has-selection");
          } else if (this.selectedValues.size === this.options.length) {
            textElement.textContent = "All selected";
            textElement.classList.add("aikb-multiselect-has-selection");
          } else {
            const selectedLabels = Array.from(this.selectedValues).map((value) => {
              const option = this.options.find((opt) => opt.value === value);
              return option ? option.label : value;
            });
            if (this.selectedValues.size <= 2) {
              textElement.textContent = selectedLabels.join(", ");
            } else {
              textElement.textContent = `${this.selectedValues.size} selected`;
            }
            textElement.classList.add("aikb-multiselect-has-selection");
          }
        }
        triggerChange() {
          const event = new CustomEvent("multiselect-change", {
            detail: {
              values: Array.from(this.selectedValues)
            }
          });
          this.container.dispatchEvent(event);
          if (this.selectElement) {
            const changeEvent = new Event("change", { bubbles: true });
            this.selectElement.dispatchEvent(changeEvent);
          }
          console.log("Multi-select changed:", Array.from(this.selectedValues));
        }
        syncNativeSelect() {
          if (!this.selectElement) return;
          Array.from(this.selectElement.options).forEach((opt) => {
            opt.selected = false;
          });
          Array.from(this.selectElement.options).forEach((opt) => {
            if (this.selectedValues.has(opt.value)) {
              opt.selected = true;
            }
          });
        }
        getSelectedValues() {
          return Array.from(this.selectedValues);
        }
        reset() {
          this.selectedValues.clear();
          this.tempSelectedValues.clear();
          this.updateDisplayText();
          this.updateCheckboxes();
        }
        /**
         * Update option labels with counts
         * @param {Map<string, number>} countsMap - Map of option values to counts
         */
        updateCounts(countsMap) {
          Array.from(this.selectElement.options).forEach((option) => {
            if (!option.disabled && option.value && countsMap.has(option.value)) {
              const count = countsMap.get(option.value);
              const baseLabel = option.textContent.replace(/\s*\(\d+\)\s*$/, "");
              if (count > 0) {
                option.textContent = `${baseLabel} (${count})`;
              } else {
                option.textContent = baseLabel;
              }
            }
          });
          const checkboxes = this.dropdownPanel.querySelectorAll(
            '.aikb-multiselect-checkbox:not([value="_select_all"])'
          );
          checkboxes.forEach((checkbox) => {
            const value = checkbox.value;
            if (countsMap.has(value)) {
              const count = countsMap.get(value);
              const labelSpan = checkbox.parentElement.querySelector(
                ".aikb-multiselect-label"
              );
              if (labelSpan) {
                const existingBadge = labelSpan.querySelector(".aikb-count-badge");
                if (existingBadge) {
                  existingBadge.remove();
                }
                let baseLabel = labelSpan.textContent.replace(/\s*\(\d+\)\s*$/, "").trim();
                labelSpan.textContent = baseLabel;
                if (count > 0) {
                  const badge = document.createElement("span");
                  badge.className = "aikb-count-badge";
                  badge.textContent = count.toString();
                  labelSpan.appendChild(badge);
                  const optionIndex = this.options.findIndex(
                    (opt) => opt.value === value
                  );
                  if (optionIndex !== -1) {
                    this.options[optionIndex].label = `${baseLabel} (${count})`;
                  }
                } else {
                  const optionIndex = this.options.findIndex(
                    (opt) => opt.value === value
                  );
                  if (optionIndex !== -1) {
                    this.options[optionIndex].label = baseLabel;
                  }
                }
              }
            }
          });
          this.updateDisplayText();
          console.log("Multi-select counts updated");
        }
        destroy() {
          if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
          }
          if (this.selectElement) {
            this.selectElement.style.display = "";
          }
          this.container = null;
          this.displayButton = null;
          this.dropdownPanel = null;
          console.log("Multi-select instance destroyed");
        }
      };
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
      if (a === "All work areas") return -1;
      if (b === "All work areas") return 1;
      return a.localeCompare(b);
    });
  }
  function calculateWorkAreaCounts(workAreas, results) {
    const counts = /* @__PURE__ */ new Map();
    workAreas.forEach((workArea) => {
      counts.set(workArea, 0);
    });
    results.forEach((result) => {
      if (result.listMetadata && result.listMetadata["Work area"]) {
        const resultWorkAreas = result.listMetadata["Work area"];
        if (Array.isArray(resultWorkAreas)) {
          resultWorkAreas.forEach((area) => {
            const trimmed = area.trim();
            if (trimmed && counts.has(trimmed)) {
              counts.set(trimmed, counts.get(trimmed) + 1);
            }
          });
        }
      }
    });
    if (counts.has("All work areas")) {
      counts.set("All work areas", results.length);
    }
    return counts;
  }
  function setStaticWorkAreas(workAreas) {
    staticWorkAreas = workAreas;
    console.log(`Stored ${workAreas.length} static work areas`);
  }
  function populateWorkAreaDropdown(workAreas) {
    const dropdown = document.getElementById("document_type");
    if (!dropdown) {
      console.warn("Work area dropdown #document_type not found");
      return;
    }
    dropdown.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a work area";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);
    workAreas.forEach((workArea) => {
      const option = document.createElement("option");
      option.value = workArea;
      option.textContent = workArea;
      dropdown.appendChild(option);
    });
    console.log(`Populated work area dropdown with ${workAreas.length} options`);
    if (multiSelectInstance) {
      multiSelectInstance.destroy();
      multiSelectInstance = null;
    }
    if (!dropdown.nextElementSibling || !dropdown.nextElementSibling.classList.contains(
      "aikb-multiselect-container"
    )) {
      multiSelectInstance = initMultiSelect(dropdown);
    }
  }
  function populateSortDropdown() {
    const container = document.getElementById("select-question-3");
    if (!container) {
      console.warn("Sort dropdown container #select-question-3 not found");
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
    console.log(`Populated sort dropdown with ${sortOptions.length} options`);
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
    console.log("Initializing dropdowns with search data...");
    let workAreas;
    if (workAreasFromFetch && workAreasFromFetch.length > 0) {
      workAreas = workAreasFromFetch;
      console.log("Using pre-fetched static work areas list");
    } else if (staticWorkAreas.length > 0) {
      workAreas = staticWorkAreas;
      console.log("Using stored static work areas list");
    } else {
      workAreas = extractWorkAreas(results);
      console.log("Extracted work areas from results (fallback)");
    }
    populateWorkAreaDropdown(workAreas);
    const counts = calculateWorkAreaCounts(workAreas, results);
    if (multiSelectInstance) {
      multiSelectInstance.updateCounts(counts);
    }
    populateSortDropdown();
    addDropdownIcons();
    console.log("Dropdowns initialized successfully");
  }
  var multiSelectInstance, staticWorkAreas;
  var init_populate_dropdowns = __esm({
    "src/js/populate-dropdowns.js"() {
      init_multi_select_dropdown();
      multiSelectInstance = null;
      staticWorkAreas = [];
    }
  });

  // src/js/applied-filters.js
  function displayAppliedFilters(filters) {
    const section = document.getElementById("appliedFiltersSection");
    const container = document.getElementById("appliedFilters");
    const clearAllBtn = document.getElementById("clearAllBtn");
    if (!section || !container) {
      console.warn("Applied filters section not found");
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
    if (filters.workAreas && filters.workAreas.length > 0) {
      const allWorkAreasSelected = isAllWorkAreasSelected(filters.workAreas);
      if (!allWorkAreasSelected) {
        hasFilters = true;
        filters.workAreas.forEach((workArea) => {
          const pill = createFilterPill(
            "Work area",
            workArea,
            "bg-primary",
            "work-area",
            workArea
          );
          container.appendChild(pill);
        });
      }
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
  function isAllWorkAreasSelected(selectedWorkAreas) {
    const dropdown = document.getElementById("document_type");
    if (!dropdown) return false;
    const totalOptions = Array.from(dropdown.options).filter(
      (opt) => !opt.disabled && opt.value
    ).length;
    return selectedWorkAreas.length === totalOptions;
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
    console.log(`Removing filter: ${filterType}`, filterValue);
    switch (filterType) {
      case "search":
        const searchInput = document.getElementById("search");
        if (searchInput) {
          searchInput.value = "";
          const { loadInitialResults: loadInitialResults2 } = await Promise.resolve().then(() => (init_load_initial_results(), load_initial_results_exports));
          loadInitialResults2();
        }
        break;
      case "work-area":
        const workAreaDropdown = document.getElementById("document_type");
        if (workAreaDropdown && filterValue) {
          const option = Array.from(workAreaDropdown.options).find(
            (opt) => opt.value === filterValue
          );
          if (option) {
            option.selected = false;
          }
          const changeEvent = new Event("change", { bubbles: true });
          workAreaDropdown.dispatchEvent(changeEvent);
          const multiSelectContainer = workAreaDropdown.nextElementSibling;
          if (multiSelectContainer && multiSelectContainer.classList.contains("aikb-multiselect-container")) {
            const instance = multiSelectContainer.__multiSelectInstance;
            if (instance) {
              instance.selectedValues.delete(filterValue);
              instance.syncNativeSelect();
              instance.updateDisplayText();
              instance.triggerChange();
            }
          }
        }
        break;
    }
  }
  async function clearAllFilters() {
    console.log("Clearing all filters");
    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.value = "";
    }
    const workAreaDropdown = document.getElementById("document_type");
    if (workAreaDropdown) {
      Array.from(workAreaDropdown.options).forEach((opt) => {
        if (!opt.disabled && opt.value) {
          opt.selected = true;
        }
      });
      const multiSelectContainer = workAreaDropdown.nextElementSibling;
      if (multiSelectContainer && multiSelectContainer.classList.contains("aikb-multiselect-container")) {
        const instance = multiSelectContainer.__multiSelectInstance;
        if (instance && typeof instance.selectAllByDefault === "function") {
          instance.selectAllByDefault();
          instance.triggerChange();
        }
      }
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
      workAreas: [],
      sort: sortDropdown ? sortDropdown.value : "relevance"
    };
    if (workAreaDropdown) {
      const selectedOptions = Array.from(workAreaDropdown.selectedOptions || []);
      filters.workAreas = selectedOptions.map((opt) => opt.value).filter((val) => val && val.trim().length > 0);
    }
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
    console.log(
      `Stored ${allResults2.length} results for filtering/sorting (${results.length - allResults2.length} duplicates removed)`
    );
  }
  function filterByWorkArea(selectedWorkAreas) {
    if (!selectedWorkAreas || selectedWorkAreas.length === 0) {
      return allResults2;
    }
    const seenKeys = /* @__PURE__ */ new Set();
    const filtered = [];
    allResults2.forEach((result, index) => {
      if (!result.listMetadata || !result.listMetadata["Work area"]) {
        return;
      }
      const resultWorkAreas = result.listMetadata["Work area"];
      const matches = selectedWorkAreas.some(
        (selectedArea) => resultWorkAreas.includes(selectedArea)
      );
      if (matches) {
        const uniqueKey = result.liveUrl || result.url || result.title || JSON.stringify(result) + index;
        if (!seenKeys.has(uniqueKey)) {
          seenKeys.add(uniqueKey);
          filtered.push(result);
        }
      }
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
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "date-oldest":
        sorted.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
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
  async function applyFiltersAndSort() {
    if (isApplying) {
      console.log("Filter/sort already in progress, skipping duplicate call");
      return;
    }
    isApplying = true;
    try {
      const workAreaDropdown = document.getElementById("document_type");
      const sortDropdown = document.getElementById("sort") || document.getElementById("owner");
      if (!workAreaDropdown || !sortDropdown) {
        console.warn("Required dropdowns not found (document_type or sort)");
        return;
      }
      let selectedWorkAreas = [];
      if (workAreaDropdown) {
        const selectedOptions = Array.from(workAreaDropdown.selectedOptions || []);
        selectedWorkAreas = selectedOptions.map((opt) => opt.value).filter((val) => val && val.trim().length > 0);
      }
      const selectedSort = sortDropdown.value || "relevance";
      console.log(
        `Applying filters - Work Areas: [${selectedWorkAreas.join(
          ", "
        )}], Sort: "${selectedSort}"`
      );
      let filtered = filterByWorkArea(selectedWorkAreas);
      console.log(`After filtering: ${filtered.length} results`);
      let sorted = sortResults(filtered, selectedSort);
      console.log(`After sorting: ${sorted.length} results`);
      const { renderResults: renderResults2 } = await Promise.resolve().then(() => (init_search_card_template(), search_card_template_exports));
      renderResults2(sorted, "search-results-list");
      const currentFilters = getCurrentFilters();
      displayAppliedFilters(currentFilters);
    } finally {
      isApplying = false;
    }
  }
  function initializeFiltersAndSort() {
    if (listenersInitialized) {
      console.log("Filter and sort listeners already initialized, skipping");
      return;
    }
    const workAreaDropdown = document.getElementById("document_type");
    const sortDropdown = document.getElementById("sort") || document.getElementById("owner");
    if (workAreaDropdown) {
      workAreaDropdown.addEventListener("change", function() {
        console.log("Work area filter changed");
        applyFiltersAndSort();
      });
      const multiSelectContainer = workAreaDropdown.nextElementSibling;
      if (multiSelectContainer && multiSelectContainer.classList.contains("aikb-multiselect-container")) {
        multiSelectContainer.addEventListener("multiselect-change", () => {
          console.log("Work area filter applied via custom multi-select");
          applyFiltersAndSort();
        });
      }
      if (typeof window.$ !== "undefined") {
        window.$(workAreaDropdown).on("sumo:closed", function() {
          console.log("Work area filter applied via SumoSelect OK");
          applyFiltersAndSort();
        });
      }
    }
    if (sortDropdown) {
      sortDropdown.addEventListener("change", function() {
        console.log(`Sort changed to: ${this.value}`);
        applyFiltersAndSort();
      });
    }
    listenersInitialized = true;
    console.log("Filter and sort listeners initialized");
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
    console.log(`Fetching work areas from ${workAreasSource}...`);
    try {
      const response = await fetch(workAreasSource);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Work areas loaded successfully:`, data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching work areas from ${workAreasSource}:`, error);
      return null;
    }
  }
  function loadInitialResults() {
    const searchResultsContainer = document.getElementById("search-results-list");
    if (!searchResultsContainer) {
      console.warn("search-results-list container not found on page");
      return;
    }
    const config = getConfig();
    const primarySource = getPrimaryDataSource();
    const fallbackSource = getFallbackDataSource();
    console.log(
      `Loading initial results from ${config.isProduction ? "live API" : "local JSON"}...`
    );
    fetchWorkAreasList().then((workAreas) => {
      if (workAreas) {
        fetchedWorkAreas = workAreas;
        setStaticWorkAreas(workAreas);
      }
    });
    fetch(primarySource).then((response) => {
      console.log(
        `Primary source (${primarySource}) response status:`,
        response.status,
        response.ok
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      console.log(
        `Primary source data loaded successfully (${config.isProduction ? "live API" : "local JSON"}):`,
        data
      );
      processAndRenderResults(data, config.isProduction ? "live-api" : "local");
    }).catch((primaryError) => {
      console.error(
        `Error loading from primary source (${primarySource}):`,
        primaryError
      );
      if (fallbackSource) {
        console.log("Attempting fallback to local JSON...");
        fetch(fallbackSource).then((response) => {
          console.log(
            "Fallback JSON response status:",
            response.status,
            response.ok
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        }).then((data) => {
          console.log("Fallback JSON data loaded successfully:", data);
          processAndRenderResults(data, "fallback");
        }).catch((fallbackError) => {
          console.error("Error loading fallback search.json:", fallbackError);
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
    const mappedResults = results.map((result) => ({
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
      liveUrl: result.url || result.liveUrl || "",
      submittedBy: result["submitted-by"] || ""
    }));
    console.log(`Rendering ${mappedResults.length} cards from ${source}`);
    const seenKeys = /* @__PURE__ */ new Set();
    const deduplicatedResults = [];
    mappedResults.forEach((result, index) => {
      const uniqueKey = result.liveUrl || result.url || result.title || JSON.stringify(result) + index;
      if (!seenKeys.has(uniqueKey)) {
        seenKeys.add(uniqueKey);
        deduplicatedResults.push(result);
      }
    });
    if (mappedResults.length !== deduplicatedResults.length) {
      console.log(
        `Removed ${mappedResults.length - deduplicatedResults.length} duplicate items from source data`
      );
    }
    storeResults(deduplicatedResults);
    window.aikbSearchCache = deduplicatedResults;
    console.log(
      `Cached ${deduplicatedResults.length} results for offline search`
    );
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
        console.log("Page load event fired, loading initial results...");
        setTimeout(loadInitialResults, 200);
      });
    }
  });

  // src/js/offline-search.js
  function searchLocalData(keywords, results) {
    if (!keywords || !results || results.length === 0) {
      console.log("Offline search: No keywords or no cached results available");
      return [];
    }
    const normalizedKeywords = keywords.toLowerCase().replace(/[^\w\s]/g, "").trim();
    if (!normalizedKeywords) {
      console.log("Offline search: Keywords empty after normalization");
      return [];
    }
    console.log(
      `Offline search: Searching for "${keywords}" in ${results.length} cached results`
    );
    const keywordPattern = new RegExp(normalizedKeywords, "gi");
    const scoredResults = results.map((result) => {
      let score = 0;
      let titleMatches = 0;
      let summaryMatches = 0;
      let metadataMatches = 0;
      if (result.title) {
        const titleText = result.title.toLowerCase().replace(/[^\w\s]/g, "");
        const matches = titleText.match(keywordPattern);
        if (matches) {
          titleMatches = matches.length;
          score += titleMatches * 3;
        }
      }
      if (result.summary) {
        const summaryText = result.summary.toLowerCase().replace(/[^\w\s]/g, "");
        const matches = summaryText.match(keywordPattern);
        if (matches) {
          summaryMatches = matches.length;
          score += summaryMatches * 1;
        }
      }
      if (result.metadata) {
        const metadataText = result.metadata.toLowerCase().replace(/[^\w\s]/g, "");
        const matches = metadataText.match(keywordPattern);
        if (matches) {
          metadataMatches = matches.length;
          score += metadataMatches * 2;
        }
      }
      return {
        ...result,
        _offlineScore: score,
        _offlineMatches: {
          title: titleMatches,
          summary: summaryMatches,
          metadata: metadataMatches
        }
      };
    });
    const matchedResults = scoredResults.filter(
      (result) => result._offlineScore > 0
    );
    matchedResults.sort((a, b) => b._offlineScore - a._offlineScore);
    console.log(
      `Offline search: Found ${matchedResults.length} results matching "${keywords}"`
    );
    if (matchedResults.length > 0) {
      console.log("Offline search: Top results:");
      matchedResults.slice(0, 3).forEach((result, index) => {
        console.log(
          `  ${index + 1}. "${result.title}" (score: ${result._offlineScore}, title:${result._offlineMatches.title}, summary:${result._offlineMatches.summary}, metadata:${result._offlineMatches.metadata})`
        );
      });
    }
    return matchedResults;
  }
  function getCachedData() {
    if (window.aikbSearchCache && Array.isArray(window.aikbSearchCache)) {
      console.log(
        `Offline search: Retrieved ${window.aikbSearchCache.length} cached results`
      );
      return window.aikbSearchCache;
    }
    console.log("Offline search: No cached data available");
    return null;
  }
  var init_offline_search = __esm({
    "src/js/offline-search.js"() {
    }
  });

  // src/js/search-form-handler.js
  var require_search_form_handler = __commonJS({
    "src/js/search-form-handler.js"() {
      init_load_initial_results();
      init_search_card_template();
      init_offline_search();
      init_search_filters();
      init_populate_dropdowns();
      init_applied_filters();
      (function initSearchForm() {
        if (typeof window.$ === "undefined") {
          console.warn("jQuery not loaded; search form handler disabled");
          return;
        }
        const $form = window.$("#policy-search-form");
        const $searchInput = window.$("#search");
        if ($form.length === 0) {
          console.error("Form #policy-search-form not found");
          return;
        }
        function getSearchParams() {
          return {
            query: $searchInput.val() || "",
            area: window.$("#document_type").val() || ""
          };
        }
        function handleFormSubmit(event) {
          event.preventDefault();
        }
        function handleClearInput() {
          $searchInput.val("");
          console.log("Search cleared - restoring filtered view of all results");
          const cachedData = getCachedData();
          if (cachedData && cachedData.length > 0) {
            storeResults(cachedData);
            applyFiltersAndSort();
          }
        }
        $form.on("submit", handleFormSubmit);
        window.$("#clear-input").on("click", handleClearInput);
        $searchInput.on("input", function() {
          const $clearBtn = window.$("#clear-input");
          if (window.$(this).val().length > 0) {
            $clearBtn.attr("hidden", false);
          } else {
            $clearBtn.attr("hidden", "");
          }
        });
        $searchInput.on("keydown", function(event) {
          if (event.key === "Enter" || event.keyCode === 13) {
            event.preventDefault();
            const searchText = window.$(this).val();
            if (searchText.trim()) {
              triggerSearch(searchText);
            } else {
              console.log(
                "Empty search via Enter - restoring filtered view of all results"
              );
              const cachedData = getCachedData();
              if (cachedData && cachedData.length > 0) {
                storeResults(cachedData);
                applyFiltersAndSort();
              }
            }
          }
        });
        function triggerSearch(queryText) {
          if (!queryText.trim()) {
            return;
          }
          console.log(`Triggered search for: "${queryText}"`);
          const cachedData = getCachedData();
          if (cachedData && cachedData.length > 0) {
            console.log("Performing local search");
            const localResults = searchLocalData(queryText, cachedData);
            storeResults(localResults);
            applyFiltersAndSort();
            console.log(
              `Local search: Found ${localResults.length} results, applying filters`
            );
          } else {
            console.error("No cached data available for search");
            const $container = window.$("#search-results-list");
            if ($container.length > 0) {
              $container.html(
                '<p class="aikb-error">Unable to load search results. Please check your connection and try again.</p>'
              );
            }
          }
        }
        console.log("Search form handler initialized");
      })();
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
      init_multi_select_dropdown();
      init_load_initial_results();
      var import_cta_button_alias = __toESM(require_cta_button_alias());
      init_pagination();
      init_applied_filters();
      console.log("[aikb] Landing page bundle loaded successfully");
      console.log("[aikb] jQuery available:", typeof window.jQuery !== "undefined");
      console.log("[aikb] DOM ready state:", document.readyState);
      window.addEventListener("load", function() {
        initClearAllButton();
        console.log("[aikb] Applied filters initialized");
      });
    }
  });
  require_landing_page();
})();
