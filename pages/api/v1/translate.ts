import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supported language and framework pairs
const SUPPORTED_LANGUAGES = [
  // Python
  { from: 'python', to: 'javascript' },
  { from: 'javascript', to: 'python' },
  { from: 'python', to: 'java' },
  { from: 'java', to: 'python' },
  { from: 'python', to: 'typescript' },
  { from: 'typescript', to: 'python' },
  { from: 'python', to: 'c++' },
  { from: 'c++', to: 'python' },
  { from: 'python', to: 'c#' },
  { from: 'c#', to: 'python' },
  { from: 'python', to: 'ruby' },
  { from: 'ruby', to: 'python' },
  { from: 'python', to: 'go' },
  { from: 'go', to: 'python' },
  
  // JavaScript/TypeScript
  { from: 'javascript', to: 'java' },
  { from: 'java', to: 'javascript' },
  { from: 'javascript', to: 'typescript' },
  { from: 'typescript', to: 'javascript' },
  { from: 'javascript', to: 'c++' },
  { from: 'c++', to: 'javascript' },
  { from: 'javascript', to: 'c#' },
  { from: 'c#', to: 'javascript' },
  
  // PHP translations
  { from: 'php', to: 'javascript' },
  { from: 'javascript', to: 'php' },
  { from: 'php', to: 'typescript' },
  { from: 'typescript', to: 'php' },
  { from: 'php', to: 'python' },
  { from: 'python', to: 'php' },
  
  // Java
  { from: 'java', to: 'c++' },
  { from: 'c++', to: 'java' },
  { from: 'java', to: 'c#' },
  { from: 'c#', to: 'java' },
  { from: 'java', to: 'go' },
  { from: 'go', to: 'java' },
  { from: 'java', to: 'kotlin' },
  { from: 'kotlin', to: 'java' },
  { from: 'java', to: 'scala' },
  { from: 'scala', to: 'java' },
  
  // C/C++
  { from: 'c++', to: 'c' },
  { from: 'c', to: 'c++' },
  { from: 'c++', to: 'c#' },
  { from: 'c#', to: 'c++' },
  { from: 'c++', to: 'rust' },
  { from: 'rust', to: 'c++' },
  
  // Web technologies
  { from: 'html', to: 'javascript' },
  { from: 'javascript', to: 'html' },
  { from: 'css', to: 'scss' },
  { from: 'scss', to: 'css' },
  { from: 'typescript', to: 'javascript' },
  { from: 'javascript', to: 'typescript' },
  
  // Framework translations
  { from: 'flask', to: 'express' },
  { from: 'express', to: 'flask' },
  { from: 'django', to: 'spring' },
  { from: 'spring', to: 'django' },
  { from: 'vue', to: 'react' },
  { from: 'react', to: 'vue' },
  { from: 'jsx', to: 'tsx' },
  { from: 'tsx', to: 'jsx' },
  { from: 'vue', to: 'svelte' },
  { from: 'svelte', to: 'vue' },
  { from: 'angular', to: 'react' },
  { from: 'react', to: 'angular' },
  
  // Scripting languages
  { from: 'ruby', to: 'python' },
  { from: 'python', to: 'ruby' },
  { from: 'php', to: 'python' },
  { from: 'python', to: 'php' },
  { from: 'perl', to: 'python' },
  { from: 'python', to: 'perl' },
  
  // Systems languages
  { from: 'rust', to: 'go' },
  { from: 'go', to: 'rust' },
  { from: 'rust', to: 'c++' },
  { from: 'c++', to: 'rust' },
  { from: 'go', to: 'python' },
  { from: 'python', to: 'go' },
  
  // Legacy languages
  { from: 'cobol', to: 'java' },
  { from: 'java', to: 'cobol' },
  { from: 'fortran', to: 'python' },
  { from: 'python', to: 'fortran' },
  { from: 'pascal', to: 'python' },
  { from: 'python', to: 'pascal' },
  
  // Newer languages
  { from: 'swift', to: 'kotlin' },
  { from: 'kotlin', to: 'swift' },
  { from: 'dart', to: 'javascript' },
  { from: 'javascript', to: 'dart' },
  { from: 'typescript', to: 'dart' },
  { from: 'dart', to: 'typescript' }
];

