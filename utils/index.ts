import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
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
  key: string,
) => {
  if (inputCode.trim() === '') {
    return null;
  }

  const prompt = createPrompt(inputLanguage, outputLanguage, inputCode);

  const messages =
    model === 'o1-preview'
      ? [{ role: 'user', content: prompt }]
      : [
          { role: 'system', content: prompt },
          { role: 'user', content: inputCode },
        ];

  const body = {
    model,
    messages,
  };

  if (model !== 'o1-preview') {
    body['temperature'] = 0;
    body['stream'] = true;
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key || process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify(body),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`,
    );
  }

  if (model === 'o1-preview') {
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
