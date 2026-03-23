import Link from "next/link";
import type { Metadata } from "next";
import { posts } from "@/lib/blog";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://api-snap.com";

export const metadata: Metadata = {
  title: "Blog — Developer Guides & API Tips",
  description:
    "Practical guides for developers: screenshot automation, QR code generation, image processing, API integration patterns, and more. Learn how to ship faster with ready-made APIs.",
  openGraph: {
    title: "Blog — Developer Guides & API Tips | API Snap",
    description:
      "Practical guides for developers: QR code generation, image processing, API integration, and more.",
    url: `${baseUrl}/blog`,
  },
  alternates: { canonical: `${baseUrl}/blog` },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen">
      <Nav current="/blog" />

      {/* Header */}
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Developer Blog
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Practical guides, integration patterns, and tips for shipping faster with APIs.
        </p>
      </section>

      {/* Post listing */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">Posts coming soon.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition"
              >
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                <p className="mt-2 text-gray-400">{post.description}</p>
                <span className="mt-3 inline-block text-sm font-medium text-indigo-400">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
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
