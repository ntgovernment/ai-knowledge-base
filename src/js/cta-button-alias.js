// Alias CTA anchors to reuse NTGC primary button styling
const CTA_SELECTOR = 'div[data-hydration-component="squiz-call-to-action"] a';
const CTA_CONTAINER_SELECTOR =
  'div[data-hydration-component="squiz-call-to-action"]';

function applyCtaButtonAlias(root = document) {
  const anchors = root.querySelectorAll(CTA_SELECTOR);
  anchors.forEach((anchor) => {
    anchor.classList.add("ntgc-btn", "ntgc-btn--primary");
  });
}

function applyCtaLayoutClasses(root = document) {
  const ctaContainers = root.querySelectorAll(CTA_CONTAINER_SELECTOR);
  ctaContainers.forEach((container) => {
    // Find anchor with "Submit your own use case" text (regardless of href)
    const submitAnchor = container.querySelector("a");
    if (
      submitAnchor &&
      submitAnchor.textContent.trim() === "Submit your own use case"
    ) {
      container.classList.add("aikb-cta-submit");
    }
  });
}

function wrapWelcomeText(root = document) {
  // Find the h2 with specific text
  const h2Elements = root.querySelectorAll("h2");
  let targetH2 = null;

  h2Elements.forEach((h2) => {
    if (h2.textContent.trim() === "Welcome to NTG's AI knowledge base") {
      targetH2 = h2;
    }
  });

  if (!targetH2) return;

  // Get the next sibling paragraph
  const nextP = targetH2.nextElementSibling;
  if (!nextP || nextP.tagName !== "P") return;

  // Check if already wrapped
  if (targetH2.parentElement.classList.contains("aikb-welcome-wrapper")) {
    return;
  }

  // Create wrapper div
  const wrapper = document.createElement("div");
  wrapper.classList.add("aikb-welcome-wrapper");

  // Insert wrapper before h2
  targetH2.parentNode.insertBefore(wrapper, targetH2);

  // Move h2 and p into wrapper
  wrapper.appendChild(targetH2);
  wrapper.appendChild(nextP);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    applyCtaButtonAlias();
    applyCtaLayoutClasses();
    wrapWelcomeText();
  });
} else {
  applyCtaButtonAlias();
  applyCtaLayoutClasses();
  wrapWelcomeText();
}
