# 06 - API Reference & External Integrations

## API Overview

The AI Knowledge Base integrates with several external and internal APIs to provide search, user management, and analytics functionality.

---

## Funnelback Search REST API

> Current runtime: `ntgov-funnelback-search.js` calls the Funnelback endpoint directly (or via the optional `/api/funnelback` proxy for local dev) using the parameters below and renders the raw JSON into the results container.

### Base URL

```
https://ntgov-search.funnelback.squiz.cloud/s/search.json
```

### Primary Search Endpoint

**URL:** `https://ntgov-search.funnelback.squiz.cloud/s/search.json`

**Method:** `GET`

**Purpose:** Execute search query and return results

**Required Query Parameters:**

```javascript
{
  collection: "ntgov~sp-ntgc-ai-knowledge-base",  // Search collection
  profile: "ai-knowledge-base-search-results_live", // Search profile
  log: "false",                                    // Logging flag
  s: "!FunDoesNotExist:PadreNull",                // Sort/filter parameter
  start_rank: number,                              // Starting result rank (1-indexed)
  query: string,                                   // Search term (noise words removed)
  num_ranks: number,                               // Results per page (default: 10)
}
```

**JavaScript Call:**

```javascript
var fbUrl =
  "https://ntgov-search.funnelback.squiz.cloud/s/search.json" +
  "?collection=ntgov~sp-ntgc-ai-knowledge-base" +
  "&profile=ai-knowledge-base-search-results_live" +
  "&log=false" +
  "&s=!FunDoesNotExist:PadreNull" +
  "&start_rank=1" +
  "&query=" +
  encodeURIComponent(filteredQuery) +
  "&num_ranks=10";

$.ajax({
  url: fbUrl,
  dataType: "JSON",
  type: "GET",
  complete: function (result) {
    var dataset = result.responseJSON;
    // Process results
  },
});
```

**Response Format:**

```json
{
  "response": {
    "resultPacket": {
      "results": [
        {
          "title": "AI Implementation Guide",
          "summary": "Comprehensive guide for implementing AI...",
          "clickTrackingUrl": "https://...",
          "liveUrl": "https://...",
          "displayUrl": "https://...",
          "fileSize": 2621440,
          "date": "2025-12-11",
      "icon": "fas fa-file-pdf"
    }
  ],
  "metadata": {
    "total": 47,
    "page": 1,
    "pageSize": 12,
    "totalPages": 4
  },
  "correctedQuery": "AI implementation" // If spell-check applied
}
```

**Response Fields:**

| Field                   | Type     | Description                      |
| ----------------------- | -------- | -------------------------------- |
| `results[].id`          | string   | Unique document identifier       |
| `results[].title`       | string   | Document title                   |
| `results[].description` | string   | Document summary/excerpt         |
| `results[].doctype`     | string   | Document category                |
| `results[].owner`       | string   | Department ID                    |
| `results[].modified`    | ISO 8601 | Last modification date           |
| `results[].size`        | integer  | File size in bytes               |
| `results[].downloadUrl` | string   | Direct download link             |
| `results[].viewUrl`     | string   | View online link                 |
| `results[].icon`        | string   | Font Awesome icon class          |
| `metadata.total`        | integer  | Total results found              |
| `metadata.page`         | integer  | Current page number              |
| `metadata.pageSize`     | integer  | Results per page                 |
| `metadata.totalPages`   | integer  | Total number of pages            |
| `correctedQuery`        | string   | Spell-corrected query if applied |

### Error Responses

**HTTP 400 - Bad Request:**

```json
{
  "error": "Invalid search parameters",
  "message": "searchterm is required"
}
```

**HTTP 500 - Server Error:**

```json
{
  "error": "Search service unavailable",
  "message": "Please try again later"
}
```

### Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 99`
  - `X-RateLimit-Reset: [unix-timestamp]`

---

## Squiz Matrix JS API

### Purpose

Manage user profile metadata and CMS interactions

### Initialization

```javascript
var api = new Squiz_Matrix_API({
  key: "YOUR_API_KEY", // Required authentication
});
```

### Methods

#### getMetadata()

**Purpose:** Retrieve metadata for an asset

```javascript
api
  .getMetadata({
    asset_id: 770097, // Required: User or asset ID
    dataCallback: function (data) {
      console.log("Metadata:", data);
    },
    errorCallback: function (error) {
      console.error("Error:", error);
    },
  })
  .then(function (data) {
    // Promise-based alternative
    console.log("Got metadata:", data);
  })
  .catch(function (error) {
    console.error("Failed:", error);
  });
```

