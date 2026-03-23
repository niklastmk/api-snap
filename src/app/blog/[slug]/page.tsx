import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { posts, getPost } from "@/lib/blog";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

// ---------------------------------------------------------------------------
// Static params — tells Next.js which slugs to pre-render
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

// ---------------------------------------------------------------------------
// Dynamic metadata — unique title, description, OG tags per post
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      authors: ["API Snap"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    author: {
      "@type": "Organization",
      name: "API Snap",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "API Snap",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
    keywords: post.keywords.join(", "),
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            API Snap
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/blog" className="text-gray-400 hover:text-white transition">
              Blog
            </Link>
            <Link href="/playground" className="text-gray-400 hover:text-white transition">
              Playground
            </Link>
            <Link href="/docs" className="text-gray-400 hover:text-white transition">
              Docs
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/login" className="text-gray-400 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link href="/blog" className="hover:text-gray-300 transition">
            ← Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-gray-400">{post.description}</p>
        </header>

        {/* Content */}
        <div className="blog-content space-y-6 text-gray-300 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-gray-300 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_code]:bg-gray-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-indigo-300 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-gray-800 [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_pre_code]:py-0 [&_a]:text-indigo-400 [&_a:hover]:text-indigo-300 [&_a]:underline [&_strong]:text-white [&_strong]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_blockquote]:italic">
          {post.content}
        </div>
      </article>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-600/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to try it?</h2>
          <p className="text-gray-400 mb-6">
            Get your free API key and start building in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-500 transition"
            >
              Get Free API Key
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-gray-700 px-6 py-3 text-lg font-medium text-gray-300 hover:border-gray-500 hover:text-white transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start justify-between gap-8 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} API Snap. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-gray-300 transition">Docs</Link>
            <Link href="/playground" className="hover:text-gray-300 transition">Playground</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition">Pricing</Link>
            <Link href="/blog" className="hover:text-gray-300 transition">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
