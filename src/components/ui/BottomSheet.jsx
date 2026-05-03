export function BottomSheet({ open, title, onClose, children }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/30" onClick={onClose}>
      <div
        className="absolute bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 rounded-t-[28px] bg-white p-5 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="text-sm text-slate-500" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
