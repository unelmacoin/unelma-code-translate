import { OpenAI, xAI, OpenAIModel } from '@/types/types';
import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

interface RequestBody {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  stream?: boolean;
  reasoning_effort?: "low" | "high";
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
    model === 'o1-preview' || model === 'o1-mini' || model === 'grok-2-latest' || model === 'grok-3-mini-beta' || model === 'grok-3-latest'
      ? [{ role: 'user', content: prompt }]
      : [
        { role: 'system', content: prompt },
        { role: 'user', content: inputCode },
      ];

  const body: RequestBody = {
    model,
    messages,
  };

  if (model !== 'o1-preview' && model !== 'o1-mini' && model !== 'grok-2-latest' && model !== "grok-3-mini-beta" && model !== 'grok-3-latest' && model !== 'deepseek-chat' && model !== 'o3-mini') {
    body['temperature'] = 0;
    body['stream'] = true;
  }

  if (model === 'grok-3-mini-beta' || model === 'grok-3-latest') {
    // xAI grok-3 variants do not support `reasoning_effort`
    body['temperature'] = 0.7;
  }

  const apiUrl = (() => {
    switch (model) {
      case 'grok-2-latest':
      case 'grok-3-mini-beta':
      case 'grok-3-latest':
        return 'https://api.x.ai/v1/chat/completions';
      case 'deepseek-chat':
        return 'https://api.deepseek.com/chat/completions';
      case 'gpt-5':
        return 'https://api.openai.com/v1/responses';
      default:
        return 'https://api.openai.com/v1/chat/completions';
    }
  })();

  const apiKey = (() => {
    switch (model) {
      case 'grok-2-latest':
      case 'grok-3-mini-beta':
      case 'grok-3-latest':
        return process.env.X_AI_API_KEY;
      case 'deepseek-chat':
        return process.env.DEEPSEEK_API_KEY;
      default:
        return key || process.env.OPENAI_API_KEY;
    }
  })();

  const requestBody: any = model === 'gpt-5'
    ? { model, input: prompt, stream: false }
    : body;

  const res = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    const errorMessage = decoder.decode(result?.value) || statusText;
    if (model === 'grok-2-latest' || model === 'grok-3-mini-beta' || model === 'grok-3-latest') {
      throw new Error(`xAI API returned an error: ${errorMessage}`);
    } else if (model === 'deepseek-chat') {
      throw new Error(`DeepSeek API returned an error: ${errorMessage}`);
    } else {
      throw new Error(`OpenAI API returned an error: ${errorMessage}`);
    }
  }

  if (model === 'gpt-5') {
    const result = await res.json();

    const collectFromOutput = (output: any): string => {
      if (!Array.isArray(output)) return '';
      const parts: string[] = [];
      for (const item of output) {
        if (typeof item?.text === 'string') parts.push(item.text);
        if (Array.isArray(item?.content)) {
          for (const c of item.content) {
            if (typeof c?.text === 'string') parts.push(c.text);
          }
        }
      }
      return parts.join('');
    };

    const collectFromMessage = (msg: any): string => {
      if (!msg) return '';
      if (typeof msg === 'string') return msg;
      if (Array.isArray(msg)) {
        return msg.map((m) => (typeof m?.text === 'string' ? m.text : '')).join('');
      }
      if (Array.isArray(msg?.content)) {
        return msg.content.map((m: any) => (typeof m?.text === 'string' ? m.text : '')).join('');
      }
      return msg?.content || '';
    };

    const text =
      result?.output_text
      || collectFromOutput(result?.output)
      || collectFromMessage(result?.message)
      || result?.content?.[0]?.text
      || result?.choices?.[0]?.message?.content
      || '';

    if (!text || String(text).trim() === '') {
      throw new Error('GPT-5 returned empty output');
    }

    const queue = encoder.encode(text);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(queue);
        controller.close();
      },
    });
  }

  if (model === 'o1-preview' || model === 'o1-mini' || model === 'grok-2-latest' || model === 'grok-3-mini-beta' || model === 'grok-3-latest' || model === 'deepseek-chat' || model === 'o3-mini') {
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
