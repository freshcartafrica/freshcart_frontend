export function SectionHeader({ title, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-brand-ink">{title}</h2>
      {action ? <button className="text-sm font-medium text-brand-blue">{action}</button> : null}
    </div>
  )
}
