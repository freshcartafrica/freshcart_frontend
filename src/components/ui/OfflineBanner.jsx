import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="sticky top-0 z-50 bg-brand-blue px-4 py-2 text-center text-xs font-medium text-white">
      You are offline. FreshCart will reconnect and refresh when the network returns.
    </div>
  )
}
