import { useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText, Loader2, Printer, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  aiImproveDocumentWording,
  downloadDocx,
  generateDocument,
  listDocTemplates,
  previewDocument,
} from "@/lib/api/documents.functions";
import { toast } from "sonner";

type ImprovedSection = { heading?: string; paragraphs: string[] };

export function DocGeneratorPanel({ dossierId }: { dossierId: string }) {
  const list = useServerFn(listDocTemplates);
  const preview = useServerFn(previewDocument);
  const improve = useServerFn(aiImproveDocumentWording);
  const generate = useServerFn(generateDocument);
  const dlDocx = useServerFn(downloadDocx);

  const tplQ = useQuery({
    queryKey: ["doc-templates", dossierId],
    queryFn: () => list({ data: { dossierId } }),
  });

  const [template, setTemplate] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [improvedSections, setImprovedSections] = useState<ImprovedSection[] | null>(null);
  const [loading, setLoading] = useState<"preview" | "improve" | "save" | "docx" | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTemplate = useMemo(
    () => template || tplQ.data?.templates[0]?.key || "",
    [template, tplQ.data],
  );

  async function loadPreview(opts?: { useImproved?: boolean }) {
    if (!activeTemplate) return;
    setLoading("preview");
    try {
      const res = await preview({
        data: { dossierId, template: activeTemplate as never },
      });
      if (opts?.useImproved && improvedSections) {
        // local re-render with improved sections — re-call generate as html to merge
        const merged = await generate({
          data: {
            dossierId,
            template: activeTemplate as never,
            improvedSections,
            format: "html",
          },
        });
        setPreviewHtml(merged.html);
      } else {
        setPreviewHtml(res.html);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Dështoi pamja paraprake");
    } finally {
      setLoading(null);
    }
  }

  async function runImprove() {
    if (!activeTemplate) return;
    setLoading("improve");
    try {
      const res = await improve({
        data: { dossierId, template: activeTemplate as never },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setImprovedSections(res.sections);
      // re-render preview with improved sections
      const merged = await generate({
        data: {
          dossierId,
          template: activeTemplate as never,
          improvedSections: res.sections,
          format: "html",
        },
      });
      setPreviewHtml(merged.html);
      toast.success("Formulimi u përmirësua nga AI.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI dështoi");
    } finally {
      setLoading(null);
    }
  }

  async function saveAndAudit() {
    if (!activeTemplate) return;
    setLoading("save");
    try {
      await generate({
        data: {
          dossierId,
          template: activeTemplate as never,
          improvedSections: improvedSections ?? undefined,
          format: "html",
        },
      });
      toast.success("Dokumenti u regjistrua në historik.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Dështoi ruajtja");
    } finally {
      setLoading(null);
    }
  }

  async function exportDocx() {
    if (!activeTemplate) return;
    setLoading("docx");
    try {
      const res = await dlDocx({
        data: {
          dossierId,
          template: activeTemplate as never,
          improvedSections: improvedSections ?? undefined,
        },
      });
      // decode base64 → Blob → trigger download
      const bin = atob(res.base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: res.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Eksporti dështoi");
    } finally {
      setLoading(null);
    }
  }

  function printPreview() {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) {
      toast.error("Hapni pamjen paraprake fillimisht");
      return;
    }
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-info" />
        <h3 className="text-sm font-semibold">Gjenero dokument</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
        <Select
          value={activeTemplate}
          onValueChange={(v) => {
            setTemplate(v);
            setImprovedSections(null);
            setPreviewHtml(null);
          }}
        >
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Zgjidh shabllon…" />
          </SelectTrigger>
          <SelectContent>
            {tplQ.data?.templates.map((t) => (
              <SelectItem key={t.key} value={t.key} className="text-xs">
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPreview()}
            disabled={!activeTemplate || loading !== null}
          >
            {loading === "preview" ? (
              <Loader2 className="size-3.5 mr-1 animate-spin" />
            ) : (
              <Sparkles className="size-3.5 mr-1" />
            )}
            Pamje paraprake
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={runImprove}
            disabled={!activeTemplate || loading !== null}
          >
            {loading === "improve" ? (
              <Loader2 className="size-3.5 mr-1 animate-spin" />
            ) : (
              <Wand2 className="size-3.5 mr-1" />
            )}
            AI përmirëso fjalimin
          </Button>
        </div>
      </div>

      {improvedSections && (
        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
          <Wand2 className="size-3" />
          Po përdoret versioni me formulim të përmirësuar nga AI. Faktet ligjore mbeten të
          pandryshuara.
          <button
            className="underline ml-1"
            onClick={() => {
              setImprovedSections(null);
              loadPreview();
            }}
          >
            Kthe origjinalin
          </button>
        </div>
      )}

      {previewHtml ? (
        <div className="border rounded-md overflow-hidden bg-muted/30">
          <iframe
            ref={iframeRef}
            title="Pamja paraprake e dokumentit"
            srcDoc={previewHtml}
            className="w-full h-[600px] bg-white"
            sandbox="allow-same-origin allow-modals allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-6 text-center text-xs text-muted-foreground">
          Zgjidh një shabllon dhe shtyp <strong>Pamje paraprake</strong> për ta parë dokumentin.
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={printPreview} disabled={!previewHtml}>
          <Printer className="size-3.5 mr-1" />
          Printo / PDF
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={exportDocx}
          disabled={!activeTemplate || loading !== null}
        >
          {loading === "docx" ? (
            <Loader2 className="size-3.5 mr-1 animate-spin" />
          ) : (
            <Download className="size-3.5 mr-1" />
          )}
          Shkarko DOCX
        </Button>
        <Button size="sm" onClick={saveAndAudit} disabled={!activeTemplate || loading !== null}>
          {loading === "save" ? (
            <Loader2 className="size-3.5 mr-1 animate-spin" />
          ) : (
            <FileText className="size-3.5 mr-1" />
          )}
          Ruaj në dosje
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Printimi nga browser-i jep PDF të pastër A4. Çdo gjenerim regjistrohet si{" "}
        <em>AuditEvent</em>.
      </p>
    </Card>
  );
}
