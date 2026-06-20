import type { GeneratedDoc } from "./types";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

/**
 * Returns a full, self-contained HTML document — safe to render in an iframe
 * (using srcDoc) for preview, and printable via the browser print dialog
 * which produces a clean A4 PDF without external dependencies.
 */
export function renderDocHtml(doc: GeneratedDoc): string {
  const stampHtml = `
    <section class="stamp-block" aria-label="Vula digjitale e institucionit">
      <img src="/stamps/ashk-demo-stamp.png" alt="Vule demo ASHK" />
      <div class="stamp-caption">Vule demo nga sistemi Smart Dossier</div>
    </section>`;

  const sectionsHtml = doc.sections
    .map(
      (s) => `
      <section class="block">
        ${s.heading ? `<h2>${escape(s.heading)}</h2>` : ""}
        ${s.paragraphs.map((p) => `<p>${escape(p).replace(/\n/g, "<br/>")}</p>`).join("")}
      </section>`,
    )
    .join("");

  const tableHtml = doc.table
    ? `<section class="block">
        ${doc.table.heading ? `<h2>${escape(doc.table.heading)}</h2>` : ""}
        <table class="data">
          <thead><tr>${doc.table.columns.map((c) => `<th>${escape(c)}</th>`).join("")}</tr></thead>
          <tbody>
            ${doc.table.rows
              .map((r) => `<tr>${r.map((c) => `<td>${escape(String(c))}</td>`).join("")}</tr>`)
              .join("")}
          </tbody>
        </table>
      </section>`
    : "";

  const sigHtml = `
    <section class="signatures">
      ${doc.signatures
        .map(
          (sig) => `
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-role">${escape(sig.role)}</div>
          <div class="sig-inst">${escape(sig.institution)}</div>
          ${sig.name ? `<div class="sig-name">${escape(sig.name)}</div>` : ""}
        </div>`,
        )
        .join("")}
    </section>`;

  return `<!doctype html>
<html lang="sq">
<head>
<meta charset="utf-8" />
<title>${escape(doc.title)} — ${escape(doc.number)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body { background: #f4f4f5; margin: 0; padding: 0; }
  body { font-family: "Times New Roman", Georgia, serif; color: #111; }
  .page {
    background: white;
    width: 210mm;
    min-height: 297mm;
    padding: 22mm 20mm;
    margin: 16px auto;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1.5px solid #111;
    padding-bottom: 8mm;
    margin-bottom: 8mm;
  }
  .header .left { font-size: 11pt; line-height: 1.4; }
  .header .left .institution { font-weight: 700; text-transform: uppercase; }
  .header .right { font-size: 10pt; text-align: right; line-height: 1.5; }
  h1 {
    font-size: 14pt;
    text-align: center;
    text-transform: uppercase;
    margin: 6mm 0 2mm;
    letter-spacing: 0.04em;
  }
  .docnum { text-align: center; font-size: 10pt; color: #444; margin-bottom: 8mm; }
  .meta {
    border: 1px solid #d4d4d8;
    padding: 4mm 5mm;
    font-size: 10.5pt;
    line-height: 1.55;
    margin-bottom: 6mm;
  }
  .meta dt { font-weight: 700; display: inline; }
  .meta .row { margin: 0 0 2px; }
  .block { margin: 5mm 0; font-size: 11pt; line-height: 1.55; }
  .block h2 {
    font-size: 11.5pt;
    text-transform: uppercase;
    border-bottom: 1px solid #d4d4d8;
    padding-bottom: 1mm;
    margin: 0 0 3mm;
    letter-spacing: 0.03em;
  }
  .block p { margin: 0 0 2.5mm; text-align: justify; }
  table.data { width: 100%; border-collapse: collapse; font-size: 10.5pt; margin-top: 2mm; }
  table.data th, table.data td {
    border: 1px solid #a1a1aa;
    padding: 2mm 3mm;
    text-align: left;
  }
  table.data th { background: #f4f4f5; font-weight: 700; }
  .deadline {
    background: #fef3c7;
    border-left: 4px solid #b45309;
    padding: 3mm 4mm;
    font-size: 11pt;
    margin: 6mm 0;
    font-weight: 600;
  }
  .legal {
    font-size: 10pt;
    color: #3f3f46;
    margin-top: 6mm;
    border-top: 1px dashed #d4d4d8;
    padding-top: 3mm;
  }
  .legal strong { color: #111; }
  .signatures {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60mm, 1fr));
    gap: 16mm;
    margin-top: 16mm;
  }
  .sig { font-size: 10pt; text-align: center; }
  .sig-line { border-top: 1px solid #111; margin-bottom: 2mm; height: 12mm; }
  .sig-role { font-weight: 700; }
  .sig-inst { color: #3f3f46; }
  .stamp-block {
    width: 52mm;
    margin: 8mm 0 0 auto;
    text-align: center;
    break-inside: avoid;
  }
  .stamp-block img {
    display: block;
    width: 52mm;
    height: 52mm;
    object-fit: contain;
    margin: 0 auto;
  }
  .stamp-caption {
    margin-top: 1mm;
    font-size: 7.5pt;
    color: #71717a;
    font-style: italic;
  }
  .footer {
    margin-top: 14mm;
    border-top: 1px dotted #a1a1aa;
    padding-top: 3mm;
    font-size: 8.5pt;
    color: #6b7280;
    font-style: italic;
  }
  @media print {
    html, body { background: white; }
    .page { box-shadow: none; margin: 0; width: auto; min-height: auto; padding: 18mm 16mm; }
    @page { size: A4; margin: 0; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="left">
        <div class="institution">${escape(doc.institution)}</div>
        <div>Republika e Shqipërisë</div>
      </div>
      <div class="right">
        <div><strong>Nr. prot.:</strong> ${escape(doc.number)}</div>
        <div><strong>Data:</strong> ${escape(fmtDate(doc.date))}</div>
      </div>
    </div>

    <h1>${escape(doc.title)}</h1>
    <div class="docnum">Dosja: ${escape(doc.number.split("/")[0])}</div>

    <div class="meta">
      <div class="row"><dt>Drejtuar:</dt> ${escape(doc.addressee)}${doc.addresseeAddress ? `, ${escape(doc.addresseeAddress)}` : ""}</div>
      <div class="row"><dt>Pasuria:</dt> ${doc.propertyLines.map(escape).join(" · ")}</div>
    </div>

    ${sectionsHtml}
    ${tableHtml}

    ${doc.deadlineLine ? `<div class="deadline">⚠ ${escape(doc.deadlineLine)}</div>` : ""}

    <div class="legal">
      <strong>Bazë ligjore:</strong>
      <ul>
        ${doc.legalBasis.map((l) => `<li>${escape(l)}</li>`).join("")}
      </ul>
    </div>

    ${sigHtml}
    ${stampHtml}

    ${doc.footer ? `<div class="footer">${escape(doc.footer)}</div>` : ""}
  </div>
</body>
</html>`;
}
