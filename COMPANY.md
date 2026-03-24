# APISnap — Operations Handbook

## Product
Developer utility API platform. 13+ endpoints (QR codes, screenshots, PDFs, image resize, hashing, etc.) behind a single API key with tiered pricing.

## Revenue Model
- Free: 100 calls/month
- Hobby: $9/mo — 1,000 calls
- Pro: $29/mo — 10,000 calls
- Business: $99/mo — 100,000 calls
- QR Pro: $7/mo — unlimited QR codes, full analytics, no branding (env: STRIPE_PRICE_QR_PRO)
- Revenue to date: $0

## Infrastructure

### Hosting: Railway
- Project: `striking-enjoyment`
- Service: `snapapi`
- Environment: `production`
- URL: https://api-snap.com
- CLI login: already authenticated (run `railway` commands from this directory)
- Deploy: `railway up` from this directory

### Database: Turso
- DB name: `snapapi`
- URL: `libsql://snapapi-niklastmk.aws-us-west-2.turso.io`

### Payments: Stripe (LIVE mode)
- Dashboard: dashboard.stripe.com
- Webhook endpoint: https://api-snap.com/api/webhooks/stripe
- Price IDs:
  - Hobby: `price_1TE9vQFAtUvZANbzzoWEI87L`
  - Pro: `price_1TE9vcFAtUvZANbzEnpD1q4G`
  - Business: `price_1TE9vqFAtUvZANbzRvveyRBq`
  - QR Pro: `price_1TETKiFAtUvZANbzpImtM48J`
- Checkout session creation: VERIFIED (2026-03-24) — POST /api/snapqr/checkout returns live Stripe checkout URL

### Domain
- Domain: api-snap.com (LIVE — connected via Railway, SSL provisioning)

## Codebase
- Framework: Next.js (App Router)
- Location: /Users/niklas/projects/mn370km2eba4
- All env vars are in `.env` in this directory
- All credentials are also set as Railway env vars

## What's Done
- Full app with all API endpoints working
- Stripe billing (checkout, webhooks, subscriptions) — verified end-to-end
- Auth (signup, login, API key management) — verified working
- Dashboard with usage tracking
- 5 SEO blog posts (deployed at /blog)
- Interactive try pages (deployed at /try)
- Landing pages per endpoint (all 13 tools)
- Deployed and running on Railway (last deploy: 2026-03-24)
- SnapQR Smart Links — full analytics dashboard with tier gating:
  - `/api/snapqr/generate` — creates trackable QR with short link (3 lifetime free per IP, unlimited paid)
  - `/r/[code]` — 302 redirect with async scan logging (IP, UA, device, browser, OS, country, referer)
  - `/s/[code]` — rich analytics page: scan timeline chart, top countries, device/browser breakdown, recent scans table
  - `/api/snapqr/export/[code]` — CSV export of scan data (paid only)
  - `/snapqr/upgrade` — QR Pro checkout page ($7/mo via Stripe)
  - Free tier: 7-day scan history, branded stats page, no CSV export
  - QR Pro ($7/mo): 30-day scan history, no branding, CSV export, unlimited QR codes
