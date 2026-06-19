import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Loader2,
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
  "Çfarë mungon për hapin tjetër?",
  "Pse është kjo dosje e bllokuar?",
  "Cili është afati i ankimit?",
  "Si llogaritet vlera e privatizimit?",
  "Cili institucion ka radhën?",
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
  const invalidate = () => qc.invalidateQueries({ queryKey: ["dossier", dossier.id] });

  // --- Summary ---
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // --- Next step ---
  const [nextStep, setNextStep] = useState<NextStepResult | null>(null);
  const [nextStepSource, setNextStepSource] = useState<string | null>(null);
  const [nextStepLoading, setNextStepLoading] = useState(false);

  // --- Assistant chat ---
  const [messages, setMessages] = useState<AssistMsg[]>([]);
  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  async function runSummary() {
    setSummaryLoading(true);
    try {
      const r = await postJson<{ summary: string }>("/api/ai/summary", { id: dossier.id });
      setSummary(r.summary);
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gabim");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function runNextStep() {
    setNextStepLoading(true);
    try {
      const r = await postJson<{ result: NextStepResult; source?: string }>("/api/ai/next-step", {
        id: dossier.id,
      });
      setNextStep(r.result);
      setNextStepSource(r.source ?? r.result.legalOrProcessSource);
      invalidate();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gabim");
    } finally {
      setNextStepLoading(false);
    }
  }

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

  return (
    <div className="space-y-3">
      {/* Summary + Next step row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScrollText className="size-4 text-info" />
              <h3 className="text-sm font-semibold">Përmbledhje për menaxherin</h3>
            </div>
            <Button size="sm" variant="outline" onClick={runSummary} disabled={summaryLoading}>
              {summaryLoading ? (
                <Loader2 className="size-3.5 mr-1 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 mr-1" />
              )}
              Gjenero
            </Button>
          </div>
          {summary ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Klikoni “Gjenero” për përmbledhje 3-5 fjali (ku ndodhet, çfarë mungon, rreziku, hapi
              tjetër).
            </p>
          )}
        </Card>

        <Card className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRight className="size-4 text-info" />
              <h3 className="text-sm font-semibold">Hapi tjetër i sugjeruar</h3>
            </div>
            <Button size="sm" variant="outline" onClick={runNextStep} disabled={nextStepLoading}>
              {nextStepLoading ? (
                <Loader2 className="size-3.5 mr-1 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 mr-1" />
              )}
              Sugjero
            </Button>
          </div>
          {nextStep ? (
            <div className="text-xs space-y-1.5">
              <p className="text-sm">{nextStep.nextAction}</p>
              <Row label="Institucioni">{nextStep.responsibleInstitution}</Row>
              <Row label="Dokumente">
                {nextStep.requiredDocuments.length ? nextStep.requiredDocuments.join(", ") : "—"}
              </Row>
              <Row label="Afat">{nextStep.deadline ?? "—"}</Row>
              <Row label="Rrezik">
                <span className="flex items-start gap-1">
                  <TriangleAlert className="size-3 text-warning mt-0.5 shrink-0" />
                  {nextStep.risk}
                </span>
              </Row>
              <Row label="Burimi">
                <Badge variant="secondary" className="text-[10px]">
                  <BookOpen className="size-3 mr-1" />
                  {nextStepSource ?? nextStep.legalOrProcessSource}
                </Badge>
              </Row>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Sugjerimi bazohet në procesin përkatës — kurrë jashtë tij.
            </p>
          )}
        </Card>
      </div>

      {/* Process Assistant (RAG) */}
      <Card className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-info" />
          <h3 className="text-sm font-semibold">Asistenti i procesit (RAG)</h3>
          <Badge variant="outline" className="text-[10px]">
            vetëm me burime
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={askLoading}
              className="text-[11px] px-2 py-1 rounded-full border bg-muted/40 hover:bg-muted transition disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[28rem] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Bëj një pyetje për procesin ose këtë dosje. Asistenti përgjigjet vetëm nga përkufizimi
              i procesit, baza ligjore, pikat kritike dhe faktet e dosjes.
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
                <div key={i} className="rounded-md border bg-muted/30 p-2.5 text-sm space-y-1.5">
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {!m.hasEnoughInfo ? (
                    <p className="text-[11px] text-warning flex items-center gap-1">
                      <TriangleAlert className="size-3" />
                      Platforma nuk ka informacion të mjaftueshëm për këtë pyetje.
                    </p>
                  ) : null}
                  {m.citations.length ? (
                    <div className="pt-1 border-t flex flex-wrap gap-1">
                      {m.citations.map((c) => (
                        <Badge key={c.id} variant="secondary" className="text-[10px]">
                          <BookOpen className="size-3 mr-1" />
                          {c.title}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ),
            )
          )}
          {askLoading ? (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" /> Duke kërkuar burimet…
            </div>
          ) : null}
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
            placeholder="Bëj një pyetje për procesin ose dosjen…"
            className="h-9 text-sm"
            disabled={askLoading}
          />
          <Button size="sm" type="submit" disabled={askLoading || !question.trim()}>
            <Send className="size-3.5 mr-1" />
            Dërgo
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3 text-muted-foreground text-[11px] uppercase tracking-wide">
        {label}
      </div>
      <div className="col-span-9 text-xs">{children}</div>
    </div>
  );
}
