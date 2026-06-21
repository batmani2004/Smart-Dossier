import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn, i as Input, n as Card, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { $ as FileUp, C as Scale, Dt as CalendarClock, J as IdCard, K as Landmark, N as MapPinned, Ot as Building2, T as RefreshCw, _ as ShieldCheck, b as Send, ct as Download, dt as Clock, et as FileText, ht as Circle, it as Eye, j as MessageSquare, l as UserCheck, lt as CreditCard, nt as FileExclamationPoint, ot as ExternalLink, vt as CircleCheck, yt as CircleAlert, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Checkbox } from "./checkbox-CjIFYTlP.mjs";
import { t as Label } from "./label-CgYZPzcy.mjs";
import { n as Badge, r as CitizenVirtualAgent, t as AppShell } from "./app-shell-zR2LMms-.mjs";
import { t as Textarea } from "./textarea-DCzrjZMV.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CLY2nigl.mjs";
import { t as ParcelMap } from "./parcel-polygon-overlay-BUAQsn-y.mjs";
import { t as Route } from "./track._code-CdNSu4I9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track2._code-D7R1WY72.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REQUESTER_STATUS_SQ = {
	pending: "Ne pritje",
	verified: "E verifikuar",
	needs_documents: "Kerkohet plotesim",
	rejected: "E refuzuar"
};
var EXPEDITE_STATUS_SQ = {
	not_requested: "Pa kerkese",
	submitted: "Ne shqyrtim",
	approved: "E miratuar",
	rejected: "E refuzuar"
};
var EXPEDITE_REASONS = [
	{
		value: "deadline",
		label: "Afat ligjor ose administrativ i afert"
	},
	{
		value: "health",
		label: "Gjendje shendetesore / sociale"
	},
	{
		value: "court",
		label: "Vendim gjykate / detyrim institucional"
	},
	{
		value: "social",
		label: "Rast social i dokumentuar"
	},
	{
		value: "other",
		label: "Arsye tjeter e dokumentuar"
	}
];
var STATUS_SQ = {
	draft: "Në hartim",
	in_progress: "Në proces",
	blocked: "E bllokuar",
	awaiting_external: "Në pritje të institucionit",
	completed: "E përfunduar",
	rejected: "E refuzuar"
};
var COMPLAINT_STATUS_SQ = {
	new: "E dërguar",
	in_review: "Në shqyrtim",
	resolved: "E mbyllur"
};
function fmtDate(iso) {
	try {
		return new Date(iso).toLocaleDateString("sq-AL", {
			day: "2-digit",
			month: "short",
			year: "numeric"
		});
	} catch {
		return iso;
	}
}
function fmtDateTime(iso) {
	try {
		return new Date(iso).toLocaleString("sq-AL", {
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {
		return iso;
	}
}
function citizenDocumentUrl(code, documentId, download = false) {
	const params = new URLSearchParams({ documentId });
	if (download) params.set("download", "1");
	return `/api/public/track/${encodeURIComponent(code)}?${params.toString()}`;
}
function uploadedDocumentUrl(code, documentId, download = false) {
	const params = new URLSearchParams({ uploadedDocumentId: documentId });
	if (download) params.set("download", "1");
	return `/api/public/track/${encodeURIComponent(code)}?${params.toString()}`;
}
function expediteFormUrl(code) {
	return `/api/public/track/${encodeURIComponent(code)}?expediteForm=1`;
}
function mapPdfUrl(code) {
	return `/api/public/track/${encodeURIComponent(code)}?mapPdf=1`;
}
function mapPrintUrl(code) {
	return `/api/public/track/${encodeURIComponent(code)}?mapPrint=1`;
}
function requesterDocIcon(type) {
	if (type === "id_card_copy") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, { className: "size-3.5" });
	if (type === "legal_authorization") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" });
}
function stripForClientPdf(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7e]/g, "-");
}
function escapeClientPdfText(value) {
	return stripForClientPdf(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function wrapPdfLine(value, width = 76) {
	const words = stripForClientPdf(value).split(/\s+/).filter(Boolean);
	const lines = [];
	let line = "";
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (next.length > width && line) {
			lines.push(line);
			line = word;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines.length ? lines : [""];
}
function buildClientPdf(content) {
	const objects = [
		"<< /Type /Catalog /Pages 2 0 R >>",
		"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
		"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
		"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
		`<< /Length ${content.length} >>\nstream\n${content}\nendstream`
	];
	let pdf = "%PDF-1.4\n";
	const offsets = [];
	objects.forEach((object, index) => {
		offsets.push(pdf.length);
		pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
	});
	const xrefOffset = pdf.length;
	pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
	offsets.forEach((offset) => {
		pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
	});
	pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
	return new TextEncoder().encode(pdf);
}
function bytesToArrayBuffer(bytes) {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	return copy.buffer;
}
function buildCompletedExpeditePdfFile(input) {
	const content = [
		"q",
		"0.98 0.99 1 rg",
		"36 36 523 770 re f",
		"Q",
		"q",
		"0.01 0.18 0.35 rg",
		"BT",
		[
			"SMART DOSSIER",
			"FORMULAR I PLOTESUAR PER PROCEDURE TE PERSHPEJTUAR",
			"",
			`Kodi i dosjes: ${input.trackingCode}`,
			`Arsyeja: ${input.reasonLabel}`,
			`Tarife: ${input.paymentRequired ? `${(input.paymentAmountAll ?? 1e3).toLocaleString("sq-AL")} ALL` : "Nuk aplikohet"}`,
			`Data e plotesimit: ${(/* @__PURE__ */ new Date()).toLocaleDateString("sq-AL")}`,
			"",
			"Pershkrimi i arsyes:",
			...wrapPdfLine(input.justification),
			"",
			"Dokumentacioni qe bashkelidhet:",
			"1. Dokument provues per arsyen e pershpejtimit",
			input.paymentRequired ? "2. Mandat pagese per tarifen zyrtare" : "2. Pa mandat pagese",
			"",
			"Deklaroj se te dhenat jane te sakta dhe kerkoj shqyrtim te pershpejtuar."
		].map((line, index) => {
			const y = 790 - index * 20;
			return `/F1 ${index === 0 ? 18 : index === 1 ? 12 : 10} Tf\n1 0 0 1 54 ${y} Tm\n(${escapeClientPdfText(line)}) Tj`;
		}).join("\n"),
		"ET",
		"Q",
		"q",
		"0.95 0.73 0.10 RG",
		"3 w",
		"36 744 523 0 m S",
		"Q"
	].join("\n");
	const fileName = `${input.trackingCode}-formular-pershpejtimi-plotesuar.pdf`;
	return new File([bytesToArrayBuffer(buildClientPdf(content))], fileName, { type: "application/pdf" });
}
function ExpeditedDocumentTile({ trackingCode, label, fileName, documentId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border px-2 py-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium truncate",
				children: fileName ?? "Nuk aplikohet"
			}),
			documentId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					className: "h-7 px-2 text-[11px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: uploadedDocumentUrl(trackingCode, documentId),
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3 mr-1" }), "Shiko"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "h-7 px-2 text-[11px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: uploadedDocumentUrl(trackingCode, documentId, true),
						download: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 mr-1" }), "Shkarko"]
					})
				})]
			}) : fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-[11px] text-muted-foreground",
				children: "Dokumenti nuk ka skedar te ruajtur ne demo."
			}) : null
		]
	});
}
function TrackPage() {
	const { code } = Route.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [complaintSubject, setComplaintSubject] = (0, import_react.useState)("");
	const [complaintMessage, setComplaintMessage] = (0, import_react.useState)("");
	const [complaintContact, setComplaintContact] = (0, import_react.useState)("");
	const [complaintSending, setComplaintSending] = (0, import_react.useState)(false);
	const [complaintError, setComplaintError] = (0, import_react.useState)(null);
	const [complaintSuccess, setComplaintSuccess] = (0, import_react.useState)(null);
	const [expediteReason, setExpediteReason] = (0, import_react.useState)("deadline");
	const [expediteJustification, setExpediteJustification] = (0, import_react.useState)("");
	const [expeditePaymentRequired, setExpeditePaymentRequired] = (0, import_react.useState)(true);
	const [expediteRequestPdf, setExpediteRequestPdf] = (0, import_react.useState)(null);
	const [expediteRequestPdfSource, setExpediteRequestPdfSource] = (0, import_react.useState)(null);
	const [expediteSupportingDocument, setExpediteSupportingDocument] = (0, import_react.useState)(null);
	const [expeditePaymentReceipt, setExpeditePaymentReceipt] = (0, import_react.useState)(null);
	const [expediteSending, setExpediteSending] = (0, import_react.useState)(false);
	const [expediteError, setExpediteError] = (0, import_react.useState)(null);
	const [expediteSuccess, setExpediteSuccess] = (0, import_react.useState)(null);
	async function load() {
		setLoading(true);
		setError(null);
		try {
			const r = await fetch(`/api/public/track/${encodeURIComponent(code)}`, { cache: "no-store" });
			if (!r.ok) {
				setError(r.status === 404 ? "Kodi nuk u gjet" : "Gabim gjatë ngarkimit");
				setData(null);
			} else setData(await r.json());
		} catch {
			setError("Gabim rrjeti");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [code]);
	function clearGeneratedExpeditePdf() {
		if (expediteRequestPdfSource === "generated") {
			setExpediteRequestPdf(null);
			setExpediteRequestPdfSource(null);
			setExpediteSuccess(null);
		}
	}
	async function submitComplaint() {
		if (!data) return;
		setComplaintError(null);
		setComplaintSuccess(null);
		const subject = complaintSubject.trim();
		const message = complaintMessage.trim();
		if (subject.length < 3 || message.length < 10) {
			setComplaintError("Plotësoni subjektin dhe përshkrimin e ankesës.");
			return;
		}
		setComplaintSending(true);
		try {
			const r = await fetch(`/api/public/track/${encodeURIComponent(code)}`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					subject,
					message,
					contact: complaintContact.trim(),
					stage: data.isFinal ? "final_review" : "phase_review"
				})
			});
			if (!r.ok) throw new Error("Ankesa nuk u dërgua.");
			const payload = await r.json();
			setComplaintSubject("");
			setComplaintMessage("");
			setComplaintContact("");
			setComplaintSuccess(`Ankesa u përcoll te ${payload.complaint?.routedToLabel ?? "operatori përkatës"}.`);
			await load();
		} catch (e) {
			setComplaintError(e instanceof Error ? e.message : "Ankesa nuk u dërgua.");
		} finally {
			setComplaintSending(false);
		}
	}
	function generateExpeditedRequestPdf() {
		if (!data) return;
		setExpediteError(null);
		const justification = expediteJustification.trim();
		if (justification.length < 10) {
			setExpediteError("Plotesoni pershkrimin e arsyes para se te gjeneroni formularin PDF.");
			return;
		}
		const reasonLabel = EXPEDITE_REASONS.find((reason) => reason.value === expediteReason)?.label ?? "Arsye e dokumentuar";
		setExpediteRequestPdf(buildCompletedExpeditePdfFile({
			trackingCode: data.trackingCode,
			reasonLabel,
			justification,
			paymentRequired: expeditePaymentRequired,
			paymentAmountAll: data.expeditedProcedure.paymentAmountAll
		}));
		setExpediteRequestPdfSource("generated");
		setExpediteSuccess("Formulari u plotesua dhe u bashkangjit automatikisht si PDF.");
	}
	async function submitExpeditedProcedure() {
		if (!data) return;
		setExpediteError(null);
		setExpediteSuccess(null);
		const justification = expediteJustification.trim();
		if (justification.length < 10 || !expediteRequestPdf || !expediteSupportingDocument) {
			setExpediteError("Plotesoni/gjeneroni formularin PDF dhe ngarkoni dokumentin provues.");
			return;
		}
		if (expeditePaymentRequired && !expeditePaymentReceipt) {
			setExpediteError("Ngarkoni mandatin e pageses per tarifen demo te pershpejtimit.");
			return;
		}
		const form = new FormData();
		form.set("kind", "expedite");
		form.set("reason", expediteReason);
		form.set("justification", justification);
		form.set("paymentRequired", String(expeditePaymentRequired));
		form.set("requestPdf", expediteRequestPdf);
		form.set("supportingDocument", expediteSupportingDocument);
		if (expeditePaymentReceipt) form.set("paymentReceipt", expeditePaymentReceipt);
		setExpediteSending(true);
		try {
			const r = await fetch(`/api/public/track/${encodeURIComponent(code)}`, {
				method: "POST",
				body: form
			});
			if (!r.ok) {
				const payload = await r.json().catch(() => null);
				throw new Error(payload?.message ?? "Kerkesa nuk u dergua.");
			}
			setExpediteJustification("");
			setExpediteRequestPdf(null);
			setExpediteRequestPdfSource(null);
			setExpediteSupportingDocument(null);
			setExpeditePaymentReceipt(null);
			setExpediteSuccess("Kerkesa u dergua te operatori per shqyrtim.");
			await load();
		} catch (e) {
			setExpediteError(e instanceof Error ? e.message : "Kerkesa nuk u dergua.");
		} finally {
			setExpediteSending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		notifications: (data?.notifications ?? []).map((notification, index) => ({
			id: index,
			title: notification.action,
			meta: fmtDateTime(notification.at)
		})),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-3xl space-y-3 px-3 py-4 pb-12 sm:space-y-4 sm:px-4 md:px-6 md:py-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Kodi i gjurmimit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-lg font-bold tracking-tight break-all",
								children: code
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid shrink-0 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:justify-end",
							children: [
								data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: cn("shrink-0 text-[11px]", data.status === "completed" && "bg-success/15 text-success border-success/20", data.status === "blocked" && "bg-destructive/15 text-destructive border-destructive/20", data.status === "awaiting_external" && "bg-warning/15 text-warning-foreground border-warning/30"),
									children: STATUS_SQ[data.status] ?? data.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "sm",
									variant: "outline",
									className: "h-8 w-full sm:w-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "/aplikim",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3.5" }), "Aplikim i ri"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: load,
									disabled: loading,
									"aria-label": "Rifresko",
									className: "h-8 w-full sm:w-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", loading && "animate-spin") })
								})
							]
						})]
					}), data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-xs text-muted-foreground flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-3.5" }),
							" ",
							data.process
						]
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "p-4 border-destructive/30 bg-destructive/5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 mt-0.5 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-destructive",
							children: error
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: "Kontrolloni kodin dhe provoni sërish."
						})] })]
					})
				}),
				loading && !data && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Duke ngarkuar…"]
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("size-8 rounded-md grid place-items-center shrink-0", data.isFinal ? "bg-success/15 text-success" : "bg-primary/10 text-primary"),
									children: data.isFinal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-wider text-muted-foreground",
										children: "Faza aktuale"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold truncate",
										children: [
											data.currentPhase.number,
											". ",
											data.currentPhase.title
										]
									})]
								})]
							}),
							data.currentPhase.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: data.currentPhase.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Institucioni:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: data.currentPhase.institution
									})
								]
							}),
							!data.isFinal && data.nextMilestone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-muted/40 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-wider text-muted-foreground",
										children: "Hapi tjetër i pritshëm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium mt-0.5",
										children: data.nextMilestone
									}),
									data.nextInstitution && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: ["Përgjegjës: ", data.nextInstitution]
									})
								]
							}),
							data.isFinal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border border-success/30 bg-success/10 p-3 text-success text-sm flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), " Procedura është mbyllur."]
							})
						]
					}),
					data.processKind === "expropriation" && data.compensation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-warning/30 bg-warning/5 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-8 shrink-0 place-items-center rounded-md bg-warning/20 text-warning-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold",
											children: "Kompensimi / pagesa"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-xs leading-relaxed text-muted-foreground",
											children: [
												"Pagesa e shpronesimit monitorohet deri te disbursimi nga",
												" ",
												data.compensation.ministry,
												"."
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "w-fit shrink-0 text-[11px]",
									children: data.compensation.statusLabel
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-2 md:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-background/80 px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: "Vlera"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-sm font-semibold",
											children: data.compensation.amountAll !== null ? `${data.compensation.amountAll.toLocaleString("sq-AL")} ALL` : "Ne pritje te vleresimit"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-background/80 px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: "Urdhri i pageses"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-sm font-semibold",
											children: data.compensation.paymentOrderUploaded ? "I regjistruar" : "Ne pritje"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-background/80 px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: "Disbursimi"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-sm font-semibold",
											children: data.compensation.paymentConfirmed ? "I konfirmuar" : "Ne monitorim"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 rounded-md border bg-background/70 px-3 py-2 text-xs text-muted-foreground",
								children: data.compensation.nextAction
							})
						]
					}) : null,
					data.mapPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "overflow-hidden border-emerald-200 bg-emerald-50/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-start gap-2 p-4 pr-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-8 shrink-0 place-items-center rounded-md border border-emerald-200 bg-emerald-100 text-emerald-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold text-emerald-950",
										children: "AI GIS / AKPT e-Harta"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs leading-relaxed text-emerald-800",
										children: data.mapPreview.aiUse
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid shrink-0 gap-1.5 px-4 pb-4 sm:flex sm:flex-wrap sm:justify-end sm:p-4 sm:pl-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										className: "h-8 w-full bg-white sm:w-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: data.mapPreview.url,
											target: "_blank",
											rel: "noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1 size-3.5" }), "Harta"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										className: "h-8 w-full bg-white sm:w-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: mapPdfUrl(data.trackingCode),
											download: true,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 size-3.5" }), "PDF"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "sm",
										variant: "outline",
										className: "h-8 w-full bg-white sm:w-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: mapPrintUrl(data.trackingCode),
											target: "_blank",
											rel: "noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1 size-3.5" }), "Printo"]
										})
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-emerald-200 bg-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative aspect-[16/9] min-h-52 bg-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParcelMap, {
									center: data.mapPreview,
									parcelPolygon: data.mapPreview.parcelPolygon
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t px-3 py-2 text-[11px] text-emerald-900",
								children: [
									"Vendodhja e prones - ",
									data.mapPreview.lat.toFixed(4),
									",",
									" ",
									data.mapPreview.lon.toFixed(4),
									" - ",
									data.mapPreview.provider,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 font-medium text-emerald-950",
										children: [
											"Poligoni i parceles: ",
											data.mapPreview.parcelPolygon.length,
											" pika"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 font-medium text-emerald-950",
										children: ["Sinjali AI: ", data.mapPreview.aiSignal]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-emerald-800",
										children: data.mapPreview.accuracyLabel
									})
								]
							})]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: cn("p-4", data.requesterVerification.canReceiveDocuments ? "border-success/25 bg-success/5" : "border-warning/30 bg-warning/5"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("size-8 rounded-md grid place-items-center shrink-0", data.requesterVerification.canReceiveDocuments ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold",
											children: "Verifikimi i te drejtes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-0.5 leading-relaxed",
											children: "Dokumenti merret vetem nga personi qe perputhet me kartelen kadastrale ose nga perfaqesuesi ligjor i tij."
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: cn("w-fit shrink-0 text-[11px]", data.requesterVerification.canReceiveDocuments ? "bg-success/15 text-success border-success/20" : "bg-warning/15 text-warning-foreground border-warning/30", data.requesterVerification.status === "rejected" && "bg-destructive/15 text-destructive border-destructive/20"),
									children: REQUESTER_STATUS_SQ[data.requesterVerification.status]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 text-xs text-muted-foreground",
								children: [
									"Roli:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: data.requesterVerification.claimType === "legal_representative" ? "Perfaqesues ligjor" : "Personi/pronari në kadastër"
									}),
									data.requesterVerification.cadastralSubjectName ? ` · Emri në kadastër: ${data.requesterVerification.cadastralSubjectName}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2",
								children: data.requesterVerification.requiredDocuments.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("rounded-md border px-3 py-2 text-xs", doc.uploaded ? "border-success/25 bg-background/80" : "border-warning/30 bg-background/70"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 font-medium",
										children: [requesterDocIcon(doc.type), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: doc.label })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("mt-1 text-[11px]", doc.uploaded ? "text-success" : "text-warning-foreground"),
										children: doc.uploaded ? "U dorezua" : "Mungon"
									})]
								}, doc.type))
							}),
							!data.requesterVerification.canReceiveDocuments && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 rounded-md border border-warning/25 bg-background/70 px-3 py-2 text-xs text-muted-foreground",
								children: data.requesterVerification.heldDocumentsCount > 0 ? `${data.requesterVerification.heldDocumentsCount} dokument i vulosur mbahet ne pritje dhe hapet pas verifikimit.` : "Dokumenti i kerkuar do te hapet per shkarkim pas verifikimit."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 border-info/25 bg-info/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-8 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-semibold",
											children: "Procedure e pershpejtuar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-0.5 leading-relaxed",
											children: "Plotesoni formularin ne web ose ngarkoni PDF-in tuaj, pastaj bashkengjisni dokumentin provues. Tarifa shtese perdoret vetem kur eshte tarife zyrtare; ne demo eshte vendosur mandat pagese 1,000 ALL."
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: cn("w-fit shrink-0 text-[11px]", data.expeditedProcedure.status === "approved" && "bg-success/15 text-success border-success/20", data.expeditedProcedure.status === "submitted" && "bg-warning/15 text-warning-foreground border-warning/30", data.expeditedProcedure.status === "rejected" && "bg-destructive/15 text-destructive border-destructive/20"),
									children: EXPEDITE_STATUS_SQ[data.expeditedProcedure.status]
								})]
							}),
							data.expeditedProcedure.status !== "not_requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-md border bg-background/80 p-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: data.expeditedProcedure.reasonLabel ?? "Kerkese e derguar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 text-muted-foreground",
										children: [
											"Derguar:",
											" ",
											data.expeditedProcedure.requestedAt ? fmtDateTime(data.expeditedProcedure.requestedAt) : "-",
											data.expeditedProcedure.paymentRequired && data.expeditedProcedure.paymentAmountAll ? ` · Tarifë demo: ${data.expeditedProcedure.paymentAmountAll.toLocaleString("sq-AL")} ALL` : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditedDocumentTile, {
												trackingCode: data.trackingCode,
												label: "Formulari",
												fileName: data.expeditedProcedure.requestPdfName,
												documentId: data.expeditedProcedure.requestPdfDocumentId
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditedDocumentTile, {
												trackingCode: data.trackingCode,
												label: "Dokumenti provues",
												fileName: data.expeditedProcedure.supportingDocumentName,
												documentId: data.expeditedProcedure.supportingDocumentId
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditedDocumentTile, {
												trackingCode: data.trackingCode,
												label: "Mandati",
												fileName: data.expeditedProcedure.paymentReceiptName,
												documentId: data.expeditedProcedure.paymentReceiptDocumentId
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											className: "h-8 w-full sm:w-auto",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: expediteFormUrl(data.trackingCode),
												download: true,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 mr-1" }), "Shkarko formularin bosh"]
											})
										})
									}),
									data.expeditedProcedure.reviewNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 text-muted-foreground",
										children: ["Shenim operatori: ", data.expeditedProcedure.reviewNote]
									}) : null
								]
							}) : null,
							data.expeditedProcedure.status === "not_requested" || data.expeditedProcedure.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											className: "h-8 w-full sm:w-auto",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: expediteFormUrl(data.trackingCode),
												download: true,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 mr-1" }), "Shkarko formularin PDF"]
											})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Arsyeja"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: expediteReason,
											onValueChange: (value) => {
												setExpediteReason(value);
												clearGeneratedExpeditePdf();
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EXPEDITE_REASONS.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: reason.value,
												children: reason.label
											}, reason.value)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Pershkrimi i arsyes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: expediteJustification,
											onChange: (e) => {
												setExpediteJustification(e.target.value);
												clearGeneratedExpeditePdf();
											},
											rows: 3,
											maxLength: 2e3,
											className: "text-sm",
											placeholder: "Shpjegoni pse kerkohet trajtim i pershpejtuar dhe cfare dokumenti e provon."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border bg-background/80 p-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: "Formulari i plotesuar"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted-foreground mt-0.5",
												children: "Gjenero PDF nga te dhenat me siper, ose ngarko nje PDF te plotesuar nga jashte."
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												size: "sm",
												variant: "secondary",
												className: "h-8 w-full sm:w-auto",
												onClick: generateExpeditedRequestPdf,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 mr-1" }), "Gjenero PDF"]
											})]
										}), expediteRequestPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 rounded-md border border-success/25 bg-success/10 px-2 py-1.5 text-success",
											children: [
												"Gati per ngarkim (",
												expediteRequestPdfSource === "generated" ? "gjeneruar" : "ngarkuar",
												"):",
												" ",
												expediteRequestPdf.name
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 rounded-md border border-warning/25 bg-warning/10 px-2 py-1.5 text-warning-foreground",
											children: "Ende nuk ka formular PDF te bashkangjitur."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Ngarko formular PDF te plotesuar"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "file",
												accept: "application/pdf",
												className: "h-9 text-sm",
												onChange: (e) => {
													const file = e.target.files?.[0] ?? null;
													setExpediteRequestPdf(file);
													setExpediteRequestPdfSource(file ? "uploaded" : null);
													setExpediteSuccess(null);
												}
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Dokumenti provues"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "file",
												accept: "application/pdf,image/*",
												className: "h-9 text-sm",
												onChange: (e) => setExpediteSupportingDocument(e.target.files?.[0] ?? null)
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-start gap-2 rounded-md border bg-background/80 p-2 text-xs cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: expeditePaymentRequired,
											onCheckedChange: (value) => {
												setExpeditePaymentRequired(value === true);
												clearGeneratedExpeditePdf();
											},
											className: "mt-0.5"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-3.5 text-primary" }), "Bashkangjit mandat pagese per tarifen zyrtare"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-muted-foreground mt-0.5",
											children: "Ne demo: 1,000 ALL. Ne zbatim real, kjo tarife duhet te jete e miratuar zyrtarisht dhe pagesa nuk garanton miratimin."
										})] })]
									}),
									expeditePaymentRequired ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Mandat pagese"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "file",
											accept: "application/pdf,image/*",
											className: "h-9 text-sm",
											onChange: (e) => setExpeditePaymentReceipt(e.target.files?.[0] ?? null)
										})]
									}) : null,
									expediteError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-destructive",
										children: expediteError
									}) : null,
									expediteSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md border border-success/25 bg-success/10 px-3 py-2 text-xs text-success",
										children: expediteSuccess
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-stretch sm:justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: submitExpeditedProcedure,
											disabled: expediteSending,
											className: "h-8 w-full sm:w-auto",
											children: [expediteSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-3.5 mr-1" }), "Dergoni kerkesen"]
										})
									})
								]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-3",
							children: "Rrugëtimi"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "relative space-y-3",
							children: data.phasesTimeline.map((p, i) => {
								const isLast = i === data.phasesTimeline.length - 1;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "relative flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex flex-col items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("size-6 rounded-full grid place-items-center text-[10px] font-semibold shrink-0", p.state === "completed" && "bg-success text-success-foreground", p.state === "current" && "bg-primary text-primary-foreground ring-4 ring-primary/15", p.state === "upcoming" && "bg-muted text-muted-foreground border"),
											children: p.state === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }) : p.state === "current" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-2.5 fill-current" }) : p.order
										}), !isLast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("w-px flex-1 mt-1 min-h-[18px]", p.state === "completed" ? "bg-success/40" : "bg-border") })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("text-sm", p.state === "current" ? "font-semibold" : "font-medium", p.state === "upcoming" && "text-muted-foreground"),
											children: p.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: p.institution
										})]
									})]
								}, p.order);
							})
						})]
					}),
					data.missingDocuments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 border-warning/30 bg-warning/5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileExclamationPoint, { className: "size-4 text-warning-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Dokumente që kërkohen prej jush"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: data.missingDocuments.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2 text-sm leading-snug",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-2 mt-2 shrink-0 fill-warning-foreground/60 text-warning-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: doc.label })]
								}, doc.type))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-3",
								children: "Dorëzoni këto dokumente në sportelin e institucionit përgjegjës ose përmes e-Albania kur është e mundur."
							})
						]
					}),
					data.citizenDocuments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4 border-success/25 bg-success/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Dokumente nga institucioni"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: data.citizenDocuments.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md border bg-background/80 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium leading-snug truncate",
												children: doc.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground mt-0.5",
												children: [
													doc.label,
													" · dërguar më ",
													fmtDateTime(doc.deliveredAt)
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "shrink-0 bg-success/15 text-success border-success/20",
											children: "Marrë"
										})]
									}),
									doc.electronicallySealed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 inline-flex items-center gap-1 rounded-md border border-success/25 bg-success/10 px-2 py-1 text-[11px] text-success",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }), "Vulosur elektronikisht"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											variant: "outline",
											className: "h-8",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: citizenDocumentUrl(data.trackingCode, doc.id),
												target: "_blank",
												rel: "noreferrer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5 mr-1" }), "Shiko PDF"]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "sm",
											className: "h-8",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: citizenDocumentUrl(data.trackingCode, doc.id, true),
												download: true,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 mr-1" }), "Shkarko"]
											})
										})]
									})
								]
							}, doc.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Ankesë për dosjen"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground",
										children: "Ankesa lidhet me fazën aktuale dhe i përcillet operatorit që ka trajtuar dosjen. Në përfundim mund të dërgohet si verifikim final."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Subjekti"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: complaintSubject,
											onChange: (e) => setComplaintSubject(e.target.value),
											placeholder: "p.sh. Dokumenti nuk është i saktë",
											className: "h-9 text-sm",
											maxLength: 120
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Përshkrimi i ankesës"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: complaintMessage,
											onChange: (e) => setComplaintMessage(e.target.value),
											placeholder: "Shkruani çfarë nuk shkon me fazën, dokumentin ose vendimin.",
											rows: 4,
											className: "text-sm",
											maxLength: 2e3
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Kontakt opsional"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: complaintContact,
											onChange: (e) => setComplaintContact(e.target.value),
											placeholder: "Telefon ose email",
											className: "h-9 text-sm",
											maxLength: 120
										})]
									}),
									complaintError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-destructive",
										children: complaintError
									}) : null,
									complaintSuccess ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md border border-success/25 bg-success/10 px-3 py-2 text-xs text-success",
										children: complaintSuccess
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: submitComplaint,
											disabled: complaintSending,
											className: "h-8",
											children: [complaintSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5 mr-1" }), "Dërgo ankesë"]
										})
									})
								]
							}),
							data.citizenComplaints.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 border-t pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-wider text-muted-foreground mb-2",
									children: "Ankesat e dërguara"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2",
									children: data.citizenComplaints.map((complaint) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "rounded-md border p-2.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-medium leading-snug",
													children: complaint.subject
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: [
														fmtDateTime(complaint.createdAt),
														" · ",
														complaint.routedToLabel,
														complaint.phaseTitle ? ` · ${complaint.phaseTitle}` : ""
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "shrink-0 text-[11px]",
												children: COMPLAINT_STATUS_SQ[complaint.status]
											})]
										})
									}, complaint.id))
								})]
							})
						]
					}),
					(data.citizenDeadlines.length > 0 || data.deadline) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Afatet që ju interesojnë"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-2",
							children: [data.citizenDeadlines.map((dl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeadlineRow, {
								label: dl.label,
								dueAt: dl.dueAt,
								daysRemaining: dl.daysRemaining,
								kind: dl.kind === "legal" ? "Afat ligjor" : "Institucional"
							}, dl.label + dl.dueAt)), data.citizenDeadlines.length === 0 && data.deadline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeadlineRow, {
								label: data.deadline.label,
								dueAt: data.deadline.dueAt,
								daysRemaining: data.deadline.daysRemaining ?? 0,
								kind: "Afat"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] text-center text-muted-foreground pt-2",
						children: ["Përditësuar së fundmi: ", fmtDateTime(data.updatedAt)]
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenVirtualAgent, { defaultTrackingCode: code })]
	});
}
function DeadlineRow({ label, dueAt, daysRemaining, kind }) {
	const overdue = daysRemaining < 0;
	const soon = daysRemaining >= 0 && daysRemaining <= 7;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start justify-between gap-3 rounded-md border p-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium leading-snug",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] text-muted-foreground mt-0.5",
				children: [
					kind,
					" · ",
					fmtDate(dueAt)
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "secondary",
			className: cn("shrink-0 text-[11px]", overdue && "bg-destructive/15 text-destructive border-destructive/20", soon && !overdue && "bg-warning/15 text-warning-foreground border-warning/30", !overdue && !soon && "bg-success/15 text-success border-success/20"),
			children: overdue ? `${Math.abs(daysRemaining)} ditë vonesë` : daysRemaining === 0 ? "Sot" : `${daysRemaining} ditë`
		})]
	});
}
//#endregion
export { TrackPage as component };