- OpenAPI spec live at /openapi.json
- Submitted to public-apis/public-apis (PR #5578 open)
- Submitted to APIs-guru/openapi-directory (PR #2112 open)
- Submitted to Apilist.fun (201 accepted, under review)
- Submitted to awesome-qr-code list (PR #13 open: https://github.com/make-github-pseudonymous-again/awesome-qr-code/pull/13)

## Distribution — SnapQR
- **Product Hunt**: NOT LIVE — requires human submission (no API for creating posts). Steps:
  1. Log in at https://www.producthunt.com (account must be 7+ days old; subscribe to PH Daily Digest to skip wait)
  2. Click "Submit" (top-right) → "New Product"
  3. Enter URL: `https://api-snap.com/snapqr`
  4. Name: `SnapQR`
  5. Tagline: `Free QR codes with real-time scan analytics` (60 char max)
  6. Description: `Create a QR code, share it anywhere, and watch scans roll in — real-time analytics show who scanned, where, and on what device. Free tier gives you 3 QR codes with 7-day analytics. QR Pro ($7/mo) unlocks unlimited codes, 30-day history, CSV export, and unbranded stats pages. No signup required to start — just paste a URL and get a trackable QR code in seconds.`
  7. Upload 3+ screenshots (SnapQR generator page, stats dashboard, scan timeline)
  8. Topics: `Developer Tools`, `Analytics`, `QR Codes`
  9. Post a first comment as maker: `Hey PH! I built SnapQR because every free QR generator is a dead end — you never know if anyone scanned it. SnapQR gives you a real-time analytics dashboard for every QR code, completely free. Would love your feedback!`
  10. Schedule launch for 12:01 AM PST on a weekday (Tue-Thu recommended)
  - **Shareholder action**: Log in to producthunt.com with the niklastmk account, complete steps 2-10 above (~3 min)
- **BetaList**: NOT LIVE — requires human submission. Steps:
  1. Go to https://betalist.com/submit (create account if needed, use APISnap identity)
  2. Product URL: `https://api-snap.com/snapqr`
  3. Name: `SnapQR`
  4. Tagline: `Free QR codes with real-time scan analytics`
  5. Description: same as Product Hunt description above
  6. Free submission takes ~2 months to be featured; paid ($99+) gets listed in days
  - **Shareholder action**: Create account at betalist.com, fill form (~2 min), then wait for email confirmation
- **Launching.today**: DEAD — domain does not resolve (DNS failure confirmed 2026-03-24). Skip.
- **GitHub showcase repo**: https://github.com/niklastmk/snapqr — README updated with product description + embedded demo QR code (sPaleBlu1)
- **Awesome-list PR**: https://github.com/make-github-pseudonymous-again/awesome-qr-code/pull/13 — added SnapQR to Services section
- GA4 analytics code installed (awaiting NEXT_PUBLIC_GA_MEASUREMENT_ID env var)
- Stripe webhook creates new user + API key on first purchase (fixed 2026-03-24 — was silently failing for email-only checkout)
- Free tier capped at 3 lifetime QR codes per IP (was 5/day) — drives faster conversion (shipped 2026-03-24)
- Stats page banner links to /snapqr with conversion-friendly copy instead of /snapqr/upgrade paywall (shipped 2026-03-24)
- **End-to-end smoke test PASSED (2026-03-24)** — full purchase flow verified:
  1. POST /api/snapqr/generate → PASS (returns shortCode, qrUrl, redirectUrl, statsUrl)
  2. GET /r/[code] → PASS (302 redirect to target URL, scan event logged)
  3. GET /s/[code] → PASS (stats page renders with scan data)
  4. POST /api/snapqr/checkout → PASS (returns live cs_live_ Stripe checkout URL — CONFIRMED LIVE MODE)
  5. Stripe webhook checkout.session.completed → PASS (new user created with plan=qr_pro, API key generated, Stripe customer ID linked)
- **Broken /s/demo links fixed (2026-03-24)** — landing page was referencing /s/demo (404) in 3 places; now pointing to /s/sPaleBlu1 (seeded code, verified 200 OK, 3+ scans)
- **qr.api-snap.com domain moved (2026-03-24)** — was registered to dead snapqr Railway project; deleted via API and re-registered to live striking-enjoyment service. PENDING: Cloudflare CNAME for `qr` must be updated from `snapqr-production.up.railway.app` to `nztawuxw.up.railway.app` (human-gated, requires Cloudflare dashboard login)

## What's NOT Done
- RapidAPI listing (requires human login at rapidapi.com/studio)
- Postman API Network listing (requires human login)
- No customers yet
- No social media presence
- Analytics blind until NEXT_PUBLIC_GA_MEASUREMENT_ID set in Railway
- qr.api-snap.com: Update Cloudflare CNAME `qr` → `nztawuxw.up.railway.app` + add TXT `_railway-verify.qr` → `railway-verify=6250e8fe54f44737db606d8b19e9183164bd477ee9dadc79ad4835d3ea18cc2b` (requires Cloudflare dashboard login)

## Kill Date
April 15, 2026 — if no paying customers by then, abandon and pivot

## Deploy Process
1. Make changes in this directory
2. Run `railway up` to deploy
3. Verify at https://api-snap.com

## Security Rules
- NEVER pass raw credit card numbers to Stripe API. Use Stripe Checkout sessions only.
- Test payments by visiting the checkout page in a browser, not via curl/API calls with card numbers.

## Git & GitHub
- GitHub user: niklastmk
- GitHub CLI: authenticated (run `gh auth status`)
- Git user: Niklas Tomkowitz <niklastomkowitz@gmail.com>
- To create a repo: `gh repo create api-snap --public --source .`
- To push: `git push origin main`

## Company Identity
- Brand: APISnap (the product suite at api-snap.com). Sub-products: SnapQR, SnapScreenshot, SnapPDF, etc.
- Name on accounts: APISnap (no fake person names)
- Username: apisnap
- Bio: 13+ utility APIs with one key. QR codes, screenshots, PDFs, and more.
