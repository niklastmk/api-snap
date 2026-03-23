# API Snap — Directory Submission Kit

> Reusable copy and metadata for submitting API Snap to free API directories.
> Adapt per directory as needed. All fields below are ready to copy-paste.

---

## Core Identity

| Field | Value |
|-------|-------|
| **Name** | API Snap |
| **URL** | https://api-snap.com |
| **Docs URL** | https://api-snap.com/docs |
| **Pricing URL** | https://api-snap.com/pricing |
| **Auth** | API key (Bearer token) |
| **HTTPS** | Yes |
| **CORS** | Yes |
| **Free tier** | Yes — 100 calls/month, no credit card |

---

## Taglines (pick the best fit)

**Short (under 60 chars):**
> One API key for QR codes, screenshots, PDFs, and 10+ more tools.

**Medium (under 120 chars):**
> API Snap gives developers 13+ utility endpoints — QR codes, image resize, hashing, screenshots, PDFs — behind a single API key.

**Long (under 160 chars):**
> Stop rebuilding commodity APIs. API Snap bundles 13+ developer utilities (QR codes, image resize, hashing, UUIDs, screenshots, HTML-to-PDF) into one simple REST API.

---

## Description — Short (50-80 words)

API Snap is a developer utility API that bundles 13+ common tools into a single REST API with one API key. Generate QR codes, resize images, capture screenshots, convert HTML to PDF, hash strings, generate UUIDs, extract URL metadata, and more. Free tier includes 100 API calls/month with no credit card required. All endpoints support CORS and return JSON (or binary where appropriate). Built for developers who want to ship faster.

---

## Description — Long (120-160 words)

API Snap is a multi-tool REST API for developers. Instead of cobbling together separate services for QR codes, image processing, screenshots, and other utility functions, API Snap gives you one API key that unlocks 13+ endpoints:

- **QR Code Generation** — PNG/SVG with custom colors and sizes
- **Image Resize & Convert** — PNG, WebP, JPEG, AVIF
- **Screenshot Capture** — full-page screenshots of any URL
- **HTML to PDF** — convert HTML content to downloadable PDFs
- **Hash Generation** — SHA-256, SHA-512, MD5, and more
- **UUID / ID Generation** — UUIDs, nanoids, hex tokens with prefixes
- **URL Metadata Extraction** — Open Graph tags, titles, favicons
- **Base64 Encode/Decode**, **JWT Decode**, **Color Conversion**, **Lorem Ipsum**, **Markdown to HTML**, **Placeholder Images**

Free tier: 100 calls/month, no credit card. Paid plans from $9/mo. Works with any language or framework that can make HTTP requests.

---

## Categories / Tags

Use whichever subset the directory supports:

| Priority | Tags |
|----------|------|
| Primary | `API`, `Developer Tools`, `REST API`, `Utilities` |
| Secondary | `QR Code`, `Image Processing`, `Screenshots`, `PDF Generation`, `Hashing`, `UUID` |
| Tertiary | `Open Data`, `Free API`, `SaaS`, `Developer API`, `Productivity`, `Web Tools` |

---

## Endpoints List (for directories that want specifics)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/qr` | GET | Generate QR codes (PNG/SVG) |
| `/api/resize` | POST | Resize/convert images |
| `/api/screenshot` | GET | Capture webpage screenshots |
| `/api/pdf` | POST | HTML to PDF conversion |
| `/api/hash` | GET | Hash strings (SHA-256, MD5, etc.) |
| `/api/uuid` | GET | Generate UUIDs, nanoids, tokens |
| `/api/meta` | GET | Extract URL metadata / OG tags |
| `/api/base64` | POST | Base64 encode/decode |
| `/api/jwt-decode` | POST | Decode JWT tokens |
| `/api/color` | GET | Color format conversion |
| `/api/lorem` | GET | Lorem ipsum text generation |
| `/api/markdown` | POST | Markdown to HTML |
| `/api/placeholder` | GET | Placeholder image generation |

---

## Pricing Summary (for directories that ask)

| Plan | Price | Calls/month |
|------|-------|-------------|
| Free | $0 | 100 |
| Hobby | $9/mo | 5,000 |
| Pro | $29/mo | 50,000 |
| Business | $99/mo | 500,000 |

---

## Example API Call (for directories that want code)