**Response:**

```json
{
  "asset_id": 770097,
  "asset_name": "Roy Galet",
  "fields": {
    "user_email": "roy.galet@nt.gov.au",
    "user_phone": "+61889996162",
    "user_title": "Manager Frontend Design",
    "user_preferences": "dark_mode"
  }
}
```

#### setMetadata()

**Purpose:** Update single metadata field

```javascript
api.setMetadata({
  asset_id: 770097, // Required: Asset to update
  field_id: "user_preferences", // Required: Field name
  field_val: "dark_mode", // Required: New value
  dataCallback: function (data) {
    console.log("Updated:", data);
  },
});
```

**Response:**

```json
{
  "success": true,
  "message": "Metadata updated successfully"
}
```

#### setMetadataAllFields()

**Purpose:** Update multiple metadata fields at once

```javascript
api.setMetadataAllFields({
  asset_id: 770097,
  field_info: {
    user_preferences: "dark_mode",
    last_login: "2025-12-12",
    favorites_count: "5",
    theme: "navy",
  },
  dataCallback: function (data) {
    console.log("All fields updated");
  },
});
```

### Authentication

**Nonce Token:**

```javascript
// Required for all API calls
// Automatically managed by SDK

var tokenElem = document.getElementById("token");
if (tokenElem) {
  var nonce = tokenElem.value;
}
```

**Manual Header:**

```javascript
http.setRequestHeader("X-SquizMatrix-JSAPI-Key", apiKey);
```

### Error Handling

```javascript
api.getMetadata({
  asset_id: 770097,
  errorCallback: function (error) {
    if (error.status === 404) {
      console.log("Asset not found");
    } else if (error.status === 403) {
      console.log("Access denied");
    } else if (error.status === 500) {
      console.log("Server error");
    }
  },
});
```

---

## Google Analytics 4

### Tracking ID

```
G-09TV1G846C
```

### Implementation

**Tracking Code:**

```html
<!-- Global site tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-09TV1G846C"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-09TV1G846C");
</script>
```

### Custom Events

**Track Search:**

```javascript
gtag("event", "search", {
  search_term: ntgFunnelback.originalterm,
  filters_applied: false, // filters not currently applied
  results_count: results.length,
});
```

**Track Filter:**

```javascript
gtag("event", "filter_applied", {
  filter_type: "doctype",
  filter_value: "Policy",
  timestamp: new Date().toISOString(),
});
```

**Track Result Click:**

```javascript
gtag("event", "view_item", {
  item_id: result.id,
  item_name: result.title,
  item_category: result.doctype,
});
```

### Events Tracked

| Event            | Data                                        |
| ---------------- | ------------------------------------------- |
| `page_view`      | Automatic (page load)                       |
| `search`         | search_term, filters_applied, results_count |
| `filter_applied` | filter_type, filter_value                   |
| `view_item`      | item_id, item_name, item_category           |
| `view_promotion` | promotion_id, promotion_name                |

---

## External Dependency CDNs

### Font Services

**Google Fonts (Roboto):**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700"
  rel="stylesheet"
/>
```

**Adobe Typekit (neue-haas-grotesk):**

```html
<script src="https://use.typekit.net/[kit-id].js"></script>
<script>
  try {
    Typekit.load();
  } catch (e) {}
</script>
```

### Icon Library

**Font Awesome Pro 5.15.4:**

```html
<link
  rel="stylesheet"
  href="./AI knowledge base _ NTG Central_files/all.css"
  integrity="sha384-rqn26AG5Pj86AF4SO72RK5fyefcQ/x32DNQfChxWvbXIyXFePlEktwD18fEz+kQU"
  crossorigin="anonymous"
/>
```

---

## Internal Endpoints

### NT Government Directory

**URL:** `https://phones.nt.gov.au/`

**Purpose:** Employee phone/email lookup

**Usage:**

```javascript
// User can access directory from profile menu
var directoryUrl =
  "https://phones.nt.gov.au/?search=" + encodeURIComponent(userName);
window.open(directoryUrl);
```

### myForms Portal

**URL:** `https://myforms.nt.gov.au/`

**Purpose:** Form submission portal

**Link in Header:**

```html
<a href="https://myforms.nt.gov.au/" class="au-btn">
  <i class="fal fa-form"></i> myForms
</a>
```

