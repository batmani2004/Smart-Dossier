import { createFileRoute } from "@tanstack/react-router";
import {
  buildAkptMapDownload,
  buildAkptMapPrintPage,
  buildCitizenDocumentDownload,
  buildExpeditedProcedureForm,
  buildTrackingPayload,
  buildUploadedDocumentDownload,
  submitCitizenComplaint,
  submitExpeditedProcedureRequest,
} from "@/lib/api/dossiers.functions";

type ComplaintStage = "phase_review" | "final_review";

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export const Route = createFileRoute("/api/public/track/$code")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const url = new URL(request.url);
        if (url.searchParams.get("mapPdf") === "1") {
          const map = buildAkptMapDownload(params.code);
          if (!map) {
            return Response.json({ error: "not_found" }, { status: 404 });
          }
          return new Response(bytesToArrayBuffer(map.body), {
            headers: {
              "content-type": map.mimeType,
              "content-disposition": `attachment; filename="${map.fileName}"`,
              "cache-control": "no-store",
            },
          });
        }
        if (url.searchParams.get("mapPrint") === "1") {
          const print = buildAkptMapPrintPage(params.code);
          if (!print) {
            return Response.json({ error: "not_found" }, { status: 404 });
          }
          return new Response(print.body, {
            headers: {
              "content-type": "text/html; charset=utf-8",
              "content-disposition": `inline; filename="${print.fileName}"`,
              "cache-control": "no-store",
            },
          });
        }
        if (url.searchParams.get("expediteForm") === "1") {
          const form = buildExpeditedProcedureForm(params.code);
          if (!form) {
            return Response.json({ error: "not_found" }, { status: 404 });
          }
          return new Response(bytesToArrayBuffer(form.body), {
            headers: {
              "content-type": form.mimeType,
              "content-disposition": `attachment; filename="${form.fileName}"`,
              "cache-control": "no-store",
            },
          });
        }
        const uploadedDocumentId = url.searchParams.get("uploadedDocumentId");
        if (uploadedDocumentId) {
          const download = buildUploadedDocumentDownload(params.code, uploadedDocumentId);
          if (!download) {
            return Response.json({ error: "document_not_found" }, { status: 404 });
          }
          const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";
          return new Response(bytesToArrayBuffer(download.body), {
            headers: {
              "content-type": download.mimeType,
              "content-disposition": `${disposition}; filename="${download.fileName}"`,
              "cache-control": "no-store",
            },
          });
        }
        const documentId = url.searchParams.get("documentId");
        if (documentId) {
          const download = buildCitizenDocumentDownload(params.code, documentId);
          if (!download) {
            return Response.json({ error: "document_not_found" }, { status: 404 });
          }
          const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";
          return new Response(bytesToArrayBuffer(download.body), {
            headers: {
              "content-type": download.mimeType,
              "content-disposition": `${disposition}; filename="${download.fileName}"`,
              "cache-control": "no-store",
            },
          });
        }

        const payload = buildTrackingPayload(params.code);
        if (!payload) {
          return Response.json({ error: "not_found" }, { status: 404 });
        }
        return Response.json(payload, {
          headers: { "cache-control": "no-store" },
        });
      },
      POST: async ({ params, request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (contentType.includes("multipart/form-data")) {
          const form = await request.formData();
          if (form.get("kind") === "expedite") {
            const bytesToBase64 = (bytes: Uint8Array) => {
              let binary = "";
              const chunkSize = 0x8000;
              for (let i = 0; i < bytes.length; i += chunkSize) {
                binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
              }
              return btoa(binary);
            };
            const fileMeta = async (name: string) => {
              const value = form.get(name);
              if (!value || typeof value === "string") return null;
              const maybe = value as {
                arrayBuffer?: unknown;
                name?: unknown;
                size?: unknown;
                type?: unknown;
              };
              const fileName = typeof maybe.name === "string" ? maybe.name.trim() : "";
              if (!fileName) return null;
              const arrayBuffer =
                typeof maybe.arrayBuffer === "function"
                  ? await maybe.arrayBuffer.call(value)
                  : new ArrayBuffer(0);
              return {
                name: fileName,
                mimeType:
                  typeof maybe.type === "string" && maybe.type.trim()
                    ? maybe.type
                    : "application/octet-stream",
                sizeBytes: typeof maybe.size === "number" ? maybe.size : arrayBuffer.byteLength,
                contentBase64: bytesToBase64(new Uint8Array(arrayBuffer)),
              };
            };
            const reason = form.get("reason");
            const justification = form.get("justification");
            const paymentRequired = form.get("paymentRequired") === "true";
            const requestPdf = await fileMeta("requestPdf");
            const supportingDocument = await fileMeta("supportingDocument");
            const paymentReceipt = await fileMeta("paymentReceipt");
            const validReason =
              reason === "health" ||
              reason === "deadline" ||
              reason === "court" ||
              reason === "social" ||
              reason === "other";
            if (
              !validReason ||
              typeof justification !== "string" ||
              justification.trim().length < 10 ||
              justification.trim().length > 2000 ||
              !requestPdf ||
              !supportingDocument ||
              (paymentRequired && !paymentReceipt)
            ) {
              return Response.json(
                {
                  error: "invalid_expedite_request",
                  message:
                    "Plotesoni formularin PDF, dokumentin provues dhe mandatin kur ka tarife.",
                },
                { status: 400 },
              );
            }
            try {
              const expedited = submitExpeditedProcedureRequest(params.code, {
                reason,
                justification,
                requestPdf,
                supportingDocument,
                paymentRequired,
                paymentReceipt: paymentReceipt ?? undefined,
              });
              if (!expedited) {
                return Response.json({ error: "not_found" }, { status: 404 });
              }
              return Response.json(
                { ok: true, expedited },
                { headers: { "cache-control": "no-store" } },
              );
            } catch (e) {
              return Response.json(
                {
                  error: "invalid_expedite_request",
                  message: e instanceof Error ? e.message : "Kerkesa nuk u pranua.",
                },
                { status: 400 },
              );
            }
          }
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }
        const parsed = (() => {
          if (!body || typeof body !== "object") return null;
          const value = body as Record<string, unknown>;
          const subject = typeof value.subject === "string" ? value.subject.trim() : "";
          const message = typeof value.message === "string" ? value.message.trim() : "";
          const contact = typeof value.contact === "string" ? value.contact.trim() : "";
          const stage: ComplaintStage | undefined =
            value.stage === "final_review" || value.stage === "phase_review"
              ? value.stage
              : undefined;
          if (subject.length < 3 || subject.length > 120) return null;
          if (message.length < 10 || message.length > 2000) return null;
          return { subject, message, contact, stage };
        })();
        if (!parsed) {
          return Response.json(
            { error: "invalid_complaint", message: "Subjekti ose ankesa nuk është e vlefshme." },
            { status: 400 },
          );
        }

        const complaint = submitCitizenComplaint(params.code, parsed);
        if (!complaint) {
          return Response.json({ error: "not_found" }, { status: 404 });
        }
        return Response.json(
          { ok: true, complaint },
          {
            headers: { "cache-control": "no-store" },
          },
        );
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, POST, OPTIONS",
            "access-control-allow-headers": "Content-Type",
          },
        }),
    },
  },
});
