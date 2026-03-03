'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DeveloperPage() {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [generatedSecret, setGeneratedSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'docs'>('keys')

  const getToken = () => {
    try {
      const session = localStorage.getItem('bscpro_session')
      if (!session) return null
      return JSON.parse(session).access_token
    } catch {
      return null
    }
  }

  const fetchData = async () => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const [keysRes, webhooksRes] = await Promise.all([
        fetch('/api/developer/keys', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/developer/webhooks', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      if (keysRes.ok) {
        const keysData = await keysRes.json()
        setApiKeys(keysData.keys || [])
      }

      if (webhooksRes.ok) {
        const webhooksData = await webhooksRes.json()
        setWebhooks(webhooksData.webhooks || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const createKey = async () => {
    const token = getToken()
    if (!token || !newKeyName.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/developer/keys', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newKeyName })
      })

      const data = await res.json()
      if (res.ok) {
        setGeneratedKey(data.key)
        setNewKeyName('')
        fetchData()
      } else {
        alert(data.error || 'Er ging iets mis')
      }
    } catch (error) {
      console.error('Error creating key:', error)
      alert('Er ging iets mis bij het aanmaken van de API key')
    } finally {
      setLoading(false)
    }
  }

  const createWebhook = async () => {
    const token = getToken()
    if (!token || !newWebhookUrl.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/developer/webhooks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: newWebhookUrl,
          events: ['conversion.completed']
        })
      })

      const data = await res.json()
      if (res.ok) {
        setGeneratedSecret(data.webhook?.secret || '')
        setNewWebhookUrl('')
        fetchData()
      } else {
        alert(data.error || 'Er ging iets mis')
      }
    } catch (error) {
      console.error('Error creating webhook:', error)
      alert('Er ging iets mis bij het aanmaken van de webhook')
    } finally {
      setLoading(false)
    }
  }

  const deleteKey = async (id: string) => {
    const token = getToken()
    if (!token) return

    if (!confirm('Weet je zeker dat je deze API key wilt verwijderen?')) {
      return
    }

    try {
      const res = await fetch('/api/developer/keys', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Er ging iets mis bij het verwijderen')
      }
    } catch (error) {
      console.error('Error deleting key:', error)
      alert('Er ging iets mis bij het verwijderen van de API key')
    }
  }

  const deleteWebhook = async (id: string) => {
    const token = getToken()
    if (!token) return

    if (!confirm('Weet je zeker dat je deze webhook wilt verwijderen?')) {
      return
    }

    try {
      const res = await fetch('/api/developer/webhooks', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Er ging iets mis bij het verwijderen')
      }
    } catch (error) {
      console.error('Error deleting webhook:', error)
      alert('Er ging iets mis bij het verwijderen van de webhook')
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Developer Dashboard</h1>
          <p className="text-muted-foreground">Beheer je API keys en webhooks</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {(['keys', 'webhooks', 'docs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#00b8d9] text-[#00b8d9]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'keys' ? 'API Keys' : tab === 'webhooks' ? 'Webhooks' : 'Documentatie'}
            </button>
          ))}
        </div>

        {/* API Keys Tab */}
        {activeTab === 'keys' && (
          <div className="space-y-4">
            {generatedKey && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="text-sm font-bold text-emerald-500 mb-2">
                  ⚠️ Nieuwe API Key — sla hem nu op, je ziet hem maar één keer!
                </p>
                <code className="text-xs bg-muted p-2 rounded block break-all">{generatedKey}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedKey)
                    alert('Gekopieerd naar klembord!')
                  }}
                  className="mt-2 text-xs text-[#00b8d9] hover:underline"
                >
                  Kopieer naar klembord
                </button>
              </div>
            )}

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-medium mb-3">Nieuwe API Key aanmaken</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Naam (bijv. Productie, Test)"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:border-[#00b8d9]"
                />
                <button
                  onClick={createKey}
                  disabled={loading || !newKeyName.trim()}
                  className="px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {loading ? 'Aanmaken...' : 'Aanmaken'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {apiKeys.map(key => (
                <div key={key.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{key.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{key.key_prefix}••••••••</p>
                    <p className="text-xs text-muted-foreground">
                      {key.requests_count || 0} requests · Aangemaakt{' '}
                      {new Date(key.created_at).toLocaleDateString('nl-NL')}
                      {key.last_used_at && (
                        <> · Laatst gebruikt {new Date(key.last_used_at).toLocaleDateString('nl-NL')}</>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteKey(key.id)}
                    className="text-destructive text-xs hover:underline"
                  >
                    Verwijderen
                  </button>
                </div>
              ))}
              {apiKeys.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">Nog geen API keys</p>
              )}
            </div>
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            {generatedSecret && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="text-sm font-bold text-emerald-500 mb-2">
                  ⚠️ Webhook Secret — sla hem nu op, je ziet hem maar één keer!
                </p>
                <code className="text-xs bg-muted p-2 rounded block break-all">{generatedSecret}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSecret)
                    alert('Gekopieerd naar klembord!')
                  }}
                  className="mt-2 text-xs text-[#00b8d9] hover:underline"
                >
                  Kopieer naar klembord
                </button>
              </div>
            )}

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-medium mb-3">Nieuwe Webhook toevoegen</h3>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://jouwapp.nl/webhook"
                  value={newWebhookUrl}
                  onChange={e => setNewWebhookUrl(e.target.value)}
                  className="flex-1 px-4 py-2 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:border-[#00b8d9]"
                />
                <button
                  onClick={createWebhook}
                  disabled={loading || !newWebhookUrl.trim()}
                  className="px-4 py-2 bg-[#00b8d9] text-[#080d14] rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {loading ? 'Toevoegen...' : 'Toevoegen'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Webhooks moeten beginnen met https://
              </p>
            </div>

            <div className="space-y-2">
              {webhooks.map(wh => (
                <div key={wh.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{wh.url}</p>
                      <p className="text-xs text-muted-foreground">
                        Events: {wh.events?.join(', ') || 'conversion.completed'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {wh.failure_count > 0 ? `${wh.failure_count} fouten` : 'Geen fouten'} ·{' '}
                        {wh.last_triggered_at
                          ? `Laatst getriggerd: ${new Date(wh.last_triggered_at).toLocaleDateString('nl-NL')}`
                          : 'Nog niet getriggerd'}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteWebhook(wh.id)}
                      className="text-destructive text-xs hover:underline ml-4"
                    >
                      Verwijderen
                    </button>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      wh.is_active
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {wh.is_active ? 'Actief' : 'Inactief'}
                    </span>
                  </div>
                </div>
              ))}
              {webhooks.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">Nog geen webhooks</p>
              )}
            </div>
          </div>
        )}

        {/* Docs Tab */}
        {activeTab === 'docs' && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-bold mb-2">PDF Converteren via API</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Stuur een POST request naar <code className="bg-muted px-1 rounded">/api/v1/convert</code>
              </p>
              <pre className="bg-muted p-4 rounded-xl text-xs overflow-x-auto">
{`curl -X POST https://www.bscpro.nl/api/v1/convert \\
  -H "x-api-key: bsc_jouw_api_key" \\
  -F "file=@bankafschrift.pdf"`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold mb-2">Response</h3>
              <pre className="bg-muted p-4 rounded-xl text-xs overflow-x-auto">
{`{
  "success": true,
  "data": {
    "bank": "ING",
    "rekeninghouder": "Jan Jansen",
    "transacties": [
      {
        "datum": "2026-01-15",
        "omschrijving": "Albert Heijn",
        "bedrag": -42.50,
        "categorie": "Boodschappen"
      }
    ]
  },
  "credits_remaining": 199
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold mb-2">Webhook Payload</h3>
              <pre className="bg-muted p-4 rounded-xl text-xs overflow-x-auto">
{`{
  "event": "conversion.completed",
  "payload": {
    "transactions_count": 45,
    "bank": "ING",
    "timestamp": "2026-03-03T12:00:00Z"
  }
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold mb-2">Rate Limiting</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maximaal 10 requests per minuut per API key</li>
                <li>• Rate limit headers worden meegestuurd in elke response</li>
                <li>• Bij overschrijding: 429 error met Retry-After header</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Meer informatie</h3>
              <p className="text-sm text-muted-foreground">
                Bekijk de volledige API documentatie op{' '}
                <a href="/api-documentatie" className="text-[#00b8d9] hover:underline">
                  /api-documentatie
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
