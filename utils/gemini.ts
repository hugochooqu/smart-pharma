import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY
export async function getHerbalRecommendation(prompt: string): Promise<string> {
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const res = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
  } catch (err: any ) {
    console.error('Gemini error:', err.response?.data || err.message);
    return 'Error fetching recommendation.';
  }
}
