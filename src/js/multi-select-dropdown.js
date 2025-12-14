/**
 * Custom Multi-Select Dropdown Component
 * Replaces the work area filter with a multi-select dropdown with OK/Cancel buttons
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

    this.init();
  }

  init() {
    // Hide original select element
    this.selectElement.style.display = "none";

    // Create custom dropdown structure
    this.createDropdownStructure();

    // Bind event listeners
    this.bindEvents();

    // Store instance reference on container for external access
    this.container.__multiSelectInstance = this;
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
    okButton.addEventListener("click", () => this.handleOk());

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "aikb-multiselect-btn aikb-multiselect-btn-cancel";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => this.handleCancel());

    actionsContainer.appendChild(okButton);
    actionsContainer.appendChild(cancelButton);

    // Assemble dropdown panel
    this.dropdownPanel.appendChild(optionsList);
    this.dropdownPanel.appendChild(actionsContainer);

    // Assemble container
    this.container.appendChild(this.displayButton);
    this.container.appendChild(this.dropdownPanel);

    // Insert after original select
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
    // Toggle dropdown on button click
    this.displayButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close dropdown when clicking outside
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

    // Copy current selections to temp
    this.tempSelectedValues = new Set(this.selectedValues);

    // Update checkboxes to match temp selections
    this.updateCheckboxes();
  }

  close() {
    this.isOpen = false;
    this.dropdownPanel.style.display = "none";
    this.displayButton.classList.remove("aikb-multiselect-open");
  }

  handleOk() {
    // Get checked values
    const checkboxes = this.dropdownPanel.querySelectorAll(
      '.aikb-multiselect-checkbox:not([value="_select_all"])'
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
    // Revert to previous selections
    this.tempSelectedValues = new Set(this.selectedValues);
    this.updateCheckboxes();

    // Close dropdown
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
      selectAllCheckbox.indeterminate =
        checkedCount > 0 && checkedCount < checkboxes.length;
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

  destroy() {
    // Remove the custom dropdown container from DOM
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Show the original select element
    if (this.selectElement) {
      this.selectElement.style.display = "";
    }

    // Clear references
    this.container = null;
    this.displayButton = null;
    this.dropdownPanel = null;

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
