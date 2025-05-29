import { NextResponse } from 'next/server';
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

export async function POST(req: Request) {
  try {
    const { source_code, from_lang, to_lang } = await req.json();

    // Validate request
    if (!source_code || !from_lang || !to_lang) {
      return NextResponse.json(
        { error: 'Missing required fields: source_code, from_lang, to_lang' },
        { status: 400 }
      );
    }

    // Check if language pair is supported
    const isSupported = SUPPORTED_LANGUAGES.some(
      (pair) => pair.from === from_lang && pair.to === to_lang
    );

    if (!isSupported) {
      return NextResponse.json(
        {
          error: `Translation from ${from_lang} to ${to_lang} is not supported`,
          supported_pairs: SUPPORTED_LANGUAGES,
        },
        { status: 400 }
      );
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
    return NextResponse.json({
      source_code,
      from_lang,
      to_lang,
      translated_code: translatedCode,
    });

  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while translating the code',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Add GET endpoint to list supported languages
export async function GET() {
  return NextResponse.json({ languages: SUPPORTED_LANGUAGES });
}
