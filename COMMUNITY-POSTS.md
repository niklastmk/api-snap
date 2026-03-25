# Community Content Drafts — Ready to Paste

---

## 1. Show HN Post

**Post URL:** https://news.ycombinator.com/submit
**Title field (max 80 chars):**

```
Show HN: API Snap – 13+ utility APIs (QR, screenshots, PDFs) behind one key
```

**URL field:**

```
https://api-snap.com
```

**Text field (leave blank):** Leave the text field empty — HN "Show" posts with a URL don't get a text body. Instead, post a top-level comment immediately after submitting (below).

**First comment (post immediately after submitting):**

```
I kept signing up for separate services every time I needed a QR code endpoint, a screenshot API, or PDF generation in a side project. Five providers, five API keys, five billing dashboards — for utilities that each take maybe 20 lines of backend code.

API Snap bundles 13+ of these into one REST API: QR codes, website screenshots, HTML-to-PDF, image resize, color palette extraction, format conversion, hashing, UUIDs, lorem ipsum, markdown rendering, URL shortening, and metadata extraction.

One base URL, one API key, consistent JSON responses across all endpoints.

Technical details:
- Next.js on Railway, Turso (libSQL) for storage, Stripe for billing
- Full OpenAPI 3.0 spec at /openapi.json — import into Postman, generate clients, etc.
- Interactive "try it" pages for every endpoint at /try (no signup needed to browse)
- Free tier: 100 calls/month, no credit card

I'd love feedback on the API design and endpoint selection. What utility endpoints do you wish existed as a simple API call?

Docs: https://api-snap.com/docs
Try it live: https://api-snap.com/try
OpenAPI spec: https://api-snap.com/openapi.json
```

**HN tips:**
- Post between 8-10 AM ET on a weekday (Tuesday-Thursday best)
- Don't ask for upvotes — against HN rules
- Respond to every comment within the first 2 hours
- If someone asks "why not just self-host?" — acknowledge it's valid for teams with infra, position API Snap as the path-of-least-resistance for MVPs and side projects
- If someone criticizes pricing — engage constructively, ask what they'd pay

---

## 2. DEV.to Article

**Post URL:** https://dev.to/new
**Title:**

```
Stop Juggling 5 API Keys for Basic Utilities — Here's a Single Endpoint for 13+ Developer Tools
```

**Tags:** `api`, `webdev`, `productivity`, `tutorial`

**Cover image suggestion:** Screenshot of the /try page or the /docs page

**Body (Markdown):**

```markdown
Every side project I build eventually needs the same handful of utility APIs: generate a QR code, take a website screenshot, convert HTML to PDF, resize an image. And every time, I end up signing up for yet another provider with yet another API key.

After the fifth project where I went through this exact same dance, I built [API Snap](https://api-snap.com) — one REST API that bundles 13+ common developer utilities behind a single key.

## What's in the box

| Endpoint | What it does |
|----------|-------------|
| `/api/qrcode` | Generate QR codes from text or URLs |
| `/api/screenshot` | Capture full-page website screenshots |
| `/api/pdf` | Convert HTML to downloadable PDFs |
| `/api/resize` | Resize images on the fly |
| `/api/colors` | Extract dominant colors from an image |
| `/api/convert` | Convert between PNG, JPEG, WebP |
| `/api/hash` | Cryptographic hashing (MD5, SHA-256) |
| `/api/uuid` | Generate v4 UUIDs |
| `/api/lorem` | Placeholder text generation |
| `/api/markdown` | Render markdown to HTML |
| `/api/shorten` | Shorten URLs |
| `/api/metadata` | Extract Open Graph / meta tags from URLs |

Every endpoint follows the same pattern: `GET` or `POST` to `https://api-snap.com/api/{tool}` with your API key, get back JSON (or a binary file for images/PDFs).

## Quick start: Generate a QR code in 30 seconds

**1. Get your free API key**

Sign up at [api-snap.com](https://api-snap.com) — no credit card, takes 10 seconds.

**2. Make a request**

```bash
curl "https://api-snap.com/api/qrcode?data=https://dev.to&format=png&api_key=YOUR_KEY" \
  --output qr.png
```

That's it. You get back a PNG. No SDK to install, no OAuth flow, no webhook to configure.

**3. Try another endpoint**

```bash
# Take a screenshot of any website
curl "https://api-snap.com/api/screenshot?url=https://dev.to&api_key=YOUR_KEY" \
  --output screenshot.png

# Generate a hash
curl -s "https://api-snap.com/api/hash?text=hello+world&api_key=YOUR_KEY"
# → {"md5":"5eb63bbbe01eeed093cb22bb8f5acdc3","sha256":"b94d27b9..."}

# Get placeholder text
curl -s "https://api-snap.com/api/lorem?paragraphs=2&api_key=YOUR_KEY"
```

## Using it in a real project (Node.js example)

Here's how you'd add QR code generation to an Express app:

```javascript
const express = require('express');
const app = express();

const API_SNAP_KEY = process.env.API_SNAP_KEY;
const API_BASE = 'https://api-snap.com/api';

app.get('/invoice/:id/qr', async (req, res) => {
  const invoiceUrl = `https://myapp.com/invoices/${req.params.id}`;
  const qrResponse = await fetch(
    `${API_BASE}/qrcode?data=${encodeURIComponent(invoiceUrl)}&format=png&api_key=${API_SNAP_KEY}`
  );
  const qrBuffer = await qrResponse.arrayBuffer();
  res.set('Content-Type', 'image/png');
  res.send(Buffer.from(qrBuffer));
});
```

Need to add a screenshot feature later? Same base URL, same key:

```javascript
app.get('/preview/:url', async (req, res) => {
  const response = await fetch(
    `${API_BASE}/screenshot?url=${encodeURIComponent(req.params.url)}&api_key=${API_SNAP_KEY}`
  );
  const buffer = await response.arrayBuffer();
  res.set('Content-Type', 'image/png');
  res.send(Buffer.from(buffer));
});
```

## The OpenAPI spec

The full spec is at [api-snap.com/openapi.json](https://api-snap.com/openapi.json). You can:

- Import it into **Postman** to get a ready-to-use collection
- Feed it to **openapi-generator** to create a typed client in any language
- Load it into **Swagger UI** for interactive documentation

## Pricing

| Plan | Price | Calls/month |
|------|-------|-------------|
| Free | $0 | 100 |
| Hobby | $9/mo | 1,000 |
| Pro | $29/mo | 10,000 |
| Business | $99/mo | 100,000 |

The free tier is real — no credit card, no trial expiration. Enough to prototype and test.

## Try it without signing up

Every endpoint has an interactive [try-it page](https://api-snap.com/try) where you can test directly in the browser. The [docs](https://api-snap.com/docs) have full parameter references.

I'd love to hear what utility endpoints you'd want added next. What API call do you find yourself reaching for in every project?

---

*API Snap is a solo project I built to scratch my own itch. Feedback welcome — tear it apart.*
```

