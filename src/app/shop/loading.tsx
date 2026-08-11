export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
      <div className="h-10 w-40 bg-bark/10 rounded animate-pulse mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-bark/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}