import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateBio } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const { githubUrl, userId } = await req.json()
    
    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    // Extract username
    const username = githubUrl.replace('https://github.com/', '').replace(/\/$/, '')
    
    if (!username) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL. Please use format: https://github.com/username' },
        { status: 400 }
      )
    }
    
    // Check if portfolio already exists
    const { data: existing } = await supabase
      .from('portfolios')
      .select('*')
      .eq('share_slug', username)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        portfolio: existing,
        message: 'Portfolio already exists'
      })
    }

    // Generate bio with AI
    const bio = await generateBio(username, [])

    // Build beautiful HTML portfolio
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${username} | Portfolio</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            padding: 48px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          }
          h1 {
            font-size: 2.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .bio {
            font-size: 1.15rem;
            line-height: 1.7;
            color: #374151;
            border-left: 4px solid #3b82f6;
            padding-left: 1.5rem;
            margin: 1.5rem 0 2rem 0;
          }
          .section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2rem 0 1rem 0;
          }
          .repos {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 1rem 0 2rem 0;
          }
          .repo-card {
            background: #f9fafb;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e5e7eb;
            transition: transform 0.2s;
          }
          .repo-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          .repo-name {
            font-weight: 600;
            color: #1f2937;
            font-size: 0.95rem;
          }
          .repo-desc {
            font-size: 0.85rem;
            color: #6b7280;
            margin-top: 4px;
          }
          .repo-stats {
            display: flex;
            gap: 16px;
            margin-top: 8px;
            font-size: 0.8rem;
            color: #9ca3af;
          }
          .watermark {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 0.85rem;
            color: #9ca3af;
          }
          .watermark a {
            color: #3b82f6;
            text-decoration: none;
          }
          .upgrade-box {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background: #f0fdf4;
            border-radius: 12px;
            border: 1px solid #86efac;
          }
          .upgrade-box h3 {
            font-weight: 600;
            margin-bottom: 4px;
            color: #065f46;
          }
          .upgrade-box p {
            font-size: 0.9rem;
            color: #4b5563;
            margin-bottom: 12px;
          }
          .pay-btn {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 10px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
          }
          .pay-btn:hover {
            background: #2563eb;
          }
          @media (max-width: 640px) {
            .container { padding: 24px; }
            .repos { grid-template-columns: 1fr; }
            h1 { font-size: 2rem; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${username}</h1>
          <div class="bio">${bio}</div>
          
          <div class="section-title">📁 Featured Repositories</div>
          <div class="repos">
            <div class="repo-card">
              <div class="repo-name">🌟 PortfolioPro</div>
              <div class="repo-desc">Built with AI in 2 minutes — ${username}'s portfolio</div>
            </div>
            <div class="repo-card">
              <div class="repo-name">🚀 Coming Soon</div>
              <div class="repo-desc">More repositories will appear here</div>
            </div>
          </div>

          <div class="upgrade-box">
            <h3>✨ Want to remove the watermark?</h3>
            <p>Pay $9 once — lifetime access</p>
            <a href="https://paypal.me/YOUR_PAYPAL_HANDLE/9" target="_blank" class="pay-btn">
              Pay with PayPal
            </a>
            <p style="font-size: 0.8rem; color: #6b7280; margin-top: 8px;">
              UPI: yourname@upi | Pay ₹750
            </p>
          </div>
          
          <div class="watermark">
            Built with <a href="/">PortfolioPro</a> — <a href="/">Generate yours in 2 minutes</a>
          </div>
        </div>
      </body>
      </html>
    `

    // Save to database (userId can be null now)
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId || null,  // Allow null for anonymous users
        html_content: htmlContent,
        share_slug: username,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      portfolio: data,
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate portfolio. Please try again.' },
      { status: 500 }
    )
  }
}