// Framework-specific translations mapping
const FRAMEWORK_MAPPINGS: Record<string, string> = {
  // Backend frameworks
  'flask': 'python',
  'django': 'python',
  'express': 'javascript',
  'spring': 'java',
  'laravel': 'php',
  'rails': 'ruby',
  'aspnet': 'c#',
  'gin': 'go',
  'actix': 'rust',
  'phoenix': 'elixir',
  
  // Frontend frameworks
  'react': 'javascript',
  'vuejs': 'javascript',
  'angular': 'typescript',
  'svelte': 'javascript',
  'next': 'javascript',
  'nuxt': 'javascript',
  'gatsby': 'javascript',
  'remix': 'javascript',
  'sveltekit': 'javascript',
  'solid': 'javascript',
  
  // Mobile frameworks
  'react-native': 'javascript',
  'flutter': 'dart',
  'xamarin': 'c#',
  'ionic': 'typescript',
  'native': 'javascript',
  
  // File extensions
  'jsx': 'javascript',
  'tsx': 'typescript',
  'vue': 'javascript'
};

// Helper function to get base language from framework
function getBaseLanguage(lang: string): string {
  return FRAMEWORK_MAPPINGS[lang.toLowerCase()] || lang;
}

/**
 * @openapi
 * /api/v1/translate:
 *   get:
 *     summary: Get list of supported languages
 *     description: Returns an array of all supported programming languages for translation
 *     tags:
 *       - Translation
 *     responses:
 *       200:
 *         description: List of supported languages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 languages:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["python", "javascript", "typescript", "java"]
 * 
 *   post:
 *     summary: Translate code between programming languages
 *     description: Translate source code from one programming language to another
 *     tags:
 *       - Translation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - source_code
 *               - from_lang
 *               - to_lang
 *             properties:
 *               source_code:
 *                 type: string
 *                 description: The source code to translate
 *                 example: "def hello():\n    print('Hello, World!')"
 *               from_lang:
 *                 type: string
 *                 description: Source programming language
 *                 example: "python"
 *               to_lang:
 *                 type: string
 *                 description: Target programming language
 *                 example: "javascript"
 *     responses:
 *       200:
 *         description: Successful translation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source_code:
 *                   type: string
 *                   description: Original source code
 *                 from_lang:
 *                   type: string
 *                   description: Source language
 *                 to_lang:
 *                   type: string
 *                   description: Target language
 *                 translated_code:
 *                   type: string
 *                   description: Translated code
 *       400:
 *         description: Bad request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       405:
 *         description: Method not allowed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Method PUT Not Allowed
 */
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

      // Get base languages for framework-specific translations
      const fromBase = getBaseLanguage(from_lang);
      const toBase = getBaseLanguage(to_lang);
      
      // Create the prompt for the model
      let prompt = `You are an expert programmer in all programming languages. `;
      
      // Add framework-specific instructions if applicable
      if (from_lang !== fromBase || to_lang !== toBase) {
        prompt += `Convert the following code from ${from_lang} (${fromBase}) to ${to_lang} (${toBase}). `;
        prompt += `Pay attention to the framework-specific patterns and best practices. `;
      } else {
        prompt += `Translate the following ${from_lang} code to ${to_lang} code. `;
      }
      
      prompt += `Only respond with the translated code, no explanations or markdown formatting.\n\n${source_code}`;

      // Randomly select between gpt-4.1-nano and grok-3
      const models = ['gpt-4.1-nano', 'grok-3'];
      const selectedModel = models[Math.floor(Math.random() * models.length)];
      
      // Prepare the API client based on the selected model
      const useOpenAI = selectedModel.startsWith('gpt');
      const apiKey = useOpenAI ? process.env.OPENAI_API_KEY : process.env.XAI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({
          error: `API key not configured for ${useOpenAI ? 'OpenAI' : 'xAI'}`
        });
      }

      // Call the appropriate API
      const completion = await (useOpenAI 
        ? openai.chat.completions.create({
            model: selectedModel,
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
          })
        : fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: [
                { role: 'system', content: 'You are a helpful assistant that translates code between programming languages.' },
                { role: 'user', content: prompt }
              ],
              temperature: 0.1,
              max_tokens: 2000
            })
          }).then(res => res.json())
      );
      
      // Handle xAI response format if needed
      const translatedCode = useOpenAI 
        ? completion.choices[0]?.message?.content?.trim() || ''
        : completion.choices?.[0]?.message?.content?.trim() || '';

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