```bash
curl "https://api-snap.com/api/qr?data=Hello+World&size=400" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## public-apis GitHub PR Format

For the `public-apis/public-apis` repository, the entry should be:

```
| API Snap | Developer utility API — QR codes, screenshots, image resize, hashing, UUIDs, PDFs and more | `apiKey` | Yes | Yes | Unknown |
```

**Category:** `Development`

---

## RapidAPI Listing Fields

| Field | Value |
|-------|-------|
| API Name | API Snap |
| Category | Tools |
| Short Description | 13+ developer utility endpoints — QR codes, screenshots, image resize, hashing, UUIDs, PDFs — one API key |
| Base URL | https://api-snap.com |
| Auth Type | Header (Bearer token) |

---

## Product Hunt Fields

| Field | Value |
|-------|-------|
| Name | API Snap |
| Tagline | One API key for QR codes, screenshots, PDFs, and 10+ developer tools |
| Description | Stop rebuilding commodity APIs. API Snap bundles 13+ developer utility endpoints into one REST API — QR codes, image resize, hashing, screenshots, HTML-to-PDF, UUID generation, and more. Free tier with 100 calls/month, no credit card required. Works with any language. |
| Topics | Developer Tools, APIs, Productivity, SaaS |
| First comment | Hey! I built API Snap because I was tired of re-implementing the same utility functions in every project — QR codes, image thumbnails, hashing, etc. Now it's one API key and one HTTP call. Free tier available, would love your feedback. |

---

## APILayer / Similar Marketplace Fields

| Field | Value |
|-------|-------|
| Name | API Snap |
| Category | Utilities / Developer Tools |
| Description | Multi-tool REST API for developers. 13+ endpoints for QR codes, screenshots, image resize, hashing, UUID generation, HTML-to-PDF, and more. One API key, simple auth, CORS enabled. |
| Free Plan | Yes — 100 calls/month |
| Authentication | API Key (Bearer token in Authorization header) |
| Response Format | JSON (binary for images/PDFs) |
| HTTPS | Yes |
| CORS | Yes |

---

# 🎯 HUMAN-ACTION SUBMISSION KITS

> Ready-to-paste bundles for directories requiring your login.
> Estimated time per submission: 1-3 minutes.

---

## 1. apilist.fun

**Submission URL:** https://apilist.fun/new

| Form Field | What to Enter |
|------------|---------------|
| **API Name** | API Snap |
| **URL** | https://api-snap.com |
| **Description** | Developer utility API — 13+ endpoints for QR codes, screenshots, image resize, hashing, UUIDs, HTML-to-PDF, and more. One API key, free tier with 100 calls/month, no credit card required. CORS enabled, JSON responses. |
| **Github** | *(leave blank — closed source)* |
| **Twitter** | *(leave blank unless you have one)* |
| **Your Email** | *(your email — for approval notification)* |
| **Logo** | Use "auto-generated" option, or upload a logo if you have one |
| **Official API?** | Yes |
| **SSL Support** | Yes |
| **Categories** | `Developer Tools`, `Utilities`, `Images`, `Security` |
| **Authentication Model** | API Key |
| **Supported Request Format** | JSON |
| **Supported Response Format** | JSON |

**Time estimate:** ~1 minute. Fill form, submit, wait for approval email.

---

## 2. RapidAPI

**Step 1:** Go to https://rapidapi.com and sign up / log in

**Step 2:** Go to https://rapidapi.com/studio (or click "Add New API" in the dashboard)

**Step 3:** Create a new API with these details:

| Field | What to Enter |
|-------|---------------|
| **API Name** | API Snap |
| **Short Description** | 13+ developer utility endpoints — QR codes, screenshots, image resize, hashing, UUIDs, PDFs — one API key |
| **Category** | Tools |
| **Base URL** | https://api-snap.com |
| **Auth Type** | Header — `Authorization: Bearer {api_key}` |

**Step 4:** Add endpoints. For each, create an entry in the RapidAPI Studio:

```
GET  /api/qr          → Generate QR codes (PNG/SVG)
POST /api/resize       → Resize/convert images
GET  /api/screenshot   → Capture webpage screenshots
POST /api/pdf          → HTML to PDF conversion
GET  /api/hash         → Hash strings (SHA-256, MD5, etc.)
GET  /api/uuid         → Generate UUIDs, nanoids, tokens
GET  /api/meta         → Extract URL metadata / OG tags
POST /api/base64       → Base64 encode/decode
POST /api/jwt-decode   → Decode JWT tokens
GET  /api/color        → Color format conversion
GET  /api/lorem        → Lorem ipsum text generation
POST /api/markdown     → Markdown to HTML
GET  /api/placeholder  → Placeholder image generation
```

**Step 5:** Set up pricing plans to mirror your tiers (Free / $9 / $29 / $99).

**Step 6:** Click "Make API Public" or equivalent publish button.

**Time estimate:** ~10-15 minutes (most time is adding endpoints). Worth it — RapidAPI has significant developer traffic.

---

## 3. Product Hunt

**Submission URL:** https://www.producthunt.com/posts/new (requires login)

| Field | What to Enter |
|-------|---------------|
| **Name** | API Snap |
| **Tagline** | One API key for QR codes, screenshots, PDFs, and 10+ developer tools |
| **URL** | https://api-snap.com |
| **Description** | Stop rebuilding commodity APIs. API Snap bundles 13+ developer utility endpoints into one REST API — QR codes, image resize, hashing, screenshots, HTML-to-PDF, UUID generation, and more. Free tier with 100 calls/month, no credit card required. Works with any language. |
| **Topics** | Developer Tools, APIs, Productivity, SaaS |
| **Thumbnail** | Upload logo or screenshot of the landing page |
| **Gallery images** | Screenshots of: (1) landing page, (2) docs page, (3) dashboard, (4) example API response |
| **Makers** | Add yourself |

**First comment (post immediately after launch):**

> Hey! I built API Snap because I was tired of re-implementing the same utility functions in every project — QR codes, image thumbnails, hashing, etc. Now it's one API key and one HTTP call. Free tier available, would love your feedback.

**Tips:**
- Launch on a Tuesday, Wednesday, or Thursday for best visibility
- Post at 12:01 AM PT (that's when the daily leaderboard resets)
- Share the PH link on Twitter/social right after posting
- Engage with every comment on launch day

**Time estimate:** ~5 minutes to fill the form + prep for launch day.

---

## 4. APIs.guru — ⚠️ BLOCKED

**Issue:** APIs.guru requires a machine-readable OpenAPI (Swagger) spec hosted at a stable URL. API Snap does not currently have one.

**To unblock:**
1. Generate an OpenAPI 3.0 spec for all 13 endpoints
2. Host it at e.g. `https://api-snap.com/openapi.json`
3. Then submit at https://apis.guru/add-api with:

