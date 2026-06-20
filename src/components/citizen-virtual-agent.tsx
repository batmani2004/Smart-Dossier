import { useState } from "react";
import {
  Activity,
  Bot,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileText,
  LifeBuoy,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FAQ_SUGGESTED_QUESTIONS } from "@/lib/faq";
import { cn } from "@/lib/utils";

type AssistMessage =
  | { role: "user"; text: string }
  | {
      role: "assistant";
      text: string;
      hasEnoughInfo: boolean;
      citations: { id: string; title: string; source: string }[];
      mode: "ai" | "local";
      tone?: "status" | "answer";
    };

type TrackingContext = {
  trackingCode: string;
  process: string;
  status: string;
  currentPhase: { number: number; title: string; institution: string };
  nextMilestone: string | null;
  deadline: { label: string; daysRemaining: number; state: string } | null;
  missingDocuments: { label: string }[];
  requesterVerification: {
    canReceiveDocuments: boolean;
    heldDocumentsCount: number;
    status: string;
  };
  expeditedProcedure: { status: string };
};

type CitizenVirtualAgentProps = {
  defaultTrackingCode?: string;
};

async function askFaq(question: string, trackingCode?: string) {
  const response = await fetch("/api/public/faq-assist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question, trackingCode: trackingCode?.trim() || undefined }),
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    answer?: string;
    hasEnoughInfo?: boolean;
    citations?: { id: string; title: string; source: string }[];
    mode?: "ai" | "local";
    error?: string;
  } | null;
  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error ?? "Ndihmesi nuk u pergjigj.");
  }
  return {
    text: payload.answer ?? "Nuk u gjet pergjigje.",
    hasEnoughInfo: payload.hasEnoughInfo ?? false,
    citations: payload.citations ?? [],
    mode: payload.mode ?? "local",
  };
}

