export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
      <div className="h-10 w-40 bg-bark/10 rounded animate-pulse mb-10" />
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="h-40 bg-bark/5 rounded-2xl animate-pulse" />
          <div className="h-20 bg-bark/5 rounded-2xl animate-pulse" />
        </aside>
        <main className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-bark/5 rounded-2xl animate-pulse" />
          ))}
        </main>
      </div>
    </div>
  );
}