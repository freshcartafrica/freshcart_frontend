export default function UploadProductPage() {
  return (
    <div className="surface p-6 sm:p-8">
      <p className="text-sm text-brand-ink/55">Upload product</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">List a new item in the marketplace.</h1>

      <form className="mt-8 grid gap-4 sm:grid-cols-2">
        <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Product name" />
        <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Category" />
        <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Price" />
        <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none" placeholder="Stock quantity" />
        <input className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none sm:col-span-2" placeholder="Image URL" />
        <textarea className="rounded-[20px] border border-brand-ink/10 bg-brand-cream px-4 py-3 text-sm outline-none sm:col-span-2" rows="5" placeholder="Product description" />
        <button className="primary-button sm:col-span-2">Publish product</button>
      </form>
    </div>
  )
}
