# How to Convert HTML to PDF via API — No wkhtmltopdf Required

You need to generate a PDF. An invoice, a report, a contract, a receipt. You Google "HTML to PDF" and discover a graveyard of broken options: `wkhtmltopdf` (abandoned, depends on a patched Qt WebKit), Puppeteer (300MB Chromium just to print a page), `pdfkit` (you're now writing PDFs in code instead of HTML), or `prince` ($3,800/year).

Here's the thing — you already know HTML and CSS. You just need something that turns it into a PDF without the ops nightmare.

One HTTP request does it.

## The Simple Version

```bash
curl -X POST "https://api-snap.com/api/pdf" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Invoice #1042</h1><p>Amount due: $250.00</p>"}' \
  -o invoice.pdf
```

That's a PDF on disk. No binary to install. No Chromium. No deprecated WebKit fork. Just HTML in, PDF out.

## Why the Existing Options Are Painful

### wkhtmltopdf

The go-to answer on every Stack Overflow thread from 2015. Here's the reality in 2025+:

- **Abandoned.** The project is archived. The last release was in 2020. Open issues sit unanswered.
- **Depends on patched Qt WebKit.** Not regular WebKit — a custom fork that doesn't support modern CSS (flexbox, grid, `calc()`).
- **System dependency.** It's a native binary. Your Dockerfile needs `apt-get install wkhtmltopdf`, which pulls in X11 libraries, fonts, and rendering dependencies.
- **Rendering bugs.** CSS that looks perfect in Chrome renders broken in wkhtmltopdf because it's not running Chrome — it's running a decade-old rendering engine.

### Puppeteer / Playwright

You can use `page.pdf()` to generate PDFs, and it actually renders modern CSS correctly. But:

- **300MB+ Chromium download** just to call `.pdf()`.
- **200-500MB RAM per instance.** Generating PDFs under load means running browser pools.
- **Docker complexity.** Chromium in containers requires `--no-sandbox`, system dependencies, and careful memory limits.

### pdfkit / jsPDF

These libraries generate PDFs programmatically — by writing code that draws rectangles, places text at coordinates, and manually manages layout. You're essentially writing PostScript, not HTML.

```javascript
// This is what "simple" PDF generation looks like with pdfkit
doc.fontSize(25).text('Invoice #1042', 100, 80);
doc.fontSize(12).text('Amount due: $250.00', 100, 120);
doc.moveTo(100, 150).lineTo(500, 150).stroke();
```

If your PDF has a table, you're computing column widths by hand. If your design changes, you're rewriting coordinate math. There's no CSS. There's no responsive layout. There's no "just make it look like the HTML."

## API Approach: HTML In, PDF Out

With an API, you write your document in HTML and CSS — the same tools you use for everything else — and get a PDF back.

### A Real Invoice

```javascript
const invoiceHTML = `
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a1a; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .company { font-size: 24px; font-weight: bold; }
    .invoice-number { color: #666; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; border-bottom: 2px solid #1a1a1a; padding: 8px 0; }
    td { padding: 8px 0; border-bottom: 1px solid #eee; }
    .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">Acme Corp</div>
    <div class="invoice-number">Invoice #1042<br/>March 2025</div>
  </div>
  <table>
    <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
    <tr><td>API Integration</td><td>1</td><td>$150.00</td></tr>
    <tr><td>Support Hours</td><td>5</td><td>$100.00</td></tr>
  </table>
  <div class="total">Total: $250.00</div>
</body>
</html>`;

const res = await fetch("https://api-snap.com/api/pdf", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ html: invoiceHTML, title: "Invoice 1042" }),
});

const pdf = await res.arrayBuffer();
await fs.writeFile("invoice-1042.pdf", Buffer.from(pdf));
```

That's a properly styled invoice with a table, header, and totals — generated from HTML you can preview in a browser before sending it to the API.

### Python: Generate a Report

```python
import requests

report_html = """
<html>
<head>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
    .metric { display: inline-block; width: 30%; text-align: center; padding: 20px; }
    .metric .value { font-size: 36px; font-weight: bold; color: #2563eb; }
    .metric .label { color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <h1>Monthly Report — March 2025</h1>
  <div>
    <div class="metric"><div class="value">12,847</div><div class="label">API Calls</div></div>
    <div class="metric"><div class="value">99.7%</div><div class="label">Uptime</div></div>
    <div class="metric"><div class="value">142ms</div><div class="label">Avg Latency</div></div>
  </div>
  <h2>Summary</h2>
  <p>Usage increased 23% month-over-month. No incidents reported.</p>
</body>
</html>
"""

response = requests.post(
    "https://api-snap.com/api/pdf",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={"html": report_html, "title": "Monthly Report"},
)

with open("report-march-2025.pdf", "wb") as f:
    f.write(response.content)
```

### Batch Generation

Need to generate hundreds of certificates, receipts, or contracts? Template your HTML and loop:

```javascript
const customers = [
  { name: "Alice", amount: "$120.00", id: "INV-001" },
  { name: "Bob", amount: "$85.50", id: "INV-002" },
  { name: "Carol", amount: "$200.00", id: "INV-003" },
];

for (const customer of customers) {
  const html = `
    <h1>Receipt</h1>
    <p>Customer: ${customer.name}</p>
    <p>Amount: ${customer.amount}</p>
    <p>Reference: ${customer.id}</p>
  `;

  const res = await fetch("https://api-snap.com/api/pdf", {
    method: "POST",
    headers: {
      Authorization: "Bearer YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html }),
  });

  const pdf = await res.arrayBuffer();
  await fs.writeFile(`${customer.id}.pdf`, Buffer.from(pdf));
}
```

Three receipts. Three API calls. No browser pools. No memory management. No cleanup.

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `html`    | Yes      | HTML content to convert to PDF |
| `title`   | No       | Document title (appears in PDF metadata) |

## When You Shouldn't Use an API

If you're generating thousands of PDFs per minute in a latency-sensitive pipeline, running a local rendering engine (like Puppeteer behind a queue) might make sense. If your PDFs contain highly sensitive data that can't leave your network, a local tool is the right call.

For everything else — invoices, receipts, reports, certificates, contracts — an API call is simpler, faster to implement, and cheaper to maintain than any self-hosted solution.

## Get Started

API Snap's free tier includes 100 requests/month. No credit card. No binary installs. No deprecated WebKit.

```bash
curl -X POST "https://api-snap.com/api/pdf" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Hello, PDF</h1><p>Generated with one API call.</p>"}' \
  -o hello.pdf
```

Open it. That's a PDF, built from HTML, in one request.

---

*API Snap bundles PDF generation, screenshots, QR codes, image processing, and 9 more developer utilities behind a single API key. [Start free at api-snap.com](https://api-snap.com).*