### NTG Services

**URL:** `https://ntgservices.nt.gov.au/sp`

**Purpose:** Shared services portal

### Department Intranets

**DCDD Intranet:**

```
https://dcdd-intranet.nt.gov.au
```

**Other Departments:**

- CMC: `https://cmc-intranet.nt.gov.au`
- DAF: `https://daf-intranet.nt.gov.au`
- DET: `https://det-intranet.nt.gov.au`
- DTF: `https://dtf-intranet.nt.gov.au`
- And more...

---

## SAML Authentication

### Endpoint

**IdP URL:** `https://[nt-gov-idp]/saml`

### Assertion Attributes

```xml
<saml:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
  <saml:AttributeValue>roy.galet@nt.gov.au</saml:AttributeValue>
</saml:Attribute>

<saml:Attribute Name="cn" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
  <saml:AttributeValue>Roy Galet</saml:AttributeValue>
</saml:Attribute>

<saml:Attribute Name="department">
  <saml:AttributeValue>68</saml:AttributeValue>
</saml:Attribute>
```

### Integration

**Handled by:** Server-side SAML middleware

**User Data Extraction:**

```javascript
// SAML attributes mapped to user object
var user = {
  name: samlAssertion.cn,
  email: samlAssertion.email,
  department: samlAssertion.department,
  // ... other mapped fields
};

// Stored in localStorage
Object.keys(user).forEach((key) => {
  localStorage.setItem("user_" + key, user[key]);
});
```

---

## API Error Handling

### Standard Error Response

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid search parameters",
  "timestamp": "2025-12-12T10:30:00Z"
}
```

### Retry Logic

```javascript
function retryAPI(url, options, maxRetries = 3) {
  var attemptCount = 0;

  function tryRequest() {
    return $.ajax({
      url: url,
      ...options,
      error: function (xhr, status, error) {
        if (attemptCount < maxRetries && xhr.status >= 500) {
          attemptCount++;
          // Exponential backoff
          setTimeout(tryRequest, Math.pow(2, attemptCount) * 1000);
        } else {
          options.error(xhr, status, error);
        }
      },
    });
  }

  return tryRequest();
}
```

---

## CORS (Cross-Origin Resource Sharing)

### Headers

```
Access-Control-Allow-Origin: https://ntgcentral.nt.gov.au
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### Handling CORS Errors

```javascript
$.ajax({
  url: corsUrl,
  xhrFields: {
    withCredentials: true,
  },
  error: function (xhr, status, error) {
    if (status === "error" && xhr.status === 0) {
      console.log("CORS Error: Cross-origin request blocked");
    }
  },
});
```

---

## Rate Limiting & Throttling

### Search Request Throttle

```javascript
var searchTimeout;
$("#search").on("keyup", function () {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(function () {
    // Execute search only after user stops typing
    ntgCOVEO.callSearchAPI();
  }, 300); // 300ms delay
});
```

### API Rate Limit Handling

```javascript
if (xhr.status === 429) {
  // Too Many Requests
  var retryAfter = xhr.getResponseHeader("Retry-After");
  console.log("Rate limited. Retry after " + retryAfter + " seconds");

  setTimeout(retryAPI, parseInt(retryAfter) * 1000);
}
```

---

## Best Practices

### API Integration

1. **Always include error handling**

   ```javascript
   $.ajax({
     // ... ajax options
     error: function (xhr, status, error) {
       console.error("API Error:", error);
       displayErrorMessage("Search failed. Please try again.");
     },
   });
   ```

2. **Validate response before using**

   ```javascript
   if (
     result &&
     result.responseJSON &&
     Array.isArray(result.responseJSON.results)
   ) {
     // Safe to use results
   } else {
     // Handle invalid response
   }
   ```

3. **Cache API responses**

   ```javascript
   var cache = {};
   function searchWithCache(query) {
     if (cache[query]) {
       return cache[query];
     }
     // ... fetch from API
     cache[query] = results;
     return results;
   }
   ```

4. **Implement request timeouts**
   ```javascript
   $.ajax({
     url: endpoint,
     timeout: 5000, // 5 seconds
     error: function (xhr, status, error) {
       if (status === "timeout") {
         displayErrorMessage("Request timed out. Please try again.");
       }
     },
   });
   ```

---

## Next Steps

Read **[07-ACCESSIBILITY.md](07-ACCESSIBILITY.md)** to understand accessibility compliance and standards.
