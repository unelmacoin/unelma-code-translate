import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

interface RequestBody {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number; // Add temperature as an optional property
  stream?: boolean; // Add stream as an optional property
  reasoning_effort?: "low" | "high"; // Only for some supported model like grok-3-mini-beta and grok-3-mini-fast-beta
}

const createPrompt = (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string
) => {
  if (inputLanguage === 'Natural Language') {
    return endent`
You are an expert programmer in all programming languages. Translate the natural language to "${outputLanguage}" code. Do not include \`\`\`.


Natural language:
${inputCode}

${outputLanguage} code (no \`\`\`):
`;
  } else if (outputLanguage === 'Natural Language') {
    return endent`
You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to natural language in plain English that the average adult could understand. Respond as bullet points starting with -.

${inputLanguage} code:
${inputCode}

Natural language:
`;
  } else {
    return endent`
You are an expert programmer in all programming languages. Translate the "${inputLanguage}" code to "${outputLanguage}" code. Do not include \`\`\`.

${inputLanguage} code:
${inputCode}

${outputLanguage} code (no \`\`\`):
`;
  }
};

export const OpenAIStream = async (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
  model: string,
  key: string
) => {
  if (inputCode.trim() === '') {
    return null;
  }

  const prompt = createPrompt(inputLanguage, outputLanguage, inputCode);

  const messages =
    model === 'o1-preview' || model === 'o1-mini' || model === 'grok-2-latest'
      ? [{ role: 'user', content: prompt }]
      : [
        { role: 'system', content: prompt },
        { role: 'user', content: inputCode },
      ];

  const body: RequestBody = {
    model,
    messages,
  };

  if (model !== 'o1-preview' && model !== 'o1-mini' && model !== 'grok-2-latest' && model !== "grok-3-mini-beta" && model !== 'deepseek-chat' && model !== 'o3-mini') {
    body['temperature'] = 0;
    body['stream'] = true;
  }

  if (model === 'grok-3-mini-beta') {
    body['reasoning_effort'] = 'high';
    body['temperature'] = 0.7;
  }

  const apiUrl = model === 'grok-2-latest' || 'grok-3-mini-beta' ? 'https://api.x.ai/v1/chat/completions' : model === 'deepseek-chat' ? 'https://api.deepseek.com/chat/completions' : 'https://api.openai.com/v1/chat/completions';
  const apiKey = model === 'grok-2-latest' || 'grok-3-mini-beta' ? process.env.X_AI_API_KEY : model === 'deepseek-chat' ? process.env.DEEPSEEK_API_KEY : key || process.env.OPENAI_API_KEY;

  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    const errorMessage = decoder.decode(result?.value) || statusText;
    if (model === 'grok-2-latest' || 'grok-3-mini-beta') {
      throw new Error(`xAI API returned an error: ${errorMessage}`);
    } else if (model === 'deepseek-chat') {
      throw new Error(`DeepSeek API returned an error: ${errorMessage}`);
    } else {
      throw new Error(`OpenAI API returned an error: ${errorMessage}`);
    }
  }
  if (model === 'o1-preview' || model === 'o1-mini' || model === 'grok-2-latest' || model === 'grok-3-mini-beta' || model === 'deepseek-chat' || model === 'o3-mini') {
    const result = await res.json();
    const text = result.choices[0].message.content;
    const queue = encoder.encode(text);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(queue);
        controller.close();
      },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
