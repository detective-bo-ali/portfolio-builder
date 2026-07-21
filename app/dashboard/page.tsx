"use client"

import { GitHub, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        setPortfolios(data || [])
      } else {
        // Also show portfolios created without sign-in
        // For now, show a message
        setPortfolios([])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to Save Your Portfolios</h2>
          <p className="text-gray-600 mb-6">
            You generated a portfolio without signing in. 
            Sign in with GitHub to save and manage all your portfolios in one place.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/auth/signin'}
            className="w-full"
          >
            <GitHub className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
          <p className="mt-4 text-sm text-gray-400">
            <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Build New Portfolio
            </Button>
            <Button variant="outline" onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/'
            }}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Portfolios</h2>
        
        {portfolios.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">You haven't built any portfolios yet.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Create Your First Portfolio
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {portfolios.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{p.share_slug}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(p.created_at).toLocaleDateString()}
                    {p.views > 0 && ` • ${p.views} views`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/portfolio/${p.share_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
