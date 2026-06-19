// Shared OpenAI call helper used by server routes (summary, next-step, assist).
// Reads OPENAI_API_KEY / OPENAI_MODEL inside the request handler.

export type OpenAiCall = {
  system: string;
  user: string;
  jsonMode?: boolean;
  temperature?: number;
};

export type OpenAiResult =
  | { ok: true; content: string; model: string }
  | { ok: false; error: string; status?: number };

export async function callOpenAi({
  system,
  user,
  jsonMode,
  temperature = 0.2,
}: OpenAiCall): Promise<OpenAiResult> {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!key) {
    return {
      ok: false,
      error:
        "OPENAI_API_KEY mungon. Vendoseni në variablat e mjedisit për të aktivizuar funksionet e AI.",
    };
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        status: res.status,
        error: `OpenAI ${res.status}: ${body.slice(0, 300)}`,
      };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    if (!content.trim()) return { ok: false, error: "empty model response" };
    return { ok: true, content, model };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}
