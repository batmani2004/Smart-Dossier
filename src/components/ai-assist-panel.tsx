import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Loader2,
  RefreshCw,
  ScrollText,
  Send,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Dossier = { id: string; trackingCode: string };
type Props = { dossier: Dossier };

type Citation = { id: string; title: string; source: string };
type NextStepResult = {
  nextAction: string;
  responsibleInstitution: string;
  requiredDocuments: string[];
  deadline: string | null;
  risk: string;
  legalOrProcessSource: string;
};
type AssistMsg =
  | { role: "user"; text: string }
  | {
      role: "assistant";
      text: string;
      hasEnoughInfo: boolean;
      citations: Citation[];
    };

const EXAMPLES = [
  "Cfare mungon per hapin tjeter?",
  "Pse eshte dosja e bllokuar?",
  "Cili eshte afati i ankimit?",
  "Si llogaritet vlera e privatizimit?",
  "Cili institucion ka radhen?",
];

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok || (json as { ok?: boolean }).ok === false) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }
  return json;
}

export function AiAssistPanel({ dossier }: Props) {
  const qc = useQueryClient();
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [nextStep, setNextStep] = useState<NextStepResult | null>(null);
  const [nextStepSource, setNextStepSource] = useState<string | null>(null);
  const [nextStepLoading, setNextStepLoading] = useState(false);
  const [messages, setMessages] = useState<AssistMsg[]>([]);
  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  const invalidate = useCallback(
    () => qc.invalidateQueries({ queryKey: ["dossier", dossier.id] }),
    [dossier.id, qc],
  );

  const refreshAiReview = useCallback(
    async (showToast = true) => {
      setSummaryLoading(true);
      setNextStepLoading(true);
      const [summaryRes, nextStepRes] = await Promise.allSettled([
        postJson<{ summary: string }>("/api/ai/summary", { id: dossier.id }),
        postJson<{ result: NextStepResult; source?: string }>("/api/ai/next-step", {
          id: dossier.id,
        }),
      ]);

      if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.summary);
      if (nextStepRes.status === "fulfilled") {
        setNextStep(nextStepRes.value.result);
        setNextStepSource(nextStepRes.value.source ?? nextStepRes.value.result.legalOrProcessSource);
      }

      if (summaryRes.status === "fulfilled" || nextStepRes.status === "fulfilled") {
        invalidate();
        if (showToast) toast.success("AI rifreskoi udhezimin e dosjes.");
      } else if (showToast) {
        toast.error(summaryRes.reason instanceof Error ? summaryRes.reason.message : "AI deshtoi");
      }

      setSummaryLoading(false);
      setNextStepLoading(false);
    },
    [dossier.id, invalidate],
  );

  useEffect(() => {
    setSummary(null);
    setNextStep(null);
    setNextStepSource(null);
    void refreshAiReview(false);
  }, [refreshAiReview]);

  async function ask(text: string) {
    if (!text.trim()) return;
    const userMsg: AssistMsg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");
    setAskLoading(true);
    try {
      const r = await postJson<{
        answer: string;
        citations: Citation[];
        hasEnoughInfo: boolean;
      }>("/api/ai/assist", { id: dossier.id, question: text });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: r.answer,
          citations: r.citations,
          hasEnoughInfo: r.hasEnoughInfo,
        },
      ]);
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gabim");
    } finally {
      setAskLoading(false);
    }
  }

  const reviewLoading = summaryLoading || nextStepLoading;

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-primary/20">
        <div className="flex flex-col gap-3 border-b bg-primary/5 p-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Bot className="size-4" />
              AI per operatorin
              <Badge variant="secondary" className="text-[10px]">
                auto
              </Badge>
            </div>
            <h3 className="mt-1 text-base font-semibold">Udhezim i shpejte pa klikime shtese</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refreshAiReview(true)}
            disabled={reviewLoading}
            className="w-fit"
          >
            {reviewLoading ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-1.5 size-3.5" />
            )}
            Rifresko AI
          </Button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-3">
            <div className="mb-2 flex items-center gap-2">
              <ScrollText className="size-4 text-primary" />
              <h4 className="text-sm font-semibold">Permbledhje operative</h4>
            </div>
            {summaryLoading && !summary ? (
              <LoadingLine text="AI po lexon dosjen..." />
            ) : summary ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                AI do te shfaqe ketu vendndodhjen e dosjes, cfare mungon, rrezikun dhe veprimin
                tjeter.
              </p>
            )}
          </div>

          <div className="border-t bg-muted/25 p-3 lg:border-l lg:border-t-0">
            <div className="mb-2 flex items-center gap-2">
              <ArrowRight className="size-4 text-primary" />
              <h4 className="text-sm font-semibold">Hapi tjeter</h4>
            </div>
            {nextStepLoading && !nextStep ? (
              <LoadingLine text="AI po zgjedh veprimin e radhes..." />
            ) : nextStep ? (
              <div className="space-y-2 text-xs">
                <p className="text-sm font-medium leading-relaxed">{nextStep.nextAction}</p>
                <Row label="Institucioni">{nextStep.responsibleInstitution}</Row>
                <Row label="Dokumente">
                  {nextStep.requiredDocuments.length ? nextStep.requiredDocuments.join(", ") : "-"}
                </Row>
                <Row label="Afat">{nextStep.deadline ?? "-"}</Row>
                <Row label="Rrezik">
                  <span className="flex items-start gap-1">
                    <TriangleAlert className="mt-0.5 size-3 shrink-0 text-warning" />
                    {nextStep.risk}
                  </span>
                </Row>
                <Row label="Burimi">
                  <Badge variant="secondary" className="text-[10px]">
                    <BookOpen className="mr-1 size-3" />
                    {nextStepSource ?? nextStep.legalOrProcessSource}
                  </Badge>
                </Row>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Sugjerimi kufizohet te procesi, baza ligjore dhe faktet e dosjes.
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card className="space-y-3 p-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">Pyetje me burime</h3>
            <Badge variant="outline" className="text-[10px]">
              RAG
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                disabled={askLoading}
                className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] transition hover:bg-muted disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[24rem] space-y-2 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Pyet vetem kur duhet sqarim. Pergjigja vjen nga procesi, baza ligjore, pikat kritike
              dhe faktet e dosjes.
            </p>
          ) : (
            messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="text-sm">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Pyetja
                  </span>
                  <p className="font-medium">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="space-y-1.5 rounded-md border bg-muted/30 p-2.5 text-sm">
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {!m.hasEnoughInfo ? (
                    <p className="flex items-center gap-1 text-[11px] text-warning">
                      <TriangleAlert className="size-3" />
                      Platforma nuk ka informacion te mjaftueshem per kete pyetje.
                    </p>
                  ) : null}
                  {m.citations.length ? (
                    <div className="flex flex-wrap gap-1 border-t pt-1">
                      {m.citations.map((c) => (
                        <Badge key={c.id} variant="secondary" className="text-[10px]">
                          <BookOpen className="mr-1 size-3" />
                          {c.title}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ),
            )
          )}
          {askLoading ? <LoadingLine text="Duke kerkuar burimet..." /> : null}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex gap-2"
        >
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Pyetje per procesin ose dosjen..."
            className="h-9 text-sm"
            disabled={askLoading}
          />
          <Button size="sm" type="submit" disabled={askLoading || !question.trim()}>
            <Send className="mr-1 size-3.5" />
            Dergo
          </Button>
        </form>
      </Card>
    </div>
  );
}

function LoadingLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Loader2 className="size-3 animate-spin" />
      {text}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3 text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="col-span-9 text-xs">{children}</div>
    </div>
  );
}
