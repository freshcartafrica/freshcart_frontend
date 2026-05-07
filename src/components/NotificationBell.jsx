import { Bell, CheckCheck, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { endpoints } from '../lib/api'

function formatRelative(value) {
  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000))

  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}

export function NotificationBell({
  buttonClassName = '',
  iconClassName = '',
  panelClassName = '',
  dotClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  )

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await endpoints.notifications()
      setNotifications(response.data)
    } catch (loadError) {
      setError(loadError?.response?.data?.detail || 'Unable to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    const intervalId = window.setInterval(loadNotifications, 30000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!open || unreadCount === 0) return

    const syncReadState = async () => {
      try {
        await endpoints.readAllNotifications()
        setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })))
      } catch {
        // Keep panel usable even if read sync fails.
      }
    }

    syncReadState()
  }, [open, unreadCount])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const handleDelete = async (notificationId) => {
    try {
      await endpoints.deleteNotification(notificationId)
      setNotifications((current) => current.filter((notification) => notification.id !== notificationId))
    } catch (deleteError) {
      setError(deleteError?.response?.data?.detail || 'Unable to delete notification.')
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((current) => !current)}
        className={buttonClassName}
      >
        <Bell className={iconClassName} />
        {unreadCount ? <span className={dotClassName}>{unreadCount > 9 ? '9+' : unreadCount}</span> : null}
      </button>

      {open ? (
        <>
          <button className="fixed inset-0 z-40 cursor-default bg-transparent" onClick={() => setOpen(false)} aria-label="Close notifications" />
          <div className={`absolute right-0 top-[calc(100%+12px)] z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl ${panelClassName}`}>
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-neutral-900">Notifications</p>
                <p className="text-xs text-neutral-500">{unreadCount ? `${unreadCount} unread` : 'All caught up'}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-neutral-100 p-2 text-neutral-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[26rem] overflow-y-auto">
              {loading ? <div className="px-4 py-6 text-sm text-neutral-500">Loading notifications...</div> : null}
              {error ? <div className="px-4 py-4 text-sm text-red-600">{error}</div> : null}
              {!loading && !notifications.length ? (
                <div className="px-4 py-8 text-center">
                  <CheckCheck className="mx-auto h-6 w-6 text-neutral-300" />
                  <p className="mt-3 text-sm font-semibold text-neutral-700">No notifications yet</p>
                  <p className="mt-1 text-xs text-neutral-500">New marketplace activity will show up here.</p>
                </div>
              ) : null}

              <div className="divide-y divide-neutral-100">
                {notifications.map((notification) => (
                  <article
                    key={notification.id}
                    className={`px-4 py-3 ${notification.is_read ? 'bg-white' : 'bg-amber-50/50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${notification.is_read ? 'bg-neutral-200' : 'bg-orange-500'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">{notification.title}</p>
                            <p className="mt-1 text-xs leading-5 text-neutral-600">{notification.message}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(notification.id)}
                            className="rounded-full p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-red-500"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                          {formatRelative(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
