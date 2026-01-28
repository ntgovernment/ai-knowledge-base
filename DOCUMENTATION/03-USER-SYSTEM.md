# 03 - User System & Profile Management

## Overview

The AI Knowledge Base implements a user profile system that persists user information across sessions using localStorage and integrates with the NT Government's SAML authentication system.

---

## Authentication System

### Authentication Method

**Type:** SAML (Security Assertion Markup Language)

**Purpose:** Single sign-on with NT Government directory

**Flow:**

```
1. User logs in to NTG Central
2. SAML assertion created by NT Gov IdP
3. User data extracted and stored
4. Available for use throughout session
```

### Session Management

- **Storage:** localStorage (client-side)
- **Duration:** Persists across browser sessions
- **Scope:** Per-domain (ntgcentral.nt.gov.au)

---

## User Profile Data Structure

### Stored User Information

```javascript
// localStorage keys and values
{
  "user_name": "Sarah Thompson",              // Full name
  "user_email": "sarah.thompson@nt.gov.au",   // Email address
  "user_phone": "+61889991234",               // Contact number
  "user_title": "Senior Policy Advisor",      // Job title
  "user_location": "Darwin Plaza 3rd Floor",  // Office location
  "user_department": "72",                    // Department code
  "user_asset_id": "845621"                   // Unique identifier
}
```

### Department Codes

**Common Department IDs:**

| ID  | Department                                             |
| --- | ------------------------------------------------------ |
| 68  | DCDD - Department of Corporate and Digital Development |
| 70  | Northern Command                                       |
| 72  | People and Wellbeing                                   |
| 74  | Professional Standards Command                         |
| 76  | Governance and Strategy                                |

---

## Profile Data Flow

### Data Retrieval

```
SAML Authentication
        ↓
User Data Extracted
        ↓
Check localStorage Cache
        ↓
    ┌───┴────────┐
    │            │
Found in Cache   Not in Cache
    │            │
    ↓            ↓
Use Cached   Fetch from API
    │            │
    └───┬────────┘
        │
        ▼
Display User Profile
```

### Data Caching

**File:** `ntg-central-update-user-profile.js`

**Function:** Cache user profile in localStorage

```javascript
// On page load
function cacheUserProfile(userData) {
  localStorage.setItem("user_name", userData.name);
  localStorage.setItem("user_email", userData.email);
  localStorage.setItem("user_phone", userData.phone);
  localStorage.setItem("user_title", userData.title);
  localStorage.setItem("user_location", userData.location);
  localStorage.setItem("user_department", userData.department);
  localStorage.setItem("user_asset_id", userData.asset_id);
}

// On page access
function retrieveUserProfile() {
  return {
    name: localStorage.getItem("user_name"),
    email: localStorage.getItem("user_email"),
    phone: localStorage.getItem("user_phone"),
    title: localStorage.getItem("user_title"),
    location: localStorage.getItem("user_location"),
    department: localStorage.getItem("user_department"),
    asset_id: localStorage.getItem("user_asset_id"),
  };
}
```

---

## localStorage API

### Basic Operations

#### Setting Data

```javascript
// Store a single value
localStorage.setItem("user_name", "Sarah Thompson");

// Store complex data (must stringify)
localStorage.setItem(
  "user_data",
  JSON.stringify({
    name: "Sarah Thompson",
    email: "sarah.thompson@nt.gov.au",
  }),
);
```

#### Getting Data

```javascript
// Retrieve a value
const userName = localStorage.getItem("user_name");
// Result: "Sarah Thompson"

// Retrieve complex data
const userData = JSON.parse(localStorage.getItem("user_data"));
// Result: {name: "Sarah Thompson", email: "..."}
```

#### Removing Data

```javascript
// Remove specific item
localStorage.removeItem("user_name");

// Clear all data
localStorage.clear();
```

### Storage Limits

- **Capacity:** ~5-10MB per domain (varies by browser)
- **Data Types:** Strings only (complex objects must be serialized)
- **Scope:** Per-domain, per-browser, not shared across tabs if private browsing

---

## Profile Display Components

### User Profile Menu

**Location:** Header top-right corner

**HTML Structure:**

```html
<div class="ntgc-profile">
  <button class="ntgc-profile__toggle">
    <span class="ntgc-avatar">
      <span class="ntgc-avatar__initial">ST</span>
      <!-- Or loaded image: -->
      <img src="[avatar-url]" alt="Sarah Thompson" />
    </span>
    <span class="ntgc-profile__name">Sarah Thompson</span>
  </button>

  <div class="ntgc-profile__menu" style="display:none;">
    <div class="ntgc-profile__info">
      <p class="ntgc-profile__email">sarah.thompson@nt.gov.au</p>
      <p class="ntgc-profile__phone">+61889991234</p>
      <p class="ntgc-profile__title">Senior Policy Advisor</p>
      <p class="ntgc-profile__location">Darwin Plaza 3rd Floor</p>
    </div>

    <div class="ntgc-profile__links">
      <a href="https://myforms.nt.gov.au/" class="au-btn">myForms</a>
      <a href="[profile-settings]" class="au-btn">Settings</a>
      <a href="[logout]" class="au-btn">Logout</a>
    </div>
  </div>
</div>
```

