/**
 * Custom Multi-Select Dropdown Component
 * Replaces the work area filter with a multi-select dropdown with OK/Cancel buttons
 *
 * Performance Optimization:
 * Uses event delegation for checkbox listeners to reduce memory footprint.
 * Instead of attaching O(N) individual listeners (2 per checkbox where N = number of options),
 * this implementation uses a single delegated listener on the dropdown panel.
 * For a typical dropdown with 10 options, this reduces 20+ listeners to just 5 total,
 * significantly improving performance and preventing memory leaks during dropdown recreation cycles.
 */

export class MultiSelectDropdown {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.options = [];
    this.selectedValues = new Set();
    this.tempSelectedValues = new Set();
    this.isOpen = false;

    this.container = null;
    this.displayButton = null;
    this.dropdownPanel = null;

    // Store bound event handlers for proper cleanup
    this._boundHandlers = {};

    this.init();
  }

  init() {
    // Hide original select element
    this.selectElement.style.display = "none";

    // Create custom dropdown structure
    this.createDropdownStructure();

    // Select all options by default
    this.selectAllByDefault();

    // Bind event listeners
    this.bindEvents();

    // Store instance reference on container for external access
    this.container.__multiSelectInstance = this;
  }

  selectAllByDefault() {
    // Add all enabled option values to selectedValues
    this.options.forEach((option) => {
      // Check if the corresponding native select option is enabled
      const nativeOption = Array.from(this.selectElement.options).find(
        (opt) => opt.value === option.value,
      );
      if (nativeOption && !nativeOption.disabled) {
        this.selectedValues.add(option.value);
      }
    });

    // Sync with native select
    this.syncNativeSelect();

    // Update display text
    this.updateDisplayText();

    // Update checkboxes
    this.tempSelectedValues = new Set(this.selectedValues);
  }

  createDropdownStructure() {
    // Main container
    this.container = document.createElement("div");
    this.container.className = "aikb-multiselect-container";

    // Display button (shows selected items)
    this.displayButton = document.createElement("button");
    this.displayButton.type = "button";
    this.displayButton.className = "aikb-multiselect-button";
    this.displayButton.innerHTML = `
      <span class="aikb-multiselect-text">Select Options</span>
      <span class="aikb-multiselect-icon"></span>
    `;

    // Dropdown panel
    this.dropdownPanel = document.createElement("div");
    this.dropdownPanel.className = "aikb-multiselect-panel";
    this.dropdownPanel.style.display = "none";

    // Options list
    const optionsList = document.createElement("div");
    optionsList.className = "aikb-multiselect-options";

    // Add "Select All" option
    const selectAllItem = this.createOptionItem({
      value: "_select_all",
      label: "Select All",
      isSelectAll: true,
    });
    optionsList.appendChild(selectAllItem);

    // Get options from original select element
    Array.from(this.selectElement.options).forEach((option) => {
      if (!option.disabled && option.value) {
        this.options.push({
          value: option.value,
          label: option.textContent,
        });

        const optionItem = this.createOptionItem({
          value: option.value,
          label: option.textContent,
        });
        optionsList.appendChild(optionItem);
      }
    });

    // Action buttons
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "aikb-multiselect-actions";

    const okButton = document.createElement("button");
    okButton.type = "button";
    okButton.className = "aikb-multiselect-btn aikb-multiselect-btn-ok";
    okButton.textContent = "OK";
    this._boundHandlers.okClick = () => this.handleOk();
    okButton.addEventListener("click", this._boundHandlers.okClick);

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "aikb-multiselect-btn aikb-multiselect-btn-cancel";
    cancelButton.textContent = "Cancel";
    this._boundHandlers.cancelClick = () => this.handleCancel();
    cancelButton.addEventListener("click", this._boundHandlers.cancelClick);

    actionsContainer.appendChild(okButton);
    actionsContainer.appendChild(cancelButton);

    // Assemble dropdown panel
    this.dropdownPanel.appendChild(optionsList);
    this.dropdownPanel.appendChild(actionsContainer);

    // Setup event delegation for checkboxes
    this._boundHandlers.checkboxChange = (e) => {
      // Only process checkbox elements
      if (!e.target.classList.contains("aikb-multiselect-checkbox")) {
        return;
      }

      if (e.target.value === "_select_all") {
        this.handleSelectAll(e);
      } else {
        this.updateSelectAllState();
      }
    };
    this.dropdownPanel.addEventListener(
      "change",
      this._boundHandlers.checkboxChange,
    );

    // Assemble container
    this.container.appendChild(this.displayButton);
    this.container.appendChild(this.dropdownPanel);

    // Insert after original select
    this.selectElement.parentNode.insertBefore(
      this.container,
      this.selectElement.nextSibling,
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

    // Event listeners handled by delegation in dropdownPanel

    const labelText = document.createElement("span");
    labelText.className = "aikb-multiselect-label";
    labelText.textContent = option.label;

    item.appendChild(checkbox);
    item.appendChild(labelText);

    return item;
  }

  bindEvents() {
    // Toggle dropdown on button click
    this._boundHandlers.displayClick = (e) => {
      e.stopPropagation();
      this.toggle();
    };
    this.displayButton.addEventListener(
      "click",
      this._boundHandlers.displayClick,
    );

    // Close dropdown when clicking outside
    this._boundHandlers.documentClick = (e) => {
      if (this.container && !this.container.contains(e.target) && this.isOpen) {
        this.handleCancel();
      }
    };
    document.addEventListener("click", this._boundHandlers.documentClick);
  }

  toggle() {
    if (!this.container || !this.dropdownPanel) {
      console.warn("MultiSelect method called after destroy(): toggle");
      return;
    }
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (!this.container || !this.dropdownPanel) {
      console.warn("MultiSelect method called after destroy(): open");
      return;
    }
    this.isOpen = true;
    this.dropdownPanel.style.display = "block";
    this.displayButton.classList.add("aikb-multiselect-open");

    // Copy current selections to temp
    this.tempSelectedValues = new Set(this.selectedValues);

    // Update checkboxes to match temp selections
    this.updateCheckboxes();
  }

  close() {
    if (!this.container || !this.dropdownPanel) {
      console.warn("MultiSelect method called after destroy(): close");
      return;
    }
    this.isOpen = false;
    this.dropdownPanel.style.display = "none";
    this.displayButton.classList.remove("aikb-multiselect-open");
  }

  handleOk() {
    if (!this.container || !this.dropdownPanel) {
      console.warn("MultiSelect method called after destroy(): handleOk");
      return;
    }
    // Get checked values
    const checkboxes = this.dropdownPanel.querySelectorAll(
      '.aikb-multiselect-checkbox:not([value="_select_all"])',
    );
    this.selectedValues.clear();

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        this.selectedValues.add(checkbox.value);
      }
    });

    // Sync the hidden native select so downstream code sees selectedOptions
    this.syncNativeSelect();

    // Update display text
    this.updateDisplayText();

    // Trigger change event
    this.triggerChange();

    // Close dropdown
    this.close();
  }

  handleCancel() {
    if (!this.container || !this.dropdownPanel) {
      console.warn("MultiSelect method called after destroy(): handleCancel");
      return;
    }
    // Revert to previous selections
    this.tempSelectedValues = new Set(this.selectedValues);
    this.updateCheckboxes();

    // Close dropdown
    this.close();
  }

  handleSelectAll(e) {
    if (!this.container || !this.dropdownPanel) {
      console.warn(
        "MultiSelect method called after destroy(): handleSelectAll",
      );
      return;
    }
    const isChecked = e.target.checked;
    const checkboxes = this.dropdownPanel.querySelectorAll(
      '.aikb-multiselect-checkbox:not([value="_select_all"])',
    );

    checkboxes.forEach((checkbox) => {
      // Skip disabled checkboxes
      if (!checkbox.disabled) {
        checkbox.checked = isChecked;
      }
    });
  }

  updateSelectAllState() {
    if (!this.container || !this.dropdownPanel) {
      console.warn(
        "MultiSelect method called after destroy(): updateSelectAllState",
      );
      return;
    }
    const selectAllCheckbox = this.dropdownPanel.querySelector(
      '.aikb-multiselect-checkbox[value="_select_all"]',
    );
    const checkboxes = this.dropdownPanel.querySelectorAll(
      '.aikb-multiselect-checkbox:not([value="_select_all"])',
    );
    // Only count enabled checkboxes
    const enabledCheckboxes = Array.from(checkboxes).filter(
      (cb) => !cb.disabled,
    );
    const checkedCount = enabledCheckboxes.filter((cb) => cb.checked).length;

    if (selectAllCheckbox) {
      selectAllCheckbox.checked =
        enabledCheckboxes.length > 0 &&
        checkedCount === enabledCheckboxes.length;
      selectAllCheckbox.indeterminate =
        checkedCount > 0 && checkedCount < enabledCheckboxes.length;
    }
  }

  updateCheckboxes() {
    if (!this.container || !this.dropdownPanel) {
      console.warn(
        "MultiSelect method called after destroy(): updateCheckboxes",
      );
      return;
    }
    const checkboxes = this.dropdownPanel.querySelectorAll(
      '.aikb-multiselect-checkbox:not([value="_select_all"])',
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.tempSelectedValues.has(checkbox.value);
    });

    this.updateSelectAllState();
  }

  updateDisplayText() {
    if (!this.container || !this.dropdownPanel) {
      console.warn(
        "MultiSelect method called after destroy(): updateDisplayText",
      );
      return;
    }
    const textElement = this.displayButton.querySelector(
      ".aikb-multiselect-text",
    );

    if (this.selectedValues.size === 0) {
      textElement.textContent = "Select Options";
      textElement.classList.remove("aikb-multiselect-has-selection");
    } else if (this.selectedValues.size === this.options.length) {
      textElement.textContent = "All selected";
      textElement.classList.add("aikb-multiselect-has-selection");
    } else if (this.selectedValues.size === 1) {
      // Show the label when only 1 item is selected
      const selectedLabels = Array.from(this.selectedValues).map((value) => {
        const option = this.options.find((opt) => opt.value === value);
        return option ? option.label : value;
      });
      textElement.textContent = selectedLabels[0];
      textElement.classList.add("aikb-multiselect-has-selection");
    } else {
      // Show "# selected" when more than 1 item is selected
      textElement.textContent = `${this.selectedValues.size} selected`;
      textElement.classList.add("aikb-multiselect-has-selection");
    }
  }

  triggerChange() {
    if (!this.container || !this.dropdownPanel) {
      console.warn("MultiSelect method called after destroy(): triggerChange");
      return;
    }
    // Dispatch custom event
    const event = new CustomEvent("multiselect-change", {
      detail: {
        values: Array.from(this.selectedValues),
      },
    });
    this.container.dispatchEvent(event);

    // Also emit a native change event on the original select so listeners fire
    if (this.selectElement) {
      const changeEvent = new Event("change", { bubbles: true });
      this.selectElement.dispatchEvent(changeEvent);
    }

    console.log("Multi-select changed:", Array.from(this.selectedValues));
  }

  syncNativeSelect() {
    if (!this.selectElement) return;

    // Clear existing selection
    Array.from(this.selectElement.options).forEach((opt) => {
      opt.selected = false;
    });

    // Apply new selections
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
    if (!this.container || !this.dropdownPanel) {
      console.warn("MultiSelect method called after destroy(): updateCounts");
      return;
    }
    // Update native select options
    Array.from(this.selectElement.options).forEach((option) => {
      if (option.value && countsMap.has(option.value)) {
        const count = countsMap.get(option.value);
        const baseLabel = option.textContent.replace(/\s*\(\d+\)\s*$/, ""); // Remove existing count

        if (count > 0) {
          option.textContent = `${baseLabel} (${count})`;
          option.disabled = false;
        } else {
          option.textContent = baseLabel;
          option.disabled = true;
          option.selected = false;
        }
      }
    });

    // Update custom dropdown labels
    const checkboxes = this.dropdownPanel.querySelectorAll(
      '.aikb-multiselect-checkbox:not([value="_select_all"])',
    );

    checkboxes.forEach((checkbox) => {
      const value = checkbox.value;
      if (countsMap.has(value)) {
        const count = countsMap.get(value);
        const optionItem = checkbox.parentElement;
        const labelSpan = optionItem.querySelector(".aikb-multiselect-label");

        if (labelSpan) {
          // Remove existing badge or count text
          const existingBadge = labelSpan.querySelector(".aikb-count-badge");
          if (existingBadge) {
            existingBadge.remove();
          }

          // Get base label text without count
          let baseLabel = labelSpan.textContent
            .replace(/\s*\(\d+\)\s*$/, "")
            .trim();

          // Clear and rebuild label content
          labelSpan.textContent = baseLabel;

          // Add count badge (always show, even for 0)
          const badge = document.createElement("span");
          badge.className = "aikb-count-badge";
          badge.textContent = count.toString();
          labelSpan.appendChild(badge);

          // Disable checkbox and add disabled class if count is 0
          if (count === 0) {
            checkbox.disabled = true;
            checkbox.checked = false;
            optionItem.classList.add("aikb-multiselect-option-disabled");

            // Remove from selectedValues if it was selected
            this.selectedValues.delete(value);
            this.tempSelectedValues.delete(value);

            // Update option in this.options array with count
            const optionIndex = this.options.findIndex(
              (opt) => opt.value === value,
            );
            if (optionIndex !== -1) {
              this.options[optionIndex].label = `${baseLabel} (${count})`;
            }
          } else {
            // Enable checkbox and remove disabled class if count > 0
            checkbox.disabled = false;
            optionItem.classList.remove("aikb-multiselect-option-disabled");

            // Update option in this.options array for display text calculation
            const optionIndex = this.options.findIndex(
              (opt) => opt.value === value,
            );
            if (optionIndex !== -1) {
              this.options[optionIndex].label = `${baseLabel} (${count})`;
            }
          }
        }
      }
    });

    // Sync native select to match selectedValues after removing 0-count options
    this.syncNativeSelect();

    // Update display text to reflect new labels
    this.updateDisplayText();

    console.log("Multi-select counts updated");
  }

  destroy() {
    // Remove all event listeners to prevent memory leaks
    if (this._boundHandlers) {
      // Remove document-level listener (critical to prevent null reference errors)
      if (this._boundHandlers.documentClick) {
        document.removeEventListener(
          "click",
          this._boundHandlers.documentClick,
        );
      }

      // Remove display button listener
      if (this.displayButton && this._boundHandlers.displayClick) {
        this.displayButton.removeEventListener(
          "click",
          this._boundHandlers.displayClick,
        );
      }

      // Remove delegated checkbox listener
      if (this.dropdownPanel && this._boundHandlers.checkboxChange) {
        this.dropdownPanel.removeEventListener(
          "change",
          this._boundHandlers.checkboxChange,
        );
      }

      // OK/Cancel button listeners are removed when container is removed from DOM
      // but we clear the references for completeness
    }

    // Close dropdown if open
    this.isOpen = false;

    // Remove the custom dropdown container from DOM
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Show the original select element
    if (this.selectElement) {
      this.selectElement.style.display = "";
    }

    // Clear all references
    this.container = null;
    this.displayButton = null;
    this.dropdownPanel = null;
    this._boundHandlers = null;

    console.log("Multi-select instance destroyed");
  }
}

/**
 * Initialize multi-select dropdown on a select element
 * @param {string|HTMLElement} selector - CSS selector or DOM element
 * @returns {MultiSelectDropdown} - MultiSelectDropdown instance
 */
export function initMultiSelect(selector) {
  const element =
    typeof selector === "string" ? document.querySelector(selector) : selector;

  if (!element) {
    console.warn("Multi-select element not found:", selector);
    return null;
  }

  return new MultiSelectDropdown(element);
}
