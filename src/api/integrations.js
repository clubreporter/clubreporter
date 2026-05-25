import { uploadFile } from '@/api/storage';

export const Core = {
  UploadFile: uploadFile,

  async InvokeLLM({ prompt }) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      return (
        'AI match reports require VITE_OPENAI_API_KEY in your .env file. ' +
        'Until then, edit the report manually using the timeline above.'
      );
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional GAA sports journalist.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'AI request failed');
    }

    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() || '';
  },
};
