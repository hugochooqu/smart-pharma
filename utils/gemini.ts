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

export async function fetchHealthTipFromAI(): Promise<string> {
  const prompt = "Give one short, practical daily health tip in 1-2 sentences.";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const json = await res.json();
  return (
    json.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Take a short walk today to boost your mood and circulation."
  );
}

