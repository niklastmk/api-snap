# How to Generate QR Codes via API in 3 Lines of Code

You need a QR code in your app. Maybe it's for a payment link, a Wi-Fi config, or a shareable URL. You Google "QR code library," and suddenly you're comparing `qrcode`, `qr-image`, `python-qrcode`, and `segno` — installing native dependencies, fighting with canvas bindings, and writing 40 lines of code to produce a PNG.

There's a faster way. A single HTTP request. No dependencies. No build step.

## The 3-Line Solution

Here's a QR code, generated via API, in a curl one-liner:

```bash
curl "https://api-snap.com/api/qr?data=https://example.com&size=400&format=png" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o qr-code.png
```

That's it. You now have a 400×400 PNG QR code on disk. No `npm install`, no Python virtual environment, no Sharp/Canvas native bindings that refuse to compile on Alpine Linux.

Want an SVG instead? Change one parameter:

```bash
curl "https://api-snap.com/api/qr?data=https://example.com&size=400&format=svg" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o qr-code.svg
```

## Why This Matters

Libraries are great — until they aren't. QR code generation is a **solved problem**. You don't need to own the implementation. You need the output.

Here's what you're actually signing up for when you install a QR library:

- **Native dependencies.** Many QR libraries depend on `canvas` or `sharp`, which require system-level packages (`libcairo`, `libpng`). Your Dockerfile just got heavier.
- **Version churn.** That QR library you installed 6 months ago? It now has a security advisory. Time to update, test, and redeploy.
- **Bundle size.** In a frontend app, a QR library adds 30-80KB to your bundle. An `<img>` tag pointing at an API adds 0KB.

An API call sidesteps all of this. Your app stays lean. Your CI pipeline stays fast. Your weekends stay free.

## Real-World Examples

### Dynamic QR Codes in a Web App

Embed QR codes directly in your HTML without any JavaScript QR library:

```html
<img
  src="https://api-snap.com/api/qr?data=https://myapp.com/invite/abc123&size=300&format=png"
  alt="Invite QR Code"
  width="300"
  height="300"
/>
```

The browser does the work. No client-side rendering. No hydration. Works in email templates too.

### Custom-Branded QR Codes

Need your QR code to match your brand? Use the `dark` and `light` color parameters:

```bash
curl "https://api-snap.com/api/qr?data=https://myapp.com/pay&size=500&dark=%234f46e5&light=%23ffffff&format=png" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o branded-qr.png
```

That gives you an indigo-on-white QR code. No Photoshop. No design tool. One request.

### Generating QR Codes in a Backend Script

Here's a Node.js example that generates QR codes for a batch of URLs:

```javascript
const urls = [
  "https://mystore.com/product/1",
  "https://mystore.com/product/2",
  "https://mystore.com/product/3",
];

for (const url of urls) {
  const res = await fetch(
    `https://api-snap.com/api/qr?data=${encodeURIComponent(url)}&size=400&format=png`,
    { headers: { Authorization: "Bearer YOUR_API_KEY" } }
  );
  const buffer = await res.arrayBuffer();
  await fs.writeFile(`qr-${url.split("/").pop()}.png`, Buffer.from(buffer));
}
```

Zero dependencies beyond Node's built-in `fetch`. No `package.json` changes. No lockfile diff.

### Python — Just as Simple

```python
import requests

response = requests.get(
    "https://api-snap.com/api/qr",
    params={"data": "https://example.com", "size": 400, "format": "png"},
    headers={"Authorization": "Bearer YOUR_API_KEY"},
)

with open("qr-code.png", "wb") as f:
    f.write(response.content)
```

### Wi-Fi QR Codes

You can encode Wi-Fi credentials directly into a QR code. When scanned, the phone auto-connects:

```bash
curl "https://api-snap.com/api/qr?data=WIFI:T:WPA;S:MyNetwork;P:MyPassword;;&size=400" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o wifi-qr.png
```

Print that, stick it on the wall, and never spell out your Wi-Fi password again.

## Parameters at a Glance

| Parameter | Default | Options |
|-----------|---------|---------|
| `data` | *(required)* | Any string or URL |
| `size` | 300 | 1–1000 pixels |
| `format` | png | `png`, `svg` |
| `dark` | #000000 | Any hex color |
| `light` | #ffffff | Any hex color |

## When Should You Use a Library Instead?

Fair question. If you're generating tens of thousands of QR codes per second in a hot loop with zero network latency tolerance, a local library makes sense. If you're in an air-gapped environment with no internet, a local library is your only option.

For the other 99% of use cases — a user signs up and you show them a QR code, a merchant generates a payment link, a marketing page displays a download code — an API call is faster to implement, easier to maintain, and cheaper to run.

## Getting Started

API Snap's free tier gives you 100 API calls per month — enough to build, test, and prototype. No credit card required.

1. **Sign up** at [api-snap.com](https://api-snap.com)
2. **Grab your API key** from the dashboard
3. **Make your first request:**

```bash
curl "https://api-snap.com/api/qr?data=hello+world&size=300" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o my-first-qr.png
```

You'll have a QR code on your desktop in under 10 seconds. The only dependency is `curl` — and you already have that.

---

*API Snap bundles 13 common developer utilities — QR codes, screenshots, image resizing, hashing, UUIDs, and more — behind a single API key. [Start free at api-snap.com](https://api-snap.com).*
