export function ScreenLoader() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-12 animate-pulse rounded-2xl bg-white" />
      <div className="h-40 animate-pulse rounded-3xl bg-white" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-44 animate-pulse rounded-3xl bg-white" />
        ))}
      </div>
    </div>
  )
}