| Field | Value |
|-------|-------|
| **API Definition URL** | `https://api-snap.com/openapi.json` |
| **Format** | OpenAPI (Swagger) |
| **API Source** | Official (by owner) |
| **API Name** | API Snap |
| **Logo URL** | *(your logo URL if available)* |
| **Category** | Developer Tools |

**Want me to generate the OpenAPI spec?** Say the word and I can create it — that would also improve your /docs page and make future directory submissions easier.

---

# 📊 FINAL SUBMISSION STATUS REPORT

| # | Directory | Method | Status | Action Required |
|---|-----------|--------|--------|-----------------|
| 1 | **public-apis/public-apis** | GitHub PR | ✅ Submitted | Wait for merge |
| 2 | **public-api-lists** | GitHub PR | ✅ Submitted | Wait for merge |
| 3 | **dev-resources** | GitHub PR | ✅ Submitted | Wait for merge |
| 4 | **apilist.fun** | Web form | 📋 Kit ready | ~1 min — fill form at apilist.fun/new |
| 5 | **RapidAPI** | Studio portal | 📋 Kit ready | ~15 min — most impactful listing |
| 6 | **Product Hunt** | Web form | 📋 Kit ready | ~5 min — schedule for a weekday launch |
| 7 | **APIs.guru** | Web form | ⚠️ Blocked | Needs OpenAPI spec first |

### Recommendations (priority order):
1. **RapidAPI** — highest traffic, do this first despite longer setup
2. **apilist.fun** — quick win, takes 1 minute
3. **Product Hunt** — plan a proper launch day for maximum impact
4. **APIs.guru** — tackle after generating an OpenAPI spec (also useful for other things)
