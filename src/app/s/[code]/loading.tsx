export default function StatsLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Nav skeleton */}
      <nav className="border-b border-zinc-200 bg-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="h-5 w-16 bg-zinc-200 rounded animate-pulse" />
          <div className="h-5 w-28 bg-zinc-100 rounded animate-pulse" />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="h-7 w-44 bg-zinc-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-72 bg-zinc-100 rounded animate-pulse mb-8" />

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5">
              <div className="h-7 sm:h-8 w-12 bg-zinc-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* QR preview skeleton */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 p-5 bg-white border border-zinc-200 rounded-xl">
          <div className="w-[100px] h-[100px] bg-zinc-200 rounded animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse mb-2" />
            <div className="h-3 w-48 bg-zinc-100 rounded animate-pulse mb-4" />
            <div className="flex gap-2">
              <div className="h-9 w-32 bg-zinc-200 rounded-lg animate-pulse" />
              <div className="h-9 w-28 bg-zinc-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Timeline chart skeleton */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-32 bg-zinc-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
          </div>
          <div className="flex items-end gap-1 h-32">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-zinc-100 rounded-t animate-pulse"
                style={{ height: `${20 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        </div>

        {/* Analytics grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5">
              <div className="h-4 w-28 bg-zinc-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="h-3 w-14 bg-zinc-100 rounded animate-pulse" />
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full animate-pulse" />
                    <div className="h-3 w-8 bg-zinc-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent scans skeleton */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-8">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="h-5 w-28 bg-zinc-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
          </div>
          <div className="px-5 py-3 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-16 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-16 bg-zinc-100 rounded animate-pulse hidden sm:block" />
                <div className="h-3 w-12 bg-zinc-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
