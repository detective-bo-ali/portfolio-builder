"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      // Get all portfolios (since no auth, show all)
      const { data } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      
      setPortfolios(data || [])
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">PortfolioPro</h1>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Build New Portfolio
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Recent Portfolios</h2>
        
        {portfolios.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-gray-500">No portfolios built yet.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/'}>
              Build Your Portfolio
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
