# SnapAPI — Developer APIs Made Simple

A micro-SaaS that sells API access for 13+ developer utilities: QR codes, hashing, image resizing, UUID generation, Base64, JWT decoding, color conversion, and more.

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
| `/api/hash` | GET/POST | Cryptographic hashing (SHA-256, MD5, etc.) |
| `/api/uuid` | GET | Generate UUIDs, nanoids, hex tokens |
| `/api/base64` | POST | Base64 encode/decode |
| `/api/jwt-decode` | POST | Decode and inspect JWT tokens |
| `/api/color` | GET | Color format conversion (hex/RGB/HSL) |
| `/api/lorem` | GET | Lorem ipsum text generator |
| `/api/placeholder` | GET | Generate placeholder images |
| `/api/meta` | GET | Extract URL metadata / OG tags |
| `/api/resize` | POST | Image resize and format conversion |
| `/api/markdown` | POST | Markdown to HTML conversion |
| `/api/screenshot` | GET | Capture website screenshots |
| `/api/pdf` | POST | Generate PDFs from HTML |

## Deployment

Deploy to Vercel (recommended) or any Node.js host:

```bash
npm run build
npm start
```

For Vercel, the SQLite database should be replaced with a hosted solution (Turso, PlanetScale, etc.) for production. The Drizzle ORM makes this a simple driver swap.

## Pages

| Page | Description |
|---|---|
| `/` | Marketing landing page with conversion copy, use cases, FAQ |
| `/playground` | Interactive API playground — try endpoints without signing up |
| `/docs` | Full API documentation with examples for all 13 endpoints |
| `/pricing` | Pricing page with Stripe checkout integration |
| `/signup` | User registration |
| `/login` | User login |
| `/dashboard` | API key management and usage tracking |

## SEO & Growth

- Structured data (JSON-LD) for search engines
- Open Graph and Twitter Card meta tags
- Auto-generated sitemap.xml and robots.txt
- Interactive playground for conversion (no signup required)
- FAQ section for long-tail SEO

## Scaling Revenue

1. **SEO**: Landing page, docs, and playground are optimized for search engines
2. **Playground**: Visitors can try APIs instantly — reduces friction to first signup
3. **API marketplace listings**: List on RapidAPI, API Layer, etc.
4. **Content marketing**: Write tutorials showing API usage
5. **Add more endpoints**: Each new utility increases the value proposition with zero additional infrastructure
6. **Usage-based pricing**: Add overage charges for high-volume users
