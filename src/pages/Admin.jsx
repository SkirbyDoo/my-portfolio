import { useAuth } from '../hooks/useAuth'
import AdminLogin from '../admin/AdminLogin'
import AdminPanel from '../admin/AdminPanel'

export default function Admin() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return session ? <AdminPanel /> : <AdminLogin />
}
