document.addEventListener("DOMContentLoaded", () => {
  // For each <pre>, check if it is immediately preceded by a heading (h2-h6)
  document.querySelectorAll("pre").forEach((pre) => {
    pre.classList.add("copyable");
    // Find preceding heading sibling
    let heading = pre.previousElementSibling;
    if (heading && /^H[2-6]$/.test(heading.tagName)) {
      // Only wrap if not already wrapped
      if (!heading.parentElement.classList.contains("copy-pre-btn-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "copy-pre-btn-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.width = "100%";
        heading.parentNode.insertBefore(wrapper, heading);
        wrapper.appendChild(heading);
        wrapper.appendChild(pre);
        // Add button
        addCopyButton(wrapper, pre);
      }
    } else if (!pre.parentElement.classList.contains("copy-pre-btn-wrapper")) {
      // No heading, just wrap pre
      const wrapper = document.createElement("div");
      wrapper.className = "copy-pre-btn-wrapper";
      wrapper.style.position = "relative";
      wrapper.style.width = "100%";
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      addCopyButton(wrapper, pre);
    }
  });
});
function addCopyButton(wrapper, pre) {
  // Only add button if not already present
  if (wrapper.querySelector(".copy-pre-btn")) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-pre-btn";
  btn.textContent = "Copy";
  btn.setAttribute("aria-label", "Copy code block to clipboard");
  btn.style.position = "absolute";
  btn.style.top = "8px";
  btn.style.right = "8px";
  wrapper.appendChild(btn);
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    // Only copy the pre's text, not the button
    const text = pre.textContent;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        showCopiedState(btn);
      } catch (err) {
        console.error("Clipboard API failed:", err);
        showError();
      }
      return;
    }
    try {
      fallbackCopy(text);
      showCopiedState(btn);
    } catch (err) {
      console.error("Fallback copy failed:", err);
      showError();
    }
  });
}
// ...existing code...

// Fallback copy using a temporary textarea
function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-1000px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("execCommand copy failed");
}

// Lightweight success toast inside the same <pre>
function showCopiedState(btn) {
  // Reset any existing timer to avoid race conditions
  if (btn._copyResetTimer) {
    clearTimeout(btn._copyResetTimer);
  }
  btn.textContent = "Copied";
  btn.classList.add("is-copied");
  btn.setAttribute("aria-label", "Copied to clipboard");
  btn._copyResetTimer = setTimeout(() => {
    btn.textContent = "Copy";
    btn.classList.remove("is-copied");
    btn.setAttribute("aria-label", "Copy code block to clipboard");
  }, 1600);
}

// Optional: generic error notice
function showError() {
  alert("Failed to copy.");
}