### Avatar Display

**Two Modes:**

**1. With Image:**

```html
<div class="ntgc-avatar">
  <img
    class="load-avatar"
    data-source="[image-url]"
    data-initial="R"
    alt="User Avatar"
  />
  <span
    class="ntgc-avatar__icon"
    style="background-image: url([image-url])"
  ></span>
</div>
```

**2. With Initials (Fallback):**

```html
<div class="ntgc-avatar">
  <span class="ntgc-avatar__initial">ST</span>
</div>
```

**Loading Logic:**

```javascript
$("img.load-avatar").each(function () {
  var imagesrc = $(this).attr("data-source");
  var initial = $(this).attr("data-initial");

  $(this)
    .attr("src", imagesrc)
    .on("load", function () {
      // Image loaded successfully
      $(this)
        .closest(".ntgc-avatar")
        .find(".ntgc-avatar__icon")
        .css("background-image", "url(" + imagesrc + ")");
      $(this).remove();
    })
    .on("error", function () {
      // Image failed to load, use initials
      $(this)
        .closest(".ntgc-avatar")
        .find(".ntgc-avatar__initial")
        .text(initial.toUpperCase());
      $(this).remove();
    });
});
```

---

## Department Mapping

### Department Directory

The page links to department-specific intranets based on user's department:

**Mapping Example:**

```javascript
var departmentMap = {
  68: {
    name: "DCDD",
    intranet: "https://dcdd-intranet.nt.gov.au",
    resources: ["policies", "procedures", "training"],
  },
  70: {
    name: "Northern Command",
    intranet: "https://ntc-intranet.nt.gov.au",
    resources: ["directives", "guidelines"],
  },
  // ... other departments
};
```

**Usage:**

```javascript
var userDept = localStorage.getItem("user_department");
var deptLink = departmentMap[userDept].intranet;
// Redirect or display link
```

---

## Favorites System

### Favorites Storage

**Purpose:** Users can bookmark and quick-access favorite documents

**Data Structure:**

```javascript
{
  favorites: {
    documents: [
      {
        id: '920303',
        title: 'AI Knowledge Base',
        url: '/dev/aikb/ai-knowledge-base',
        doctype: 'Content Page',
        dateAdded: '2025-12-10'
      }
    ],
    contacts: [
      {
        id: '845621',
        name: 'Sarah Thompson',
        email: 'sarah.thompson@nt.gov.au',
        title: 'Senior Policy Advisor'
      }
    ],
    pages: [
      // Quick access links
    ]
  }
}
```

### Favorites Management UI

```html
<div class="ntgc-favorites">
  <h3>My Favorites</h3>

  <div class="favorites-section">
    <h4>Documents</h4>
    <ul class="ntgc-favorite-list">
      <li>
        <a href="[doc-url]">[Document Title]</a>
        <button class="remove-favorite">✕</button>
      </li>
    </ul>
  </div>

  <div class="favorites-section">
    <h4>Contacts</h4>
    <table class="ntgc-table ntgc-table__contact">
      <!-- Contact list -->
    </table>
  </div>
</div>
```

### Adding to Favorites

```javascript
function addToFavorite(itemId, itemData) {
  // Get current favorites
  var favorites = JSON.parse(localStorage.getItem("favorites") || "{}");

  // Add to appropriate section
  if (!favorites.documents) {
    favorites.documents = [];
  }

  favorites.documents.push({
    id: itemId,
    title: itemData.title,
    url: itemData.url,
    dateAdded: new Date().toISOString(),
  });

  // Save to localStorage
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Update UI
  renderFavorites();
}
```

### Removing from Favorites

```javascript
function removeFromFavorite(itemId) {
  var favorites = JSON.parse(localStorage.getItem("favorites"));

  favorites.documents = favorites.documents.filter((doc) => doc.id !== itemId);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}
```

---

## API Integration - Squiz Matrix API

### What is Squiz Matrix API?

A JavaScript API wrapper for accessing the CMS (Squiz Matrix) backend

**File:** `ntg-central-update-user-profile.js`

### Initialization

```javascript
// Create API instance
var api = new Squiz_Matrix_API({
  key: "YOUR_API_KEY", // Required
});
```

### Getting Metadata

```javascript
api.getMetadata({
  asset_id: 845621, // User asset ID
  dataCallback: function (data) {
    console.log("User metadata:", data);
    // Update profile display
    updateProfileDisplay(data);
  },
  errorCallback: function (error) {
    console.error("API Error:", error);
  },
});
```

### Setting Metadata

```javascript
api.setMetadata({
  asset_id: 845621, // What to update
  field_id: "user_preferences", // Which field
  field_val: "dark_mode", // New value
  dataCallback: function (data) {
    console.log("Metadata updated");
  },
});
```

### Setting Multiple Fields

```javascript
api.setMetadataAllFields({
  asset_id: 845621,
  field_info: {
    user_preferences: "dark_mode",
    last_login: "2025-12-12",
    favorites_count: "5",
  },
  dataCallback: function (data) {
    console.log("All fields updated");
  },
});
```

