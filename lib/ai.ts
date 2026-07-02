import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://portfolio-builder.onrender.com',
  }
})

export async function generateBio(username: string, repos: any[]) {
  try {
    const repoDescriptions = repos
      .slice(0, 5)
      .map(r => `${r.name}: ${r.description || 'No description'}`)
      .join('\n')

    const prompt = `
      Write a professional 3-sentence bio for a developer with these GitHub repos:
      
      ${repoDescriptions}
      
      The bio should:
      1. Showcase their technical expertise
      2. Mention their interests based on their repos
      3. End with a call-to-action for recruiters
      
      Keep it under 100 words. Sound professional but not robotic.
    `

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return completion.choices[0].message.content || 'Developer passionate about building great software.'
  } catch (error) {
    console.error('AI generation error:', error)
    return `${username} is a developer passionate about building innovative software solutions.`
  }
}