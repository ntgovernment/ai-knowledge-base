// Content page specific scripts
import "./copy-to-clipboard.js";
import { wrapPreBlocks } from "./wrap-pre-blocks.js";

// Wrap <h2>-<h6> + <pre> blocks for unified styling
document.addEventListener("DOMContentLoaded", () => {
  wrapPreBlocks();
});