### Nonce Token Management

**What:** Security token required for API calls

**Automatic Handling:**

```javascript
// API automatically:
// 1. Retrieves token if not cached
// 2. Appends to requests
// 3. Refreshes when expired

// Manual retrieval if needed:
var tokenElem = document.getElementById("token");
if (tokenElem) {
  var nonce = tokenElem.value;
}
```

---

## User Session Lifecycle

### Login Flow

```
1. User navigates to ntgcentral.nt.gov.au
   ↓
2. SAML redirect to NT Gov IdP
   ↓
3. User authenticates with credentials
   ↓
4. SAML assertion returned to portal
   ↓
5. User data extracted from assertion:
   - name, email, phone
   - title, location
   - department, asset ID
   ↓
6. Data stored in localStorage
   ↓
7. User profile menu populated
   ↓
8. Page fully loaded and functional
```

### Session Persistence

```javascript
// On page load
if (localStorage.getItem("user_name")) {
  // User has cached data
  var profile = {
    name: localStorage.getItem("user_name"),
    email: localStorage.getItem("user_email"),
    // ...
  };
  displayProfile(profile);
} else {
  // First time or cache cleared
  // Fetch fresh data from API or SAML
  fetchUserProfile();
}
```

### Logout Flow

```javascript
function logout() {
  // Clear localStorage
  localStorage.clear();

  // Redirect to logout endpoint
  // window.location = "https://ntgcentral.nt.gov.au/logout"; // removed in local dev
}
```

---

## Security Considerations

### localStorage Security

**⚠️ Important:** localStorage is NOT encrypted

**Data Stored:**

- User name, email, phone (non-sensitive)
- Department ID (non-sensitive)
- NO passwords or tokens

**Best Practice:**

```javascript
// ✓ Good - store non-sensitive profile info
localStorage.setItem("user_name", "Sarah Thompson");

// ✗ Bad - never store sensitive data
localStorage.setItem("user_password", "secret123"); // DON'T DO THIS
```

### SAML Security

- **Encrypted:** SAML assertions are cryptographically signed
- **Validation:** Server validates signature on each assertion
- **Expiry:** Assertions expire after short period (typically 5-15 minutes)

### API Security

**Nonce Tokens:**

```javascript
// Every API call must include nonce token
// Prevents CSRF (Cross-Site Request Forgery) attacks

$.ajax({
  url: "/api/endpoint",
  data: {
    action: "update",
    nonce_token: tokenValue, // Required
  },
});
```

**CSP Headers:**

```html
<meta
  http-equiv="Content-Security-Policy"
  content="upgrade-insecure-requests"
/>
```

Forces HTTPS-only requests

---

## Code Examples

### Complete Profile Initialization

```javascript
// On page load, initialize user profile
$(document).ready(function () {
  // Step 1: Check localStorage
  var cachedUser = localStorage.getItem("user_name");

  if (cachedUser) {
    // Step 2: Use cached data
    var profile = {
      name: localStorage.getItem("user_name"),
      email: localStorage.getItem("user_email"),
      phone: localStorage.getItem("user_phone"),
      title: localStorage.getItem("user_title"),
      location: localStorage.getItem("user_location"),
      department: localStorage.getItem("user_department"),
      asset_id: localStorage.getItem("user_asset_id"),
    };

    // Step 3: Display profile
    displayUserProfile(profile);
  } else {
    // Step 4: Fetch from API if not cached
    new Squiz_Matrix_API({ key: apiKey }).getMetadata({
      asset_id: currentUserId,
      dataCallback: function (userData) {
        // Step 5: Cache the data
        Object.keys(userData).forEach((key) => {
          localStorage.setItem("user_" + key, userData[key]);
        });

        // Step 6: Display
        displayUserProfile(userData);
      },
    });
  }
});

function displayUserProfile(profile) {
  // Update avatar
  $(".ntgc-avatar__initial").text(
    profile.name
      .split(" ")
      .map((n) => n[0])
      .join(""),
  );

  // Update profile menu
  $(".ntgc-profile__email").text(profile.email);
  $(".ntgc-profile__phone").text(profile.phone);
  $(".ntgc-profile__title").text(profile.title);
  $(".ntgc-profile__location").text(profile.location);

  // Update department links
  updateDepartmentLinks(profile.department);
}
```

### Toggle Profile Menu

```javascript
// Event handler for profile button click
$(".ntgc-profile__toggle").on("click", function () {
  var menu = $(this).siblings(".ntgc-profile__menu");
  menu.fadeToggle(200);
  $(this).toggleClass("active");
});

// Close menu when clicking outside
$(document).on("click", function (e) {
  if (!$(e.target).closest(".ntgc-profile").length) {
    $(".ntgc-profile__menu").fadeOut(200);
    $(".ntgc-profile__toggle").removeClass("active");
  }
});
```

---

## Next Steps

Read **[04-COMPONENTS.md](04-COMPONENTS.md)** to understand the UI components and interactive elements.
