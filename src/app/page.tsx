import Link from "next/link";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is SnapQR really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can create up to 3 QR codes for free with 7-day scan analytics. No signup or credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "What does SnapQR Pro include?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For $7/month you get unlimited QR codes, 30-day scan history, full analytics (location, device, browser), CSV export, and unbranded QR images.",
      },
    },
    {
      "@type": "Question",
      name: "How does scan tracking work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each QR code gets a unique short link. When someone scans it, we record the time, country, device, browser, and OS — then redirect them to your destination URL instantly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I see analytics without signing up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every QR code gets a public stats page you can bookmark. Free users see 7 days of data; Pro users see 30 days.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Pro is billed monthly via Stripe. Cancel anytime with one click — no questions asked.",
      },
    },
  ],
};

const faqs = [
  { q: "Is SnapQR really free?", a: "Yes. You can create up to 3 QR codes for free with 7-day scan analytics. No signup or credit card required." },
  { q: "What does Pro include?", a: "For $7/mo you get unlimited QR codes, 30-day scan history, full analytics (location, device, browser), CSV export, and unbranded QR images." },
  { q: "How does scan tracking work?", a: "Each QR code gets a unique short link. When someone scans it, we record the time, country, device, browser, and OS — then redirect them to your destination URL instantly." },
  { q: "Can I see analytics without signing up?", a: "Yes. Every QR code gets a public stats page you can bookmark. Free users see 7 days of data; Pro users see 30 days." },
  { q: "Can I cancel anytime?", a: "Absolutely. Pro is billed monthly via Stripe. Cancel anytime with one click — no questions asked." },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 bg-blue-600 text-white text-center text-sm py-2 px-4">
        Create tracked QR codes free — no signup required{" "}
        <Link href="/snapqr" className="underline font-semibold hover:text-blue-100 ml-1">
          Try SnapQR &rarr;
        </Link>
      </div>

      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-block rounded-full bg-green-600/10 border border-green-500/20 px-4 py-1.5 text-sm text-green-400 mb-6">
          Free — no signup, no credit card
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Know Who Scans
          <br />
          <span className="text-blue-400">Your QR Codes</span>
        </h1>
        <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
          Generate a QR code in seconds. Track every scan — location, device, and time — on a live dashboard.
          Upgrade to Pro for $7/mo to unlock unlimited codes, 30-day analytics, and CSV export.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/snapqr"
            className="rounded-lg bg-blue-600 px-6 py-3.5 text-lg font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
          >
            Create Free QR Code
          </Link>
          <Link
            href="/snapqr/upgrade"
            className="rounded-lg border border-gray-700 px-6 py-3.5 text-lg font-medium text-gray-300 hover:border-gray-500 hover:text-white transition"
          >
            Go Pro — $7/mo
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          3 free QR codes with analytics. Pro from $7/mo for unlimited.
        </p>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="mx-auto max-w-4xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-sm text-gray-400 mt-1">Free QR codes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">$7/mo</p>
            <p className="text-sm text-gray-400 mt-1">Unlimited Pro</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">30 days</p>
            <p className="text-sm text-gray-400 mt-1">Pro scan history</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Real-time</p>
            <p className="text-sm text-gray-400 mt-1">Live scan dashboard</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How SnapQR Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { step: "1", title: "Paste Your URL", desc: "Enter any link. We generate a tracked QR code instantly — no signup needed." },
            { step: "2", title: "Share It Anywhere", desc: "Download the PNG or copy the short link. Print it, email it, post it." },
            { step: "3", title: "Watch the Scans", desc: "See who scans it in real time — country, device, browser, and time. All on a live dashboard." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-xl font-bold text-blue-400">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison: Free vs Pro */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-gray-400 mb-8">
          Start free. Upgrade when you need more.
        </p>
        <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-left">
            <h3 className="text-lg font-semibold text-white">Free</h3>
            <p className="text-3xl font-bold mt-2 text-white">$0</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">forever</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> 3 QR codes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> 7-day scan history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> Basic analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-600">&#10007;</span> <span className="text-gray-600">CSV export</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-600">&#10007;</span> <span className="text-gray-600">Unbranded images</span>
              </li>
            </ul>
            <Link
              href="/snapqr"
              className="mt-6 block text-center rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white transition"
            >
              Start Free
            </Link>
          </div>
          <div className="rounded-xl border-2 border-blue-500 bg-blue-600/10 p-6 text-left relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Best value
            </span>
            <h3 className="text-lg font-semibold text-white">Pro</h3>
            <p className="text-3xl font-bold mt-2 text-white">$7<span className="text-lg font-normal text-gray-400">/mo</span></p>
            <p className="text-sm text-gray-400 mt-1 mb-4">cancel anytime</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> <strong>Unlimited</strong> QR codes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> <strong>30-day</strong> scan history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> Full analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> CSV export
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">&#10003;</span> Unbranded QR images
              </li>
            </ul>
            <Link
              href="/snapqr/upgrade"
              className="mt-6 block text-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition"
            >
              Upgrade to Pro — $7/mo
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What People Use SnapQR For</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Event tickets & flyers", desc: "Know how many people scan your poster, and where they are" },
            { title: "Product packaging", desc: "Track which SKUs get the most engagement" },
            { title: "Business cards", desc: "See when prospects check out your profile" },
            { title: "Restaurant menus", desc: "Track table-side scans for digital menu adoption" },
            { title: "Marketing campaigns", desc: "Measure offline-to-online conversion with real data" },
            { title: "Internal links", desc: "Share tracked short links with your team" },
          ].map((uc) => (
            <div key={uc.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h3 className="text-lg font-semibold text-white">{uc.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
              <p className="mt-2 text-sm text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Create Your First Tracked QR Code</h2>
        <p className="text-gray-400 mb-8">
          Paste a URL, get a QR code with analytics — in under 10 seconds.
          No signup. No credit card. Just scan data.
        </p>
        <Link
          href="/snapqr"
          className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
        >
          Try SnapQR Free
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Need unlimited codes?{" "}
          <Link href="/snapqr/upgrade" className="text-blue-400 hover:text-blue-300">
            Go Pro for $7/mo
          </Link>
        </p>
      </section>

      {/* API Platform — below the fold, clearly separated */}
      <section className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Also from API Snap
          </p>
          <h2 className="text-2xl font-bold text-gray-300 mb-3">Developer API Platform</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-6">
            Need programmatic access to QR codes, image resizing, hashing, screenshots, and 13+ utility endpoints?
            Our developer API is a separate product with its own pricing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/docs"
              className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-400 hover:border-gray-500 hover:text-gray-300 transition"
            >
              API Documentation
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm font-medium text-gray-400 hover:border-gray-500 hover:text-gray-300 transition"
            >
              API Pricing (from $9/mo)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
