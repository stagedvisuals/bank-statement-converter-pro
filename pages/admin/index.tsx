import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { 
  MessageCircle, 
  Users, 
  Mail, 
  LogOut, 
  RefreshCw,
  Shield,
  Clock
} from 'lucide-react'

interface Conversation {
  id: string
  session_id: string
  email: string | null
  status: string
  created_at: string
  updated_at: string
  chat_messages: { count: number }[]
}

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: string
  created_at: string
}

interface Stats {
  totalUsers: number
  totalConversations: number
  totalContacts: number
}

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalConversations: 0, totalContacts: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const session = localStorage.getItem('bscpro_session')
    const userData = localStorage.getItem('bscpro_user')
    
    if (!session || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    await fetchAdminData(session)
    setLoading(false)
  }

  const fetchAdminData = async (sessionToken: string) => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch admin data')
      }

      const data = await response.json()
      setConversations(data.conversations || [])
      setContacts(data.contacts || [])
      setStats(data.stats || { totalUsers: 0, totalConversations: 0, totalContacts: 0 })
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('bscpro_session')
    localStorage.removeItem('bscpro_user')
    router.push('/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fintech-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-success border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-navy">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Admin Panel | BSC Pro</title>
      </Head>
      <div className="min-h-screen bg-fintech-bg">
        {/* Header */}
        <nav className="bg-navy text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-success" />
                <span className="text-xl font-bold">BSC Pro Admin</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-light text-sm">{user?.email}</span>
                <Link href="/dashboard" className="text-slate-light hover:text-white transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-light hover:text-white hover:bg-navy-light rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-slate text-sm">Totaal Gebruikers</p>
                  <p className="text-2xl font-bold text-navy">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-slate text-sm">Chat Gesprekken</p>
                  <p className="text-2xl font-bold text-navy">{stats.totalConversations}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 card-shadow border border-fintech-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-slate text-sm">Contact Berichten</p>
                  <p className="text-2xl font-bold text-navy">{stats.totalContacts}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chat Conversations */}
            <div className="bg-white rounded-2xl card-shadow border border-fintech-border overflow-hidden">
              <div className="p-6 border-b border-fintech-border">
                <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-success" />
                  Chat Gesprekken
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-slate">
                    Geen chat gesprekken gevonden
                  </div>
                ) : (
                  <div className="divide-y divide-fintech-border">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="p-4 hover:bg-fintech-bg/50">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-navy text-sm">
                            {conv.email || 'Anoniem'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            conv.status === 'active' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-slate/10 text-slate'
                          }`}>
                            {conv.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {conv.chat_messages?.[0]?.count || 0} berichten
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(conv.updated_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Messages */}
            <div className="bg-white rounded-2xl card-shadow border border-fintech-border overflow-hidden">
              <div className="p-6 border-b border-fintech-border">
                <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                  <Mail className="w-5 h-5 text-warning" />
                  Contact Berichten
                </h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {contacts.length === 0 ? (
                  <div className="p-6 text-center text-slate">
                    Geen contact berichten gevonden
                  </div>
                ) : (
                  <div className="divide-y divide-fintech-border">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="p-4 hover:bg-fintech-bg/50">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-navy text-sm">
                            {contact.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            contact.status === 'new' 
                              ? 'bg-warning/10 text-warning' 
                              : 'bg-success/10 text-success'
                          }`}>
                            {contact.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate mb-1">{contact.email}</p>
                        <p className="text-xs text-slate truncate">{contact.message}</p>
                        <p className="text-xs text-slate mt-1">
                          {formatDate(contact.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
