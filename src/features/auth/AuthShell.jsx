import { ArrowLeft, CheckCircle2, ShieldCheck, Store, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

const authHighlights = [
  {
    title: 'Neighborhood delivery loops',
    copy: 'Move from discovery to doorstep tracking in one clean grocery flow.',
    Icon: Truck,
  },
  {
    title: 'Trusted account roles',
    copy: 'Shoppers and vendors each get a tailored onboarding path after sign in.',
    Icon: Store,
  },
  {
    title: 'Protected sessions',
    copy: 'Authentication, reset requests, and role-based routing stay connected to the API.',
    Icon: ShieldCheck,
  },
]

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  asideTitle = 'Fresh grocery commerce for fast cities',
  asideCopy = 'Create an account, choose your role, and step into the right onboarding experience without leaving the FreshCart atmosphere.',
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(253,139,0,0.18),transparent_26%),radial-gradient(circle_at_right_center,rgba(55,92,145,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,246,238,0.98))]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(253,139,0,0.12),transparent_55%)]" />
      <div className="absolute -left-24 top-28 h-64 w-64 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden rounded-[36px] border border-white/70 bg-brand-blue px-8 py-10 text-white shadow-soft lg:flex lg:flex-col lg:justify-between">
            <div>
              <span className="eyebrow border-white/20 bg-white/10 text-white">FreshCart access</span>
              <h1 className="mt-6 max-w-md font-display text-5xl font-extrabold leading-tight">
                {asideTitle}
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/75">{asideCopy}</p>
            </div>

            <div className="mt-10 space-y-4">
              {authHighlights.map(({ title: itemTitle, copy, Icon }) => (
                <div
                  key={itemTitle}
                  className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-brand-gold">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-bold">{itemTitle}</p>
                      <p className="mt-2 text-sm text-white/70">{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,rgba(253,139,0,0.12),transparent_65%)]" />
            <div className="relative">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-brand-ink/10 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-ink/70 transition hover:border-brand-orange/30 hover:text-brand-orange"
              >
                <ArrowLeft size={16} />
                Back home
              </Link>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-brand-orange" />
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-orange">{eyebrow}</p>
                </div>
                <h2 className="mt-4 font-display text-4xl font-extrabold text-brand-ink">{title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-brand-ink/60">{subtitle}</p>
              </div>

              <div className="mt-8">{children}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
