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

  // Handle user data requests (mock endpoints for local development)
  if (req.url.includes("/cdn/userdata/")) {
    console.log(`Mock user data request: ${req.url}`);
    res.writeHead(200, { "Content-Type": "application/json" });

    // Return empty/mock data based on the endpoint
    if (req.url.includes("get-favourites-xhr")) {
      res.end(JSON.stringify({ systems: [], content: [], contacts: [] }));
    } else if (req.url.includes("get-displayname-xhr")) {
      res.end(JSON.stringify({ displayName: "Yes" }));
    } else if (req.url.includes("get-userinfo-xhr")) {
      res.end(
        JSON.stringify({
          UIgivenName: "Test",
          sn: "User",
          telephoneNumber: "",
          mail: "test.user@nt.gov.au",
          title: "",
          location: "",
          departmentNumber: "",
        }),
      );
    } else {
      res.end(JSON.stringify({}));
    }
    return;
  }

  // Silently handle .well-known requests (Chrome DevTools, etc.)
  if (req.url.startsWith("/.well-known/")) {
    res.writeHead(404);
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
          JSON.stringify({ error: "Failed to fetch from Funnelback API" }),
        );
      });

    return;
  }

  // Serve static files and route pages
  let filePath = req.url;

  // Route specific pages
  if (req.url === "/" || req.url === "/landing") {
    filePath = "/AI knowledge base _ NTG Central.html";
  } else if (req.url === "/content") {
    filePath = "/Summarise meeting notes _ NTG Central.html";
  }

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
  console.log(`\nRoute mapping:`);
  console.log(`  /                 → AI knowledge base (landing page)`);
  console.log(`  /landing          → AI knowledge base (landing page)`);
  console.log(`  /content          → Summarise meeting notes (content page)`);
  console.log(`  /api/funnelback   → Funnelback API proxy`);
  console.log(`  /cdn/userdata/*   → Mock user data endpoints (local dev)`);
});
