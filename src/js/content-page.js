// Content page specific scripts
import "./copy-to-clipboard.js";
import { wrapPreBlocks } from "./wrap-pre-blocks.js";

// Set mailto link on "Submit your own use case" sidebar button
function setSidebarSubmitLink() {
  const sidebarButtons = document.querySelectorAll('.aikb-sidebar__row a');
  sidebarButtons.forEach((button) => {
    if (button.textContent.trim() === "Submit your own use case") {
      button.href = "mailto:ai.advice@nt.gov.au";
    }
  });
}

// Wrap <h2>-<h6> + <pre> blocks for unified styling
document.addEventListener("DOMContentLoaded", () => {
  wrapPreBlocks();
  setSidebarSubmitLink();
});
