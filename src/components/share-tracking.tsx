import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Copy, QrCode, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function ShareTracking({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/track/${encodeURIComponent(code)}`
      : `/track/${encodeURIComponent(code)}`;

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, {
      width: 220,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    }).catch(() => undefined);
  }, [open, url]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Linku u kopjua");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("S'u arrit të kopjohet");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <QrCode className="size-3.5 mr-1.5" /> Linku për qytetarin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Gjurmim për qytetarin</DialogTitle>
          <DialogDescription>
            Ndaje këtë QR ose link me qytetarin. Tregon vetëm informacion publik.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-lg border bg-white p-3">
            <canvas ref={canvasRef} className="block" aria-label="QR code" />
          </div>
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Kodi i gjurmimit
            </div>
            <div className="font-mono text-base font-semibold">{code}</div>
          </div>
          <div className="w-full rounded-md border bg-muted/40 px-3 py-2 text-xs font-mono break-all">
            {url}
          </div>
          <div className="flex w-full gap-2">
            <Button size="sm" className="flex-1" onClick={copy}>
              {copied ? (
                <>
                  <Check className="size-3.5 mr-1.5" /> Kopjuar
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1.5" /> Kopjo linkun
                </>
              )}
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={url} target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
