import { request as undiciRequest } from 'undici';

type OpenAiArgs = {
  model: string;
  system: string;
  user: string;
};

const getApiKey = (): string => {
  const key = process.env.OPENAI_API_KEY || '';
  if (!key) throw new Error('Missing OPENAI_API_KEY');
  return key;
};

const getEndpoint = (): string =>
  process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';

export const getAiText = async (args: OpenAiArgs): Promise<string> => {
  const apiKey = getApiKey();
  const endpoint = getEndpoint();
  const body = {
    model: args.model,
    messages: [
      { role: 'system', content: args.system },
      { role: 'user', content: args.user }
    ],
    temperature: 0.2
  };
  const res = await undiciRequest(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });
  if (res.statusCode >= 300) throw new Error(`OpenAI HTTP ${res.statusCode}`);
  const json = await res.body.json() as { choices: { message: { content: string } }[] };
  const content = json.choices?.[0]?.message?.content || '';
  if (!content) throw new Error('Empty AI response');
  return content;
};
