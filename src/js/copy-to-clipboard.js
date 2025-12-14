document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre").forEach((pre) => {
    pre.classList.add("copyable");
  });

  // Attach copy buttons to targeted <pre> elements
  const pres = document.querySelectorAll("pre.copyable");
  pres.forEach((pre) => {
    // Create the button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-pre-btn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code block to clipboard");

    // Insert inside the <pre> (top-right via CSS)
    pre.insertAdjacentElement("afterbegin", btn);

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const text = pre.textContent;

      // Prefer Clipboard API in secure contexts
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          showCopied(pre);
        } catch (err) {
          console.error("Clipboard API failed:", err);
          showError();
        }
        return;
      }

      // Fallback for non-secure contexts / older browsers
      try {
        fallbackCopy(text);
        showCopied(pre);
      } catch (err) {
        console.error("Fallback copy failed:", err);
        showError();
      }
    });
  });
});

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
function showCopied(pre) {
  const toast = document.createElement("span");
  toast.className = "copy-toast";
  toast.textContent = "Copied!";
  pre.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

// Optional: generic error notice
function showError() {
  alert("Failed to copy.");
}
