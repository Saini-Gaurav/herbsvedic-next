export default function ProductLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-bark/5 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-bark/10 rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-bark/10 rounded animate-pulse" />
          <div className="h-6 w-32 bg-bark/10 rounded animate-pulse" />
          <div className="h-24 bg-bark/5 rounded animate-pulse" />
          <div className="h-12 bg-bark/5 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}