async function fetchTrackingContext(code: string) {
  const response = await fetch(
    `/api/public/track/${encodeURIComponent(code.trim().toUpperCase())}`,
    {
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error("Kodi i gjurmimit nuk u gjet.");
  return (await response.json()) as TrackingContext;
}

function trackingSummary(data: TrackingContext) {
  const missing = data.missingDocuments.map((item) => item.label).join(", ");
  return [
    `E gjeta dosjen ${data.trackingCode}.`,
    `Statusi: ${data.status}.`,
    `Faza aktuale: ${data.currentPhase.number}. ${data.currentPhase.title} (${data.currentPhase.institution}).`,
    data.nextMilestone ? `Hapi tjeter: ${data.nextMilestone}.` : "Nuk ka hap tjeter publik.",
    missing ? `Dokumente qe mungojne: ${missing}.` : "Nuk shfaqen dokumente te munguar.",
    data.deadline
      ? `Afati kryesor: ${data.deadline.label}, ${data.deadline.daysRemaining} dite.`
      : null,
    data.requesterVerification.canReceiveDocuments
      ? "Dokumentet e vulosura mund te shfaqen per shkarkim."
      : "Dokumentet e vulosura hapen pas verifikimit te kerkuesit.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function CitizenVirtualAgent({
  defaultTrackingCode = "EKB-2026-000014",
}: CitizenVirtualAgentProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AssistMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState(defaultTrackingCode);
  const [trackingContext, setTrackingContext] = useState<TrackingContext | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const activeCode = trackingContext?.trackingCode ?? trackingCode;
  const agentActions = [
    {
      label: "Statusi",
      icon: Activity,
      action: () =>
        trackingContext ? submit("Cili eshte statusi i dosjes time?") : lookupTracking(),
    },
    {
      label: "Dokumentet",
      icon: FileText,
      action: () => submit("Cfare dokumentesh mungojne dhe kur i shoh dokumentet e vulosura?"),
    },
    {
      label: "Pershpejtim",
      icon: Zap,
      action: () => submit("Si mund te kerkoj procedure te pershpejtuar?"),
    },
    {
      label: "Ankesa",
      icon: LifeBuoy,
      action: () => submit("Si dergoj ankese per dosjen time?"),
    },
  ];

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    setQuestion("");
    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setLoading(true);
    try {
      const answer = await askFaq(trimmed, activeCode);
      setMessages((current) => [...current, { role: "assistant", tone: "answer", ...answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ndihmesi nuk u pergjigj.");
    } finally {
      setLoading(false);
    }
  }

  async function lookupTracking() {
    const code = trackingCode.trim().toUpperCase();
    if (!code || trackingLoading) return;
    setError(null);
    setTrackingLoading(true);
    try {
      const data = await fetchTrackingContext(code);
      setTrackingCode(data.trackingCode);
      setTrackingContext(data);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: trackingSummary(data),
          hasEnoughInfo: true,
          citations: [
            {
              id: `tracking:${data.trackingCode}`,
              title: `Status publik ${data.trackingCode}`,
              source: "Gjurmimi i dosjes",
            },
          ],
          mode: "local",
          tone: "status",
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kodi nuk u gjet.");
      setTrackingContext(null);
    } finally {
      setTrackingLoading(false);
    }
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-20 right-4 z-[60] flex items-center gap-2 rounded-full border border-primary/20 bg-background/95 p-1.5 pr-3 text-sm font-semibold text-foreground shadow-[0_18px_50px_rgba(6,35,76,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_22px_60px_rgba(6,35,76,0.26)] md:bottom-5 md:right-5"
          aria-label="Hap agjentin virtual"
        >
          <span className="relative block">
            <img
              src="/agents/ada-avatar.png"
              alt="Ada"
              className="size-14 rounded-full border-2 border-destructive bg-white object-cover"
            />
            <span className="absolute bottom-1 right-0 size-3 rounded-full border-2 border-background bg-success" />
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span>Pyet Ada</span>
            <span className="text-[10px] font-medium text-muted-foreground">Asistente AI</span>
          </span>
        </button>
      ) : null}

      {open ? (
        <Card className="fixed bottom-20 left-3 right-3 z-[60] flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden border-primary/20 bg-background shadow-[0_24px_80px_rgba(6,35,76,0.28)] md:bottom-5 md:left-auto md:right-5 md:h-[620px] md:w-[410px]">
          <div className="border-b bg-[var(--brand-navy)] p-3 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src="/agents/ada-avatar.png"
                    alt="Ada"
                    className="size-14 rounded-full border-2 border-white bg-white object-cover shadow-soft"
                  />
                  <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-[var(--brand-navy)] bg-success" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-accent">
                    <Sparkles className="size-3" />
                    Agjent virtual
                  </div>
                  <h2 className="text-base font-semibold leading-tight">Ada per qytetarin</h2>
                  <p className="mt-1 text-xs leading-relaxed text-white/75">
                    Pyet per statusin, dokumentet, afatet, pershpejtimin ose ankesen.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setOpen(false)}
                aria-label="Mbyll agjentin"
                className="size-8 shrink-0 text-white hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="mt-3 rounded-md border border-white/15 bg-white/10 p-2">
              <div className="flex gap-2">
                <Input
                  value={trackingCode}
                  onChange={(event) => setTrackingCode(event.target.value)}
                  placeholder="Kodi i gjurmimit"
                  className="h-9 border-white/15 bg-white text-sm text-foreground"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={lookupTracking}
                  disabled={trackingLoading || !trackingCode.trim()}
                  className="h-9 shrink-0"
                >
                  {trackingLoading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ClipboardList className="size-3.5" />
                  )}
                  <span className="ml-1 hidden sm:inline">Kontrollo</span>
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-white/75">
                {trackingContext ? (
                  <>
                    <CheckCircle2 className="size-3.5 text-success" />
                    <span className="min-w-0 truncate">
                      {trackingContext.trackingCode} - {trackingContext.currentPhase.title}
                    </span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-3.5 text-accent" />
                    <span className="min-w-0 truncate">Kodi personalizon pergjigjet.</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="border-b bg-muted/25 p-3">
            <div className="grid grid-cols-2 gap-2">
              {agentActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    disabled={loading || trackingLoading}
                    className="flex h-9 items-center gap-2 rounded-md border bg-background px-2.5 text-left text-xs font-medium transition hover:bg-muted disabled:opacity-50"
                  >
                    <Icon className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {FAQ_SUGGESTED_QUESTIONS.slice(0, 2).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submit(item)}
                  disabled={loading}
                  className="rounded-md border bg-background px-2 py-1 text-left text-[11px] transition hover:bg-muted disabled:opacity-50"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/10 p-3">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-44 flex-col items-center justify-center rounded-md border border-dashed bg-background/70 p-4 text-center">
                <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="size-5" />
                </div>
                <div className="mt-3 text-sm font-semibold">Si mund t'ju ndihmoj?</div>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                  Shkruani pyetjen ose perdorni veprimet e shpejta.
                </p>
              </div>
            ) : (
              messages.map((message, index) =>
                message.role === "user" ? (
                  <div key={index} className="flex justify-end">
                    <div className="max-w-[86%] rounded-lg rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground shadow-soft">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-[var(--brand-navy)] text-white">
                      {message.tone === "status" ? (
                        <Activity className="size-3.5" />
                      ) : (
                        <Bot className="size-3.5" />
                      )}
                    </div>
                    <div className="max-w-[92%] rounded-lg rounded-tl-sm border bg-background p-3 shadow-soft">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <Badge
                          variant={message.mode === "ai" ? "secondary" : "outline"}
                          className="text-[10px]"
                        >
                          {message.mode === "ai" ? "AI" : "FAQ lokale"}
                        </Badge>
                        {!message.hasEnoughInfo ? (
                          <Badge variant="outline" className="text-[10px]">
                            informacion i kufizuar
                          </Badge>
                        ) : null}
                        {message.citations.map((citation) => (
                          <Badge key={citation.id} variant="secondary" className="text-[10px]">
                            <BookOpen className="size-3 mr-1" />
                            {citation.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Ada po pergatit pergjigjen...
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="border-t px-3 py-2 text-xs text-destructive">{error}</div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submit(question);
            }}
            className="flex gap-2 border-t bg-background p-3"
          >
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Shkruani pyetjen tuaj..."
              disabled={loading}
              className="h-10 text-sm"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !question.trim()}
              className={cn("h-10 px-3", loading && "opacity-80")}
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
              <span className="sr-only">Dergo</span>
            </Button>
          </form>
        </Card>
      ) : null}
    </>
  );
}
