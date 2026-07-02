const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatCompletionOptions = {
  json?: boolean;
  model?: string;
};

export function getDefaultModel() {
  return process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
}

export function getResearchModel() {
  return process.env.OPENROUTER_RESEARCH_MODEL ?? getDefaultModel();
}

export async function chatCompletion(
  messages: ChatMessage[],
  options?: ChatCompletionOptions,
): Promise<string> {
  const apiKey = process.env.OPENROUTER;
  const model = options?.model ?? getDefaultModel();
  if (!apiKey) throw new Error("OPENROUTER is not configured");

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://facility19.com",
      "X-Title": "Facility19",
    },
    body: JSON.stringify({
      model,
      messages,
      ...(options?.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`OpenRouter error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty OpenRouter response");
  return content;
}
