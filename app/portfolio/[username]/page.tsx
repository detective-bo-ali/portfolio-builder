import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface PortfolioPageProps {
  params: {
    username: string
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params
  
  const { data: portfolio, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('share_slug', username)
    .single()

  if (error || !portfolio) {
    notFound()
  }

  // Increment view count
  await supabase
    .from('portfolios')
    .update({ views: (portfolio.views || 0) + 1 })
    .eq('id', portfolio.id)

  return (
    <div className="min-h-screen bg-white">
      <div dangerouslySetInnerHTML={{ __html: portfolio.html_content }} />
    </div>
  )
}
