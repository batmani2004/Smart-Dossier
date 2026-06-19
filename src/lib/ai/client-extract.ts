// Browser-side text extraction from PDF/image/text files.
// All heavy libraries are lazy-imported so they never reach the SSR bundle.

export type ClientExtraction = {
  text: string;
  method: "text" | "pdf" | "ocr";
  pages?: number;
  warnings: string[];
};

const TEXT_TYPES = ["text/plain", "text/markdown", "text/csv", "application/json"];
const IMAGE_PREFIX = "image/";

export async function extractTextFromFile(file: File): Promise<ClientExtraction> {
  const warnings: string[] = [];

  if (TEXT_TYPES.includes(file.type) || /\.(txt|md|csv|json)$/i.test(file.name)) {
    return { text: await file.text(), method: "text", warnings };
  }

  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
    const { text, pages, scanned } = await extractPdf(file);
    if (scanned && text.trim().length < 40) {
      // Scanned-looking PDF — try OCR on first page render via canvas + tesseract
      warnings.push("PDF duket i skanuar; po provohet OCR.");
      const ocr = await ocrPdfFirstPages(file, 2);
      return {
        text: ocr.text || text,
        method: "ocr",
        pages,
        warnings: [...warnings, ...ocr.warnings],
      };
    }
    return { text, method: "pdf", pages, warnings };
  }

  if (file.type.startsWith(IMAGE_PREFIX)) {
    const ocr = await ocrImage(file);
    return { text: ocr.text, method: "ocr", warnings: ocr.warnings };
  }

  // Fallback: best-effort text read
  try {
    return {
      text: await file.text(),
      method: "text",
      warnings: ["Tip skedari i panjohur; përdorur si tekst."],
    };
  } catch {
    throw new Error("Tip skedari i pambështetur");
  }
}

async function extractPdf(file: File): Promise<{ text: string; pages: number; scanned: boolean }> {
  const pdfjs = await import("pdfjs-dist");
  (
    pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }
  ).GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((it) => ("str" in it ? (it as { str: string }).str : ""))
      .join(" ");
    out += pageText + "\n";
  }
  const trimmed = out.trim();
  return { text: trimmed, pages: doc.numPages, scanned: trimmed.length < 40 };
}

async function ocrImage(file: File): Promise<{ text: string; warnings: string[] }> {
  const { recognize } = await import("tesseract.js");
  const res = await recognize(file, "eng+sqi");
  return { text: res.data.text ?? "", warnings: [] };
}

async function ocrPdfFirstPages(
  file: File,
  pageCount: number,
): Promise<{ text: string; warnings: string[] }> {
  const pdfjs = await import("pdfjs-dist");
  (
    pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }
  ).GlobalWorkerOptions.workerSrc =
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const { recognize } = await import("tesseract.js");
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const limit = Math.min(pageCount, doc.numPages);
  let text = "";
  const warnings: string[] = [];
  for (let i = 1; i <= limit; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      warnings.push("Canvas i padisponueshëm për OCR.");
      break;
    }
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const blob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), "image/png")!);
    const res = await recognize(blob, "eng+sqi");
    text += (res.data.text ?? "") + "\n";
  }
  return { text, warnings };
}
