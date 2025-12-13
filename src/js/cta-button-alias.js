// Alias CTA anchors to reuse NTGC primary button styling
const CTA_SELECTOR = 'div[data-hydration-component="squiz-call-to-action"] a';

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
