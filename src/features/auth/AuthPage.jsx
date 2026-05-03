import { Navigate } from 'react-router-dom'
import { postAuthPath } from '../../lib/shopper'
import { useAuthStore } from '../../store/authStore'

export default function AuthPage() {
  const { token, user, onboardingRecords } = useAuthStore()

  if (token && user) {
    return <Navigate replace to={postAuthPath(user, onboardingRecords)} />
  }

  return <Navigate replace to="/login" />
}
