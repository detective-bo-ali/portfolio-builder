// This file now just provides a fallback bio
// No external API calls required

export async function generateBio(username: string, repos: any[] = []) {
  // Simple fallback bio - no API call
  return `${username} is a passionate developer building innovative software solutions. Check out their work on GitHub at https://github.com/${username}`
}
