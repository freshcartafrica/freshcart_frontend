import { BadgeCheck, MapPin, Phone, Star } from 'lucide-react'
import { vendorProfile } from '../../data/mockData'

export default function VendorProfilePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="surface p-6 sm:p-8">
        <p className="text-sm text-brand-ink/55">Vendor profile</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-brand-ink">{vendorProfile.name}</h1>
        <p className="mt-3 text-brand-ink/60">{vendorProfile.specialty}</p>
      </section>

      <section className="surface p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['City', vendorProfile.city, MapPin],
            ['Rating', `${vendorProfile.rating}/5`, Star],
            ['Operating since', vendorProfile.since, BadgeCheck],
            ['Support line', '+234 800 111 2233', Phone],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-[24px] bg-brand-cream p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-orange">
                <Icon size={16} />
              </div>
              <p className="mt-4 text-sm text-brand-ink/55">{label}</p>
              <p className="mt-1 font-bold text-brand-ink">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
