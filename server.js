const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 8000;

// Create server
const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle Funnelback proxy requests
  if (req.url.startsWith("/api/funnelback")) {
    const queryParams = req.url.substring("/api/funnelback?".length);
    const funnelbackUrl = `https://ntgov-search.funnelback.squiz.cloud/s/search.json?${queryParams}`;

    console.log(`Proxying request to: ${funnelbackUrl}`);

    https
      .get(funnelbackUrl, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", () => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        });
      })
      .on("error", (err) => {
        console.error("Error calling Funnelback API:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Failed to fetch from Funnelback API" })
        );
      });

    return;
  }

  // Serve static files
  let filePath =
    req.url === "/" ? "/AI knowledge base _ NTG Central.html" : req.url;

  // Decode URL for spaces and special characters
  filePath = decodeURIComponent(filePath);

  // Prevent directory traversal attacks
  const fullPath = path.join(__dirname, filePath);
  const normalizedPath = path.normalize(fullPath);

  if (!normalizedPath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      console.log(`File not found: ${fullPath}`);
      res.writeHead(404);
      res.end("File not found");
      return;
    }

    // Set appropriate content type
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".eot": "application/vnd.ms-fontobject",
      ".ttf": "font/ttf",
      ".otf": "font/otf",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Serving files from: ${__dirname}`);
  console.log(
    `Funnelback API proxy available at: http://localhost:${PORT}/api/funnelback?...`
  );
});
