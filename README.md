# SnapAPI — Developer APIs Made Simple

A micro-SaaS that sells API access for common developer utilities: QR code generation, placeholder images, screenshots, and PDF generation.

## Business Model

- **Free tier**: 100 API calls/month (lead generation)
- **Hobby**: $9/mo for 5,000 calls
- **Pro**: $29/mo for 50,000 calls
- **Business**: $99/mo for 500,000 calls

Revenue scales linearly with customers. No per-request costs on most endpoints (QR, placeholders, PDFs are generated server-side with zero external API costs).

## Stack

- **Next.js 15** (App Router) — full-stack framework
- **SQLite + Drizzle ORM** — zero-config database
- **Stripe** — subscription billing
- **Tailwind CSS v4** — styling
- **JWT auth** — stateless authentication

## Getting Started

```bash
# Install dependencies
npm install

# Copy env file and configure
cp .env.example .env
# Edit .env with your Stripe keys and JWT secret

# Initialize database (auto-created on first request, or manually)
npx tsx src/lib/init-db.ts

# Run development server
npm run dev
```

Visit http://localhost:3000

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Create 3 subscription products with monthly pricing ($9, $29, $99)
3. Copy the price IDs into your `.env` file
4. Set up the webhook endpoint: `your-domain.com/api/webhooks/stripe`
5. Listen for events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

For local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## API Endpoints

All endpoints require an API key via `Authorization: Bearer <key>` header or `?api_key=<key>` query param.

| Endpoint | Method | Description |
|---|---|---|
| `/api/qr` | GET | Generate QR codes (PNG/SVG) |
| `/api/placeholder` | GET | Generate placeholder images |
| `/api/screenshot` | GET | Capture website screenshots |
| `/api/pdf` | POST | Generate PDFs from HTML |

## Deployment

Deploy to Vercel (recommended) or any Node.js host:

```bash
npm run build
npm start
```

For Vercel, the SQLite database should be replaced with a hosted solution (Turso, PlanetScale, etc.) for production. The Drizzle ORM makes this a simple driver swap.

## Scaling Revenue

1. **SEO**: The landing page and docs are statically generated for search engines
2. **API marketplace listings**: List on RapidAPI, API Layer, etc.
3. **Content marketing**: Write tutorials showing API usage
4. **Add more endpoints**: Each new utility increases the value proposition with zero additional infrastructure
5. **Usage-based pricing**: Add overage charges for high-volume users
