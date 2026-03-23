# API Snap — Operations Handbook

## Product
Developer utility API platform. 13+ endpoints (QR codes, screenshots, PDFs, image resize, hashing, etc.) behind a single API key with tiered pricing.

## Revenue Model
- Free: 100 calls/month
- Hobby: $9/mo — 1,000 calls
- Pro: $29/mo — 10,000 calls
- Business: $99/mo — 100,000 calls
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

### Domain
- Domain: api-snap.com (LIVE — connected via Railway, SSL provisioning)

## Codebase
- Framework: Next.js (App Router)
- Location: /Users/niklas/projects/mn370km2eba4
- All env vars are in `.env` in this directory
- All credentials are also set as Railway env vars

## What's Done
- Full app with all API endpoints working
- Stripe billing (checkout, webhooks, subscriptions)
- Auth (signup, login, API key management)
- Dashboard with usage tracking
- 5 SEO blog posts
- Landing pages per endpoint
- Deployed and running on Railway

## What's NOT Done
- Custom domain
- No customers
- No social media presence
- Not listed on any API marketplaces
- No analytics/monitoring

## Deploy Process
1. Make changes in this directory
2. Run `railway up` to deploy
3. Verify at https://api-snap.com

## Security Rules
- NEVER pass raw credit card numbers to Stripe API. Use Stripe Checkout sessions only.
- Test payments by visiting the checkout page in a browser, not via curl/API calls with card numbers.
