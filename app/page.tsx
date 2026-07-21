"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'

export default function Home() {
  const [githubUrl, setGithubUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!githubUrl) return
    
    setLoading(true)
    setError('')
    
    try {
      const username = githubUrl.replace('https://github.com/', '').replace(/\/$/, '')
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        window.location.href = `/portfolio/${username}`
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error generating portfolio:', error)
      setError('Failed to generate portfolio. Please check your URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="border-b bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">PortfolioPro</h1>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Sign In (Optional)
            </Button>
          </div>
        </div>
      </nav>

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
            Just paste your GitHub URL and get a beautiful, recruiter-ready portfolio page — automatically generated with AI.
            <span className="block text-sm text-gray-400 mt-2">No sign-up required to generate.</span>
          </p>

          <form onSubmit={handleGenerate} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                disabled={loading}
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
            
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
            
            <p className="mt-3 text-xs text-gray-400">
              🔗 Sign in (optional) to save and manage your portfolios
            </p>
          </form>

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
