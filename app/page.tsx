"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github, Sparkles, ArrowRight, Loader2 } from 'lucide-react'

export default function Home() {
  const [githubUrl, setGithubUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Handle portfolio generation
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!githubUrl) return
    
    setLoading(true)
    try {
      const username = githubUrl.replace('https://github.com/', '').replace(/\/$/, '')
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          githubUrl: githubUrl,
          userId: user?.id 
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        window.location.href = `/portfolio/${username}`
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle sign in
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="border-b bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">PortfolioPro</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={handleSignIn}>
                <Github className="mr-2 h-4 w-4" />
                Sign in with GitHub
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Portfolio Builder
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Turn Your GitHub Into a{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stunning Portfolio
            </span>{' '}
            in 2 Minutes
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Just paste your GitHub URL and get a beautiful, recruiter-ready portfolio page.
          </p>

          {/* Input Form */}
          <form onSubmit={handleGenerate} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="h-12 text-base"
                  disabled={!user}
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                disabled={loading || !user}
                className="h-12 px-8"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Portfolio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            
            {!user && (
              <p className="mt-3 text-sm text-gray-500">
                👆 Sign in with GitHub to get started
              </p>
            )}
          </form>

          {/* Stats */}
          <div className="flex justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <div className="text-sm text-gray-500">Portfolios Built</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2 min</div>
              <div className="text-sm text-gray-500">Average Build Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500">Free to Generate</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}