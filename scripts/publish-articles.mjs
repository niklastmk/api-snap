#!/usr/bin/env node

/**
 * Publish articles to Dev.to and Hashnode.
 *
 * Usage:
 *   node scripts/publish-articles.mjs                  # dry-run (default)
 *   node scripts/publish-articles.mjs --publish         # publish live
 *   node scripts/publish-articles.mjs --publish --devto  # Dev.to only
 *   node scripts/publish-articles.mjs --publish --hashnode # Hashnode only
 *
 * Environment variables:
 *   DEVTO_API_KEY          — Dev.to API key (Settings → Extensions → Generate API Key)
 *   HASHNODE_TOKEN         — Hashnode Personal Access Token (Settings → Developer)
 *   HASHNODE_PUBLICATION_ID — Your Hashnode publication/blog ID
 */

import fs from "node:fs";
import path from "node:path";

// ── Article metadata ──────────────────────────────────────────────────────────

const ARTICLES = [
  {
    file: "qr-codes-via-api-3-lines.md",
    title: "How to Generate QR Codes via API in 3 Lines of Code",
    description:
      "Skip the QR libraries. Generate QR codes with a single HTTP request — no dependencies, no build step.",
    tags: ["api", "webdev", "javascript", "tutorial"],
    canonicalSlug: "blog/qr-codes-via-api",
    coverImage: null,
  },
  {
    file: "website-screenshots-api-no-puppeteer.md",
    title: "Website Screenshots via API — No Puppeteer Setup Required",
    description:
      "Capture website screenshots with one curl command. No Chromium download, no Puppeteer, no Playwright.",
    tags: ["api", "webdev", "node", "tutorial"],
    canonicalSlug: "blog/website-screenshots-api",
    coverImage: null,
  },
  {
    file: "html-to-pdf-api-no-wkhtmltopdf.md",
    title: "How to Convert HTML to PDF via API — No wkhtmltopdf Required",
    description:
      "Turn HTML into PDFs with a single API call. No wkhtmltopdf, no Puppeteer, no abandoned libraries.",
    tags: ["api", "webdev", "javascript", "tutorial"],
    canonicalSlug: "blog/html-to-pdf-api",
    coverImage: null,
  },
  {
    file: "resize-convert-images-api-no-sharp.md",
    title:
      "How to Resize and Convert Images via API — Without Sharp or ImageMagick",
    description:
      "Resize images and convert formats with one HTTP request. No Sharp, no ImageMagick, no native dependencies.",
    tags: ["api", "webdev", "node", "tutorial"],
    canonicalSlug: "blog/resize-convert-images-api",
    coverImage: null,
  },
  {
    file: "stop-managing-5-api-keys-for-basic-utilities.md",
    title: "Stop Managing 5 API Keys for Basic Utilities",
    description:
      "QR codes, screenshots, PDFs, image resizing — one API key instead of five. Consolidate your utility API sprawl.",
    tags: ["api", "webdev", "productivity", "saas"],
    canonicalSlug: "blog/stop-managing-5-api-keys",
    coverImage: null,
  },
];

const CANONICAL_BASE = "https://api-snap.com";
const ARTICLES_DIR = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../articles"
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function readArticle(filename) {
  const filePath = path.join(ARTICLES_DIR, filename);
  return fs.readFileSync(filePath, "utf-8");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Dev.to ────────────────────────────────────────────────────────────────────

async function publishToDevTo(article, markdown, { dryRun }) {
  const canonicalUrl = `${CANONICAL_BASE}/${article.canonicalSlug}`;

  const body = {
    article: {
      title: article.title,
      body_markdown: markdown,
      published: true,
      tags: article.tags.slice(0, 4).join(", "), // Dev.to max 4 tags
      canonical_url: canonicalUrl,
      description: article.description,
      ...(article.coverImage && { main_image: article.coverImage }),
    },
  };

  if (dryRun) {
    console.log(`  [DEV.TO DRY-RUN] Would publish: "${article.title}"`);
    console.log(`    Tags: ${body.article.tags}`);
    console.log(`    Canonical: ${canonicalUrl}`);
    return { url: `https://dev.to/preview/${article.file}`, id: "dry-run" };
  }

  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) throw new Error("Missing DEVTO_API_KEY environment variable");

  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      Accept: "application/vnd.forem.api-v1+json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dev.to API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return { url: data.url, id: data.id };
}

