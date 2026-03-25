# Website Screenshots via API — No Puppeteer Setup Required

If you've ever tried to capture website screenshots programmatically, you know the drill. Install Puppeteer. Wait for Chromium to download (300MB+). Configure a headless browser. Handle timeouts, navigation errors, and viewport quirks. Set up a sandbox. Debug why it works locally but crashes in your Docker container.

All that — to take a picture of a webpage.

There's a better way, and it fits in a single curl command.

## The One-Liner

```bash
curl "https://api-snap.com/api/screenshot?url=https://github.com&width=1280&height=720&format=png" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o github-screenshot.png
```

That's a full-page screenshot of GitHub's homepage. 1280×720. PNG format. No Chromium download. No Puppeteer. No Playwright. No Selenium.

The API handles the browser, the rendering engine, the fonts, the JavaScript execution, and the cleanup. You get a screenshot.

## The Puppeteer Problem

Puppeteer is a fantastic tool. It's also a heavyweight one. Here's what "just taking a screenshot" actually involves:

### The Dependency Chain

```bash
npm install puppeteer
# Downloads ~300MB Chromium binary
# Requires: libgbm, libasound2, libatk-bridge2.0, libcups2, libdrm2,
#           libxkbcommon0, libxcomposite1, libxdamage1, libxrandr2...
```

On a fresh Ubuntu container, you need to install 15+ system packages before Puppeteer will even launch. On Alpine? Good luck — you're building Chromium from source or switching to `puppeteer-core` and managing your own browser binary.

### The Code

A "simple" Puppeteer screenshot script:

```javascript
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
await page.goto("https://github.com", { waitUntil: "networkidle2", timeout: 30000 });
await page.screenshot({ path: "screenshot.png", type: "png" });
await browser.close();
```

That's 9 lines of code, a 300MB dependency, a Dockerfile you'll spend an hour debugging, and a process that consumes 200-500MB of RAM at runtime.

### The Operational Overhead

- **Memory:** Each Chromium instance uses 200-500MB RAM. Running screenshots at scale means either queuing requests or throwing money at bigger servers.
- **Timeouts:** Pages with heavy JavaScript can hang. You need retry logic, timeouts, and error handling.
- **Security:** Running a full browser in your backend is an attack surface. Chromium sandboxing is disabled in most Docker setups (`--no-sandbox`).
- **Maintenance:** Chromium updates regularly. Puppeteer versions are pinned to specific Chromium versions. Mismatches cause silent failures.

## API Screenshots: What Changes

When you offload screenshots to an API, your architecture simplifies dramatically.

### No Browser in Your Stack

Your app server doesn't run Chromium. Your Docker image drops from 1GB+ to whatever your app actually needs. Your memory footprint stays predictable.

### No System Dependencies

Your `Dockerfile` doesn't need `apt-get install` for 15 graphics libraries. Your CI pipeline doesn't need a special browser setup step. Your Lambda function doesn't need a Chromium layer.

### Predictable Performance

The API manages browser pools, handles timeouts, and returns a result or an error. You don't debug why Chromium crashed at 3am.

## Real-World Use Cases

### Social Media Preview Cards

Generate Open Graph images dynamically by screenshotting a styled HTML page:

```bash
# Screenshot your OG image template page
curl "https://api-snap.com/api/screenshot?url=https://myapp.com/og-image/post-123&width=1200&height=630&format=png" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o og-image.png
```

This is a common pattern: design your OG card as an HTML page, then screenshot it. No canvas library. No SVG-to-PNG conversion. Just HTML + CSS, rendered by a real browser.

### Competitor Monitoring

Track how competitor landing pages change over time:

```python
import requests
from datetime import date

sites = [
    "https://competitor-a.com",
    "https://competitor-b.com",
    "https://competitor-c.com",
]

for site in sites:
    domain = site.split("//")[1].replace(".", "-")
    response = requests.get(
        "https://api-snap.com/api/screenshot",
        params={"url": site, "width": 1280, "height": 720, "format": "png"},
        headers={"Authorization": "Bearer YOUR_API_KEY"},
    )
    with open(f"screenshots/{domain}-{date.today()}.png", "wb") as f:
        f.write(response.content)
```

Run this daily with a cron job. You now have a visual changelog of every competitor's homepage.

### Link Previews in Chat Apps

When a user pastes a URL in your chat app, show a thumbnail:

```javascript
async function getLinkPreview(url) {
  // Grab metadata
  const metaRes = await fetch(
    `https://api-snap.com/api/meta?url=${encodeURIComponent(url)}`,
    { headers: { Authorization: "Bearer YOUR_API_KEY" } }
  );
  const meta = await metaRes.json();

  // Grab screenshot as thumbnail
  const screenshotRes = await fetch(
    `https://api-snap.com/api/screenshot?url=${encodeURIComponent(url)}&width=800&height=450&format=jpeg`,
    { headers: { Authorization: "Bearer YOUR_API_KEY" } }
  );
  const thumbnail = await screenshotRes.arrayBuffer();

  return {
    title: meta.title,
    description: meta.description,
    thumbnail: Buffer.from(thumbnail).toString("base64"),
  };
}
```

Two API calls. One for metadata (`/api/meta`), one for the visual preview. No headless browser in your chat backend.

### Full-Page Screenshots

Need the entire page, not just the viewport? Set `full_page=true`:

```bash
curl "https://api-snap.com/api/screenshot?url=https://example.com/long-page&width=1280&full_page=true&format=png" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o full-page.png
```

The API scrolls the page and stitches the result. You get a single tall image capturing everything.

## Parameters Reference

| Parameter   | Default | Options |
|-------------|---------|---------|
| `url`       | *(required)* | Any public URL |
| `width`     | 1280    | Up to 1920 |
| `height`    | 720     | Up to 1080 |
| `format`    | png     | `png`, `jpeg` |
| `full_page` | false   | `true`, `false` |

## When Puppeteer Still Makes Sense

If you need to **interact** with a page — fill forms, click buttons, scrape dynamic content — you need a browser automation tool. Puppeteer, Playwright, and Selenium are built for that.

But if you just need a screenshot? That's an API call. Don't run a browser when you need a camera.

## Get Started in 30 Seconds

API Snap's free tier includes 100 requests per month. No credit card. No Chromium download.

```bash
# Sign up at api-snap.com, grab your key, then:
curl "https://api-snap.com/api/screenshot?url=https://news.ycombinator.com&width=1280&format=png" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -o hn-screenshot.png
```

Open the file. That's Hacker News, captured in one HTTP request.

---

*API Snap provides screenshots, QR codes, image resizing, metadata extraction, and 9 more developer utilities — all behind one API key. [Start free at api-snap.com](https://api-snap.com).*
