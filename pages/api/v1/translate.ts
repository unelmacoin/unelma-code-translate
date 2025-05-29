import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supported language pairs
const SUPPORTED_LANGUAGES = [
  { from: 'python', to: 'javascript' },
  { from: 'javascript', to: 'python' },
  { from: 'python', to: 'java' },
  { from: 'java', to: 'python' },
  { from: 'javascript', to: 'java' },
  { from: 'java', to: 'javascript' },
  { from: 'cobol', to: 'java' },
  { from: 'java', to: 'cobol' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Handle GET request - return supported languages
    return res.status(200).json({ languages: SUPPORTED_LANGUAGES });
  }

  if (req.method === 'POST') {
    try {
      const { source_code, from_lang, to_lang } = req.body;

      // Validate request
      if (!source_code || !from_lang || !to_lang) {
        return res.status(400).json({ 
          error: 'Missing required fields: source_code, from_lang, to_lang' 
        });
      }

      // Check if language pair is supported
      const isSupported = SUPPORTED_LANGUAGES.some(
        (pair) => pair.from === from_lang && pair.to === to_lang
      );

      if (!isSupported) {
        return res.status(400).json({
          error: `Translation from ${from_lang} to ${to_lang} is not supported`,
          supported_pairs: SUPPORTED_LANGUAGES,
        });
      }

      // Create the prompt for the model
      const prompt = `You are an expert programmer in all programming languages. 
Translate the following ${from_lang} code to ${to_lang} code. 
Only respond with the translated code, no explanations or markdown formatting.\n\n${source_code}`;

      // Call the OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview', // Using GPT-4.1
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that translates code between programming languages.' 
          },
          { 
            role: 'user', 
            content: prompt 
          },
        ],
        temperature: 0.1, // Lower temperature for more deterministic output
        max_tokens: 2000,
      });

      const translatedCode = completion.choices[0].message.content?.trim() || '';

      // Return the translated code
      return res.status(200).json({
        source_code,
        from_lang,
        to_lang,
        translated_code: translatedCode,
      });

    } catch (error: any) {
      console.error('Translation error:', error);
      return res.status(500).json({
        error: 'An error occurred while translating the code',
        details: error.message,
      });
    }
  }

  // Handle any other HTTP methods
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