// ── Hashnode ──────────────────────────────────────────────────────────────────

const HASHNODE_PUBLISH_MUTATION = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        url
        slug
      }
    }
  }
`;

function hashnodeTags(tags) {
  return tags.map((t) => ({
    slug: t.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    name: t.charAt(0).toUpperCase() + t.slice(1),
  }));
}

async function publishToHashnode(article, markdown, { dryRun }) {
  const canonicalUrl = `${CANONICAL_BASE}/${article.canonicalSlug}`;

  const input = {
    title: article.title,
    contentMarkdown: markdown,
    publicationId: process.env.HASHNODE_PUBLICATION_ID,
    originalArticleURL: canonicalUrl,
    tags: hashnodeTags(article.tags),
    ...(article.coverImage && {
      coverImageOptions: { coverImageURL: article.coverImage },
    }),
    metaTags: {
      title: article.title,
      description: article.description,
    },
  };

  if (dryRun) {
    console.log(`  [HASHNODE DRY-RUN] Would publish: "${article.title}"`);
    console.log(`    Tags: ${article.tags.join(", ")}`);
    console.log(`    Canonical: ${canonicalUrl}`);
    return {
      url: `https://hashnode.com/preview/${article.file}`,
      id: "dry-run",
    };
  }

  const token = process.env.HASHNODE_TOKEN;
  const pubId = process.env.HASHNODE_PUBLICATION_ID;
  if (!token) throw new Error("Missing HASHNODE_TOKEN environment variable");
  if (!pubId)
    throw new Error("Missing HASHNODE_PUBLICATION_ID environment variable");

  const res = await fetch("https://gql.hashnode.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      query: HASHNODE_PUBLISH_MUTATION,
      variables: { input },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Hashnode API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(
      `Hashnode GraphQL errors: ${JSON.stringify(data.errors, null, 2)}`
    );
  }

  const post = data.data.publishPost.post;
  return { url: post.url, id: post.id };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes("--publish");
  const devtoOnly = args.includes("--devto");
  const hashnodeOnly = args.includes("--hashnode");
  const publishDevTo = !hashnodeOnly;
  const publishHashnode = !devtoOnly;

  console.log(
    `\n📝 Article Publisher — ${dryRun ? "DRY RUN" : "LIVE PUBLISH"}\n`
  );

  if (dryRun) {
    console.log(
      "  (pass --publish to publish for real, --devto or --hashnode for single platform)\n"
    );
  }

  const results = [];

  for (const article of ARTICLES) {
    console.log(`\n── ${article.title}`);

    const markdown = readArticle(article.file);
    const result = { title: article.title, devto: null, hashnode: null };

    if (publishDevTo) {
      try {
        result.devto = await publishToDevTo(article, markdown, { dryRun });
        console.log(`  ✓ Dev.to: ${result.devto.url}`);
      } catch (err) {
        console.error(`  ✗ Dev.to failed: ${err.message}`);
        result.devto = { error: err.message };
      }
    }

    if (publishHashnode) {
      try {
        result.hashnode = await publishToHashnode(article, markdown, {
          dryRun,
        });
        console.log(`  ✓ Hashnode: ${result.hashnode.url}`);
      } catch (err) {
        console.error(`  ✗ Hashnode failed: ${err.message}`);
        result.hashnode = { error: err.message };
      }
    }

    results.push(result);

    // Rate-limit between articles when publishing live
    if (!dryRun) await sleep(2000);
  }

  // Summary
  console.log("\n\n═══ Summary ═══\n");
  for (const r of results) {
    console.log(`${r.title}`);
    if (r.devto) {
      console.log(
        `  Dev.to:    ${r.devto.error ? `✗ ${r.devto.error}` : `✓ ${r.devto.url}`}`
      );
    }
    if (r.hashnode) {
      console.log(
        `  Hashnode:  ${r.hashnode.error ? `✗ ${r.hashnode.error}` : `✓ ${r.hashnode.url}`}`
      );
    }
  }

  // Write results to file for tracking
  const outputPath = path.join(ARTICLES_DIR, ".publish-results.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${outputPath}`);
}

main().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
