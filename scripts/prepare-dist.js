const fs = require("fs");
const path = require("path");

// Create dist directory
const distDir = path.join(__dirname, "../dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log("[build] Created dist directory");
}

// Copy search.json to dist/
const srcPath = path.join(__dirname, "../src/data/search.json");
const destPath = path.join(distDir, "search.json");

try {
  fs.copyFileSync(srcPath, destPath);
  console.log("[build] Copied search.json to dist/");
} catch (error) {
  console.error("[build] Error copying search.json:", error.message);
  process.exit(1);
}