**DEV.to tips:**
- Publish in the morning (US time) on Tuesday-Thursday
- The `#tutorial` and `#webdev` tags have the highest readership
- Respond to every comment
- Cross-post to your own blog (if you set one up) with a canonical URL pointing to DEV.to

---

## 3. Indie Hackers Showcase Post

**Post URL:** https://www.indiehackers.com/new-post (select "Share a product or project")
**Title:**

```
I built a "Swiss Army knife" API for developers — 13+ utility endpoints, one key, $0 to start
```

**Body:**

```markdown
## What I built

[API Snap](https://api-snap.com) — a REST API that bundles 13+ common developer utilities (QR codes, screenshots, PDFs, image resize, hashing, and more) behind a single API key.

## The problem

Every side project needs the same boring utility APIs. QR codes for one feature, screenshots for another, PDF export for a third. Each one means a new provider, a new signup, a new API key, a new billing account. For indie makers building MVPs, this friction adds up fast.

## The solution

One API key, one base URL, one bill. Sign up once, get access to all 13+ endpoints:

- QR code generation
- Website screenshots
- HTML-to-PDF conversion
- Image resizing & format conversion
- Color palette extraction
- Cryptographic hashing
- UUID generation
- Lorem ipsum / placeholder text
- Markdown to HTML rendering
- URL shortening
- URL metadata extraction
- ...and more being added

## How I built it

**Stack:** Next.js (App Router), TypeScript, Turso (SQLite at the edge), Stripe for billing, Railway for hosting.

**Timeline:** Solo build. The core API took about a week. The landing pages, docs, try-it-live pages, SEO blog posts, and billing integration took another two weeks.

**Cost to run:** ~$5/month on Railway + Turso free tier. Stripe only charges on transactions.

## Revenue model

Freemium with tiered pricing:

| Plan | Price | Calls/month |
|------|-------|-------------|
| Free | $0 | 100 |
| Hobby | $9/mo | 1,000 |
| Pro | $29/mo | 10,000 |
| Business | $99/mo | 100,000 |

**Revenue to date:** $0. I'm in the "get it in front of developers" phase right now.

## Distribution strategy

I'm doing a directory blitz — submitted to SaaSHub, AlternativeTo, DevHunt, BetaList, APIs.io, SwaggerHub, and about 15 other directories. Next up is RapidAPI Hub and Postman API Network, plus a Show HN.

The theory: developer utility APIs are searched for, not scrolled past. If someone Googles "QR code API" or "screenshot API free," I want API Snap to show up. Every directory listing is a backlink + a potential discovery surface.

## What I'd do differently

1. **I should have launched distribution earlier.** I spent too long polishing the product before getting it listed anywhere. Directory submissions take days/weeks to go live — start them on day one.
2. **Interactive demos are worth the effort.** The [try-it pages](https://api-snap.com/try) let people test every endpoint without signing up. They're the best "landing page" I have.

## Ask

- What utility APIs would you add to a bundle like this?
- Any distribution channels I'm missing?
- If you build side projects: would this pricing make sense for you, or would you want a different structure?

Check it out: [api-snap.com](https://api-snap.com)
```

**Indie Hackers tips:**
- Post on Tuesday-Thursday morning (US time)
- The "build story" angle performs better than pure promotion
- Respond to every comment with substance
- Follow up with a milestone update post if/when you get first customers
- Engage with other IH posts in the days before/after yours — community reciprocity matters

---

## Posting Schedule (Recommended)

Stagger the posts to avoid audience overlap fatigue and to maximize each platform's algorithm:

| Day | Platform | Why |
|-----|----------|-----|
| **Tuesday AM** | **Show HN** | HN peaks Tuesday-Thursday; morning posts get more traction |
| **Wednesday AM** | **DEV.to** | Gives the HN post 24h to run; DEV.to audience is different |
| **Thursday AM** | **Indie Hackers** | Wraps the week; IH crowd is most active mid-week |

All times: 8-10 AM Eastern Time.

---

## Quick Reference Links (for including in posts)

- Homepage: https://api-snap.com
- Docs: https://api-snap.com/docs
- Try it live: https://api-snap.com/try
- Pricing: https://api-snap.com/pricing
- OpenAPI spec: https://api-snap.com/openapi.json
