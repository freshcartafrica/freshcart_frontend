import { endpoints } from '../../lib/api'
import { dashboardPath } from '../../lib/shopper'

export async function finalizeSession({
  email,
  password,
  setSession,
  navigate,
  destination = 'dashboard',
  resolvePath,
  onResolvedUser,
}) {
  const tokenResponse = await endpoints.login({ email, password })
  const token = tokenResponse.data.access_token
  setSession({ token, user: null })

  const me = await endpoints.me()
  setSession({ token, user: me.data })
  if (onResolvedUser) {
    await onResolvedUser(me.data)
  }

  const nextPath = resolvePath
    ? resolvePath(me.data)
    : destination === 'dashboard'
      ? dashboardPath(me.data)
      : '/onboarding'

  navigate(nextPath, { replace: true })
}
