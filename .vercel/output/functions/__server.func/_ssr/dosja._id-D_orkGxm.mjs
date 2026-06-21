import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn, i as Input, n as Card, o as useDemoRole, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { At as Bot, C as Scale, D as Printer, E as QrCode, J as IdCard, N as MapPinned, Nt as ArrowRight, Pt as ArrowLeft, S as ScrollText, T as RefreshCw, V as ListChecks, X as History, _ as ShieldCheck, a as UsersRound, b as Send, ct as Download, d as TriangleAlert, dt as Clock, et as FileText, g as Sparkles, ht as Circle, i as WandSparkles, it as Eye, j as MessageSquare, jt as BookOpen, l as UserCheck, mt as ClipboardCheck, ot as ExternalLink, tt as FileSearch, u as Upload, ut as Copy, vt as CircleCheck, wt as Check, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Checkbox } from "./checkbox-CjIFYTlP.mjs";
import { t as Label } from "./label-CgYZPzcy.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Y as arrayType, Z as enumType, rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { c as createServerFn } from "./esm-B50dUWcE.mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { n as buildAiGisAssessment } from "./dossiers-helpers-BSyvCqzm.mjs";
import { E as uploadDocument, T as updateRequesterVerification, _ as getDossier, d as calculateEkbValuation, h as createSsrRpc, n as advanceDossier, x as reviewExpeditedProcedure } from "./dossiers.functions-D8xRMefQ.mjs";
import { a as DialogContent, c as DialogHeader, i as Dialog, l as DialogTitle, n as Badge, o as DialogDescription, t as AppShell, u as DialogTrigger } from "./app-shell-zR2LMms-.mjs";
import { t as Textarea } from "./textarea-DCzrjZMV.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as extractionResultSchema } from "./extraction-schemas-CiVuWAU6.mjs";
import { t as AccessNotice } from "./role-switcher-Cgz82BMS.mjs";
import { n as extractFromText, r as getAiStatus, t as Route } from "./extract.functions-fHTdyP_h.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CLY2nigl.mjs";
import { n as SeverityBadge, r as StatusBadge, t as PriorityBadge } from "./status-badge-Qt_WaQgB.mjs";
import { t as ParcelMap } from "./parcel-polygon-overlay-BUAQsn-y.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dosja._id-D_orkGxm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-10 items-center justify-center rounded-md border bg-secondary/85 p-1 text-muted-foreground shadow-soft", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-soft", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var TEXT_TYPES = [
	"text/plain",
	"text/markdown",
	"text/csv",
	"application/json"
];
var IMAGE_PREFIX = "image/";
async function extractTextFromFile(file) {
	const warnings = [];
	if (TEXT_TYPES.includes(file.type) || /\.(txt|md|csv|json)$/i.test(file.name)) return {
		text: await file.text(),
		method: "text",
		warnings
	};
	if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
		const { text, pages, scanned } = await extractPdf(file);
		if (scanned && text.trim().length < 40) {
			warnings.push("PDF duket i skanuar; po provohet OCR.");
			const ocr = await ocrPdfFirstPages(file, 2);
			return {
				text: ocr.text || text,
				method: "ocr",
				pages,
				warnings: [...warnings, ...ocr.warnings]
			};
		}
		return {
			text,
			method: "pdf",
			pages,
			warnings
		};
	}
	if (file.type.startsWith(IMAGE_PREFIX)) {
		const ocr = await ocrImage(file);
		return {
			text: ocr.text,
			method: "ocr",
			warnings: ocr.warnings
		};
	}
	try {
		return {
			text: await file.text(),
			method: "text",
			warnings: ["Tip skedari i panjohur; përdorur si tekst."]
		};
	} catch {
		throw new Error("Tip skedari i pambështetur");
	}
}
async function extractPdf(file) {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
	const buf = await file.arrayBuffer();
	const doc = await pdfjs.getDocument({ data: buf }).promise;
	let out = "";
	for (let i = 1; i <= doc.numPages; i++) {
		const pageText = (await (await doc.getPage(i)).getTextContent()).items.map((it) => "str" in it ? it.str : "").join(" ");
		out += pageText + "\n";
	}
	const trimmed = out.trim();
	return {
		text: trimmed,
		pages: doc.numPages,
		scanned: trimmed.length < 40
	};
}
async function ocrImage(file) {
	const { recognize } = await import("../_libs/tesseract.js.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	return {
		text: (await recognize(file, "eng+sqi")).data.text ?? "",
		warnings: []
	};
}
async function ocrPdfFirstPages(file, pageCount) {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
	const { recognize } = await import("../_libs/tesseract.js.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const buf = await file.arrayBuffer();
	const doc = await pdfjs.getDocument({ data: buf }).promise;
	const limit = Math.min(pageCount, doc.numPages);
	let text = "";
	const warnings = [];
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
		await page.render({
			canvasContext: ctx,
			viewport,
			canvas
		}).promise;
		const res = await recognize(await new Promise((r) => canvas.toBlob((b) => r(b), "image/png")), "eng+sqi");
		text += (res.data.text ?? "") + "\n";
	}
	return {
		text,
		warnings
	};
}
var applyExtractedFields = createServerFn({ method: "POST" }).validator((input) => objectType({
	id: stringType(),
	result: extractionResultSchema,
	sourceDocumentId: stringType().optional(),
	fileName: stringType().optional()
}).parse(input)).handler(createSsrRpc("9cd5dfa34d2e41b216ebda6b1de936d6c17b3e4ee7a3933f7f04be650e52bc8b"));
function AiExtractPanel({ dossier }) {
	const status = useServerFn(getAiStatus);
	const extract = useServerFn(extractFromText);
	const apply = useServerFn(applyExtractedFields);
	const upload = useServerFn(uploadDocument);
	const qc = useQueryClient();
	const aiStatus = useQuery({
		queryKey: ["ai-status"],
		queryFn: () => status()
	});
	const [file, setFile] = (0, import_react.useState)(null);
	const [docType, setDocType] = (0, import_react.useState)(dossier.process === "ekb_privatization" ? "family_certificate" : "valuation_report");
	const [step, setStep] = (0, import_react.useState)("idle");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [rawText, setRawText] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [applying, setApplying] = (0, import_react.useState)(false);
	const disabled = !aiStatus.data?.enabled;
	async function run(fileOverride) {
		const f = fileOverride ?? file;
		if (!f) return;
		setStep("reading");
		setProgress(15);
		setResult(null);
		setErrorMsg(null);
		try {
			const local = await extractTextFromFile(f);
			setRawText(local.text);
			setProgress(55);
			setStep("extracting");
			const res = await extract({ data: {
				processKind: dossier.process,
				documentType: docType,
				text: local.text,
				fileName: f.name
			} });
			setProgress(95);
			if (!res.ok) {
				setErrorMsg(res.error);
				setStep("error");
				return;
			}
			setResult(res.result);
			setStep("done");
			setProgress(100);
		} catch (e) {
			setErrorMsg(e instanceof Error ? e.message : "Gabim i panjohur");
			setStep("error");
		}
	}
	async function applyResult() {
		if (!result) return;
		setApplying(true);
		try {
			const up = await upload({ data: {
				id: dossier.id,
				type: docType,
				name: file?.name ?? `${docType}.txt`,
				aiGenerated: false
			} });
			const r = await apply({ data: {
				id: dossier.id,
				result,
				sourceDocumentId: up.documentId,
				fileName: file?.name
			} });
			toast.success(`U aplikuan ${r.applied.length} fusha${r.conflicts.length ? `, ${r.conflicts.length} konflikte` : ""}`);
			qc.invalidateQueries({ queryKey: ["dossier", dossier.id] });
			setFile(null);
			setResult(null);
			setRawText("");
			setStep("idle");
			setProgress(0);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gabim gjatë aplikimit");
		} finally {
			setApplying(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-info" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Nxjerrje me AI"
				})]
			}), aiStatus.data ? aiStatus.data.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "text-[10px]",
				children: ["Aktiv · ", aiStatus.data.model]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "text-[10px] border-warning text-warning",
				children: "I çaktivizuar (OPENAI_API_KEY mungon)"
			}) : null]
		}), disabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted-foreground",
			children: [
				"Vendos ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "font-mono",
					children: "OPENAI_API_KEY"
				}),
				" (dhe opsionalisht",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "font-mono",
					children: "OPENAI_MODEL"
				}),
				") në variablat e mjedisit për të aktivizuar nxjerrjen reale të fushave. Nuk shfaqen të dhëna fiktive."
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 md:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Skedar (PDF, imazh ose tekst)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "file",
						accept: ".pdf,.png,.jpg,.jpeg,.webp,.txt,.md,.csv,.json,application/pdf,image/*,text/*",
						onChange: (e) => {
							const f = e.target.files?.[0] ?? null;
							setFile(f);
							if (f) run(f);
						},
						className: "h-9 text-sm"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Tipi i dokumentit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: docType,
						onChange: (e) => setDocType(e.target.value),
						className: "h-9 text-sm"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-muted-foreground truncate",
					children: [
						file.name,
						" · ",
						(file.size / 1024).toFixed(1),
						" KB"
					]
				}) : null, step === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => run(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSearch, { className: "size-3.5 mr-1" }), "Provo përsëri"]
				}) : null]
			}),
			(step === "reading" || step === "extracting") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground",
					children: step === "reading" ? "Po lexohet teksti lokalisht…" : "Po komunikohet me modelin…"
				})]
			}),
			step === "error" && errorMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded border border-critical/30 bg-critical/5 p-2 text-xs flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5 text-critical mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMsg })]
			}) : null,
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtractionResultView, {
				dossier,
				result,
				onApply: applyResult,
				applying,
				rawTextPreview: rawText.slice(0, 280)
			}) : null
		] })]
	});
}
function ExtractionResultView({ dossier, result, onApply, applying, rawTextPreview }) {
	const rows = buildRows(dossier, result);
	const conflicts = rows.filter((r) => r.conflict);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: result.documentType
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [
							"Besueshmëri totale: ",
							(result.overallConfidence * 100).toFixed(0),
							"%"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: [rows.length, " fusha"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded border divide-y",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2 text-xs grid grid-cols-12 gap-2 items-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-3 font-medium",
							children: r.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-5 break-words",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatVal(r.value) }), r.evidence ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground italic mt-0.5",
								children: [
									"“",
									r.evidence,
									"”"
								]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBar, { value: r.confidence })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-2 text-right",
							children: r.conflict ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "border-warning text-warning text-[10px]",
								children: "konflikt"
							}) : r.value === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px]",
								children: "mungon"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-success inline" })
						}),
						r.conflict ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 text-[10px] text-muted-foreground pl-1",
							children: [
								"Aktualisht: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: formatVal(r.current) }),
								" → e re:",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: formatVal(r.value) })
							]
						}) : null
					]
				}, r.key))
			}),
			result.missingFields.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mungojnë:" }),
					" ",
					result.missingFields.join(", ")
				]
			}) : null,
			result.warnings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] text-warning",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Paralajmërime:" }),
					" ",
					result.warnings.join("; ")
				]
			}) : null,
			rawTextPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer",
					children: "Pamje paraprake e tekstit të nxjerrë"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", {
					className: "whitespace-pre-wrap mt-1",
					children: [rawTextPreview, "…"]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-muted-foreground",
					children: conflicts.length ? `${conflicts.length} fusha do mbishkruhen.` : "Asnjë konflikt me të dhënat ekzistuese."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: onApply,
					disabled: applying,
					children: [applying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5 mr-1" }), "Apliko fushat e nxjerra"]
				})]
			})
		]
	});
}
function ConfidenceBar({ value }) {
	const pct = Math.round(value * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 w-full rounded bg-muted overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `h-full ${value >= .8 ? "bg-success" : value >= .5 ? "bg-info" : "bg-warning"}`,
				style: { width: `${pct}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-[10px] tabular-nums w-7 text-right",
			children: [pct, "%"]
		})]
	});
}
function buildRows(d, r) {
	const c = r.common ?? {};
	const ekb = r.ekb ?? {};
	const exp = r.expropriation ?? {};
	const biz = r.propertyRegistration ?? {};
	const p0 = d.parties[0];
	const rows = [];
	const push = (key, label, fv, current) => {
		if (!fv) return;
		const conflict = fv.value !== null && fv.value !== void 0 && current !== void 0 && current !== null && current !== "" && String(current) !== String(fv.value);
		rows.push({
			key,
			label,
			value: fv.value,
			confidence: fv.confidence,
			evidence: fv.sourceEvidence,
			current,
			conflict
		});
	};
	push("applicantName", "Emri", c.applicantName, p0?.fullName);
	push("nidMasked", "ID kombëtare (maskuar)", c.nidMasked, p0?.nationalIdMasked);
	push("address", "Adresa", c.address, p0?.contact?.address);
	push("phone", "Telefon", c.phone, p0?.contact?.phone);
	push("email", "Email", c.email, p0?.contact?.email);
	push("documentDate", "Data e dokumentit", c.documentDate, void 0);
	push("institution", "Institucioni", c.institution, void 0);
	push("propertyId", "Identifikuesi i pasurisë", c.propertyId, d.property.cadastralNo);
	push("cadastralZone", "Zona kadastrale", c.cadastralZone, d.property.zone);
	push("propertyAreaM2", "Sipërfaqe (m²)", c.propertyAreaM2, d.property.areaSqm);
	push("municipality", "Bashkia", c.municipality, void 0);
	if (d.process === "ekb_privatization") {
		push("familyMembers", "Anëtarë familje", ekb.familyMembers, void 0);
		push("familyIncomeAll", "Të ardhura familjare (ALL)", ekb.familyIncomeAll, d.property.familyIncomeAll);
		push("marketPriceAll", "Çmim tregu (ALL)", ekb.marketPriceAll, d.property.marketPriceAll);
		push("landPriceAll", "Çmim trualli (ALL)", ekb.landPriceAll, d.property.landPriceAll);
		push("housingNorm", "Norma e strehimit", ekb.housingNorm, void 0);
		push("certificateNumber", "Nr. çertifikate", ekb.certificateNumber, void 0);
		push("qualifiesForPrivatization", "Kualifikohet", ekb.qualifiesForPrivatization, void 0);
		push("suggestedPriceCategory", "Kategoria e çmimit", ekb.suggestedPriceCategory, void 0);
	} else if (d.process === "property_registration") {
		push("businessName", "Biznesi", biz.businessName, p0?.fullName);
		push("nipt", "NIPT", biz.nipt, p0?.businessNipt);
		push("representativeName", "Perfaqesuesi", biz.representativeName, void 0);
		push("ownershipActNumber", "Nr. akti pronesie", biz.ownershipActNumber, void 0);
		push("registrationReason", "Arsye regjistrimi", biz.registrationReason, void 0);
		push("planReference", "Referenca e planit", biz.planReference, void 0);
		push("hasLegalRepresentation", "Ka perfaqesim ligjor", biz.hasLegalRepresentation, void 0);
	} else {
		push("ownerName", "Pronari", exp.ownerName, p0?.fullName);
		push("projectName", "Projekti", exp.projectName, void 0);
		push("publicInterestReason", "Interesi publik", exp.publicInterestReason, void 0);
		push("compensationAmountAll", "Kompensim (ALL)", exp.compensationAmountAll, d.finalValueAll);
		push("valuationMethod", "Metoda e vlerësimit", exp.valuationMethod, void 0);
		push("appealDeadline", "Afati i ankimit", exp.appealDeadline, void 0);
		push("acceptanceStatus", "Statusi i pranimit", exp.acceptanceStatus, void 0);
	}
	return rows;
}
function formatVal(v) {
	if (v === null || v === void 0) return "—";
	if (typeof v === "boolean") return v ? "po" : "jo";
	return String(v);
}
var EXAMPLES = [
	"Cfare mungon per hapin tjeter?",
	"Pse eshte dosja e bllokuar?",
	"Cili eshte afati i ankimit?",
	"Si llogaritet vlera e privatizimit?",
	"Cili institucion ka radhen?"
];
async function postJson(path, body) {
	const res = await fetch(path, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	});
	const json = await res.json().catch(() => ({}));
	if (!res.ok || json.ok === false) throw new Error(json.error || `HTTP ${res.status}`);
	return json;
}
function AiAssistPanel({ dossier }) {
	const qc = useQueryClient();
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [summaryLoading, setSummaryLoading] = (0, import_react.useState)(false);
	const [nextStep, setNextStep] = (0, import_react.useState)(null);
	const [nextStepSource, setNextStepSource] = (0, import_react.useState)(null);
	const [nextStepLoading, setNextStepLoading] = (0, import_react.useState)(false);
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [question, setQuestion] = (0, import_react.useState)("");
	const [askLoading, setAskLoading] = (0, import_react.useState)(false);
	const invalidate = (0, import_react.useCallback)(() => qc.invalidateQueries({ queryKey: ["dossier", dossier.id] }), [dossier.id, qc]);
	const refreshAiReview = (0, import_react.useCallback)(async (showToast = true) => {
		setSummaryLoading(true);
		setNextStepLoading(true);
		const [summaryRes, nextStepRes] = await Promise.allSettled([postJson("/api/ai/summary", { id: dossier.id }), postJson("/api/ai/next-step", { id: dossier.id })]);
		if (summaryRes.status === "fulfilled") setSummary(summaryRes.value.summary);
		if (nextStepRes.status === "fulfilled") {
			setNextStep(nextStepRes.value.result);
			setNextStepSource(nextStepRes.value.source ?? nextStepRes.value.result.legalOrProcessSource);
		}
		if (summaryRes.status === "fulfilled" || nextStepRes.status === "fulfilled") {
			invalidate();
			if (showToast) toast.success("AI rifreskoi udhezimin e dosjes.");
		} else if (showToast) toast.error(summaryRes.reason instanceof Error ? summaryRes.reason.message : "AI deshtoi");
		setSummaryLoading(false);
		setNextStepLoading(false);
	}, [dossier.id, invalidate]);
	(0, import_react.useEffect)(() => {
		setSummary(null);
		setNextStep(null);
		setNextStepSource(null);
		refreshAiReview(false);
	}, [refreshAiReview]);
	async function ask(text) {
		if (!text.trim()) return;
		const userMsg = {
			role: "user",
			text
		};
		setMessages((m) => [...m, userMsg]);
		setQuestion("");
		setAskLoading(true);
		try {
			const r = await postJson("/api/ai/assist", {
				id: dossier.id,
				question: text
			});
			setMessages((m) => [...m, {
				role: "assistant",
				text: r.answer,
				citations: r.citations,
				hasEnoughInfo: r.hasEnoughInfo
			}]);
			invalidate();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gabim");
		} finally {
			setAskLoading(false);
		}
	}
	const reviewLoading = summaryLoading || nextStepLoading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "overflow-hidden border-primary/20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b bg-primary/5 p-3 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4" }),
							"AI per operatorin",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "text-[10px]",
								children: "auto"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-1 text-base font-semibold",
						children: "Udhezim i shpejte pa klikime shtese"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => refreshAiReview(true),
					disabled: reviewLoading,
					className: "w-fit",
					children: [reviewLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1.5 size-3.5" }), "Rifresko AI"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-0 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold",
							children: "Permbledhje operative"
						})]
					}), summaryLoading && !summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingLine, { text: "AI po lexon dosjen..." }) : summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap text-sm leading-relaxed",
						children: summary
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "AI do te shfaqe ketu vendndodhjen e dosjes, cfare mungon, rrezikun dhe veprimin tjeter."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t bg-muted/25 p-3 lg:border-l lg:border-t-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-sm font-semibold",
							children: "Hapi tjeter"
						})]
					}), nextStepLoading && !nextStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingLine, { text: "AI po zgjedh veprimin e radhes..." }) : nextStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium leading-relaxed",
								children: nextStep.nextAction
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Institucioni",
								children: nextStep.responsibleInstitution
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Dokumente",
								children: nextStep.requiredDocuments.length ? nextStep.requiredDocuments.join(", ") : "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Afat",
								children: nextStep.deadline ?? "-"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Rrezik",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-start gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-3 shrink-0 text-warning" }), nextStep.risk]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Burimi",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "mr-1 size-3" }), nextStepSource ?? nextStep.legalOrProcessSource]
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Sugjerimi kufizohet te procesi, baza ligjore dhe faktet e dosjes."
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "space-y-3 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: "Pyetje me burime"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px]",
								children: "RAG"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: EXAMPLES.slice(0, 3).map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => ask(q),
							disabled: askLoading,
							className: "rounded-md border bg-muted/40 px-2 py-1 text-[11px] transition hover:bg-muted disabled:opacity-50",
							children: q
						}, q))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[24rem] space-y-2 overflow-y-auto",
					children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Pyet vetem kur duhet sqarim. Pergjigja vjen nga procesi, baza ligjore, pikat kritike dhe faktet e dosjes."
					}) : messages.map((m, i) => m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-wide text-muted-foreground",
							children: "Pyetja"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: m.text
						})]
					}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5 rounded-md border bg-muted/30 p-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap leading-relaxed",
								children: m.text
							}),
							!m.hasEnoughInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1 text-[11px] text-warning",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }), "Platforma nuk ka informacion te mjaftueshem per kete pyetje."]
							}) : null,
							m.citations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1 border-t pt-1",
								children: m.citations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "mr-1 size-3" }), c.title]
								}, c.id))
							}) : null
						]
					}, i)), askLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingLine, { text: "Duke kerkuar burimet..." }) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						ask(question);
					},
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: question,
						onChange: (e) => setQuestion(e.target.value),
						placeholder: "Pyetje per procesin ose dosjen...",
						className: "h-9 text-sm",
						disabled: askLoading
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						type: "submit",
						disabled: askLoading || !question.trim(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1 size-3.5" }), "Dergo"]
					})]
				})
			]
		})]
	});
}
function LoadingLine({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 text-xs text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), text]
	});
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-12 gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-span-3 text-[11px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-span-9 text-xs",
			children
		})]
	});
}
var TEMPLATE_KEYS = [
	"ekb_missing_docs_notice",
	"ekb_refusal_decision",
	"ekb_value_calculation",
	"ekb_citizen_invoice",
	"ekb_contract_draft",
	"exp_owner_notification",
	"exp_compensation_proposal"
];
var listDocTemplates = createServerFn({ method: "GET" }).validator((input) => objectType({ dossierId: stringType() }).parse(input)).handler(createSsrRpc("d4e3984ef2f1ed25e6c561027e5788f1c8aecfecddeb5f09c20ef0332f018bf1"));
var previewDocument = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS)
}).parse(input)).handler(createSsrRpc("d7d391ad79521e503c357131d1d205274d8160ae074c871dc3759e999317a4d9"));
var generateDocument = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS),
	/** optional AI-improved sections to use instead of the raw template body */
	improvedSections: arrayType(objectType({
		heading: stringType().optional(),
		paragraphs: arrayType(stringType())
	})).optional(),
	format: enumType(["html", "docx"]).default("html")
}).parse(input)).handler(createSsrRpc("54b746f20c01ae1b2a610eb327ed545963c6f0a9bed65c324d57fa8de18a8c2a"));
var aiImproveDocumentWording = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS)
}).parse(input)).handler(createSsrRpc("3ab2de3e5aba1cc8cc6bb6528697319e212ef65160cb7f996b0c0c4ebd664a5b"));
var downloadDocx = createServerFn({ method: "POST" }).validator((input) => objectType({
	dossierId: stringType(),
	template: enumType(TEMPLATE_KEYS),
	improvedSections: arrayType(objectType({
		heading: stringType().optional(),
		paragraphs: arrayType(stringType())
	})).optional()
}).parse(input)).handler(createSsrRpc("40ebf0a6479a0b5b1d3e473b3a3c0801bfbc6abd0220b495d3bb2386d01a04c6"));
function DocGeneratorPanel({ dossierId }) {
	const list = useServerFn(listDocTemplates);
	const preview = useServerFn(previewDocument);
	const improve = useServerFn(aiImproveDocumentWording);
	const generate = useServerFn(generateDocument);
	const dlDocx = useServerFn(downloadDocx);
	const tplQ = useQuery({
		queryKey: ["doc-templates", dossierId],
		queryFn: () => list({ data: { dossierId } })
	});
	const [template, setTemplate] = (0, import_react.useState)("");
	const [previewHtml, setPreviewHtml] = (0, import_react.useState)(null);
	const [improvedSections, setImprovedSections] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(null);
	const iframeRef = (0, import_react.useRef)(null);
	const activeTemplate = (0, import_react.useMemo)(() => template || tplQ.data?.templates[0]?.key || "", [template, tplQ.data]);
	async function loadPreview(opts) {
		if (!activeTemplate) return;
		setLoading("preview");
		try {
			const res = await preview({ data: {
				dossierId,
				template: activeTemplate
			} });
			if (opts?.useImproved && improvedSections) setPreviewHtml((await generate({ data: {
				dossierId,
				template: activeTemplate,
				improvedSections,
				format: "html"
			} })).html);
			else setPreviewHtml(res.html);
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
			const res = await improve({ data: {
				dossierId,
				template: activeTemplate
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setImprovedSections(res.sections);
			setPreviewHtml((await generate({ data: {
				dossierId,
				template: activeTemplate,
				improvedSections: res.sections,
				format: "html"
			} })).html);
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
			await generate({ data: {
				dossierId,
				template: activeTemplate,
				improvedSections: improvedSections ?? void 0,
				format: "html"
			} });
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
			const res = await dlDocx({ data: {
				dossierId,
				template: activeTemplate,
				improvedSections: improvedSections ?? void 0
			} });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-info" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold",
					children: "Gjenero dokument"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: activeTemplate,
					onValueChange: (v) => {
						setTemplate(v);
						setImprovedSections(null);
						setPreviewHtml(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Zgjidh shabllon…" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: tplQ.data?.templates.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: t.key,
						className: "text-xs",
						children: t.label
					}, t.key)) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => loadPreview(),
						disabled: !activeTemplate || loading !== null,
						children: [loading === "preview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 mr-1" }), "Pamje paraprake"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "secondary",
						onClick: runImprove,
						disabled: !activeTemplate || loading !== null,
						children: [loading === "improve" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5 mr-1" }), "AI përmirëso fjalimin"]
					})]
				})]
			}),
			improvedSections && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] text-muted-foreground flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3" }),
					"Po përdoret versioni me formulim të përmirësuar nga AI. Faktet ligjore mbeten të pandryshuara.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "underline ml-1",
						onClick: () => {
							setImprovedSections(null);
							loadPreview();
						},
						children: "Kthe origjinalin"
					})
				]
			}),
			previewHtml ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border rounded-md overflow-hidden bg-muted/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					ref: iframeRef,
					title: "Pamja paraprake e dokumentit",
					srcDoc: previewHtml,
					className: "w-full h-[600px] bg-white",
					sandbox: "allow-same-origin allow-modals allow-popups allow-popups-to-escape-sandbox"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-dashed rounded-md p-6 text-center text-xs text-muted-foreground",
				children: [
					"Zgjidh një shabllon dhe shtyp ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pamje paraprake" }),
					" për ta parë dokumentin."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 justify-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: printPreview,
						disabled: !previewHtml,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5 mr-1" }), "Printo / PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: exportDocx,
						disabled: !activeTemplate || loading !== null,
						children: [loading === "docx" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 mr-1" }), "Shkarko DOCX"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: saveAndAudit,
						disabled: !activeTemplate || loading !== null,
						children: [loading === "save" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 mr-1" }), "Ruaj në dosje"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-muted-foreground",
				children: [
					"Printimi nga browser-i jep PDF të pastër A4. Çdo gjenerim regjistrohet si",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "AuditEvent" }),
					"."
				]
			})
		]
	});
}
function ShareTracking({ code }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [qrDataUrl, setQrDataUrl] = (0, import_react.useState)("");
	const [qrError, setQrError] = (0, import_react.useState)(false);
	const url = typeof window !== "undefined" ? `${window.location.origin}/track/${encodeURIComponent(code)}` : `/track/${encodeURIComponent(code)}`;
	(0, import_react.useEffect)(() => {
		if (!open) return;
		let cancelled = false;
		setQrDataUrl("");
		setQrError(false);
		import_lib.toDataURL(url, {
			width: 288,
			margin: 2,
			errorCorrectionLevel: "M",
			color: {
				dark: "#0f172a",
				light: "#ffffff"
			}
		}).then((dataUrl) => {
			if (!cancelled) setQrDataUrl(dataUrl);
		}).catch(() => {
			if (!cancelled) setQrError(true);
		});
		return () => {
			cancelled = true;
		};
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3.5 mr-1.5" }), " Linku për qytetarin"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Gjurmim për qytetarin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Ndaje këtë QR ose link me qytetarin. Tregon vetëm informacion publik." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-72 w-full items-center justify-center rounded-lg border bg-white p-4",
						children: qrDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: qrDataUrl,
							alt: `QR code per ${code}`,
							className: "size-64 object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center text-sm text-muted-foreground",
							children: qrError ? "QR nuk u gjenerua. Provoni hapjen përsëri." : "Duke gjeneruar QR..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] uppercase tracking-wide text-muted-foreground",
							children: "Kodi i gjurmimit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-base font-semibold",
							children: code
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full rounded-md border bg-muted/40 px-3 py-2 text-xs font-mono break-all",
						children: url
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "flex-1",
							onClick: copy,
							children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 mr-1.5" }), " Kopjuar"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 mr-1.5" }), " Kopjo linkun"] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: url,
								target: "_blank",
								rel: "noreferrer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
							})
						})]
					})
				]
			})]
		})]
	});
}
function DossierWorkspace() {
	const { id } = Route.useParams();
	const get = useServerFn(getDossier);
	const advance = useServerFn(advanceDossier);
	const calculateValuation = useServerFn(calculateEkbValuation);
	const qc = useQueryClient();
	const { role, profile, can } = useDemoRole();
	const [activeTab, setActiveTab] = (0, import_react.useState)("permbledhje");
	const [aiSummaryText, setAiSummaryText] = (0, import_react.useState)(null);
	const [aiSummaryLoading, setAiSummaryLoading] = (0, import_react.useState)(false);
	const [aiSummaryRequestId, setAiSummaryRequestId] = (0, import_react.useState)(null);
	const [valuationLoading, setValuationLoading] = (0, import_react.useState)(false);
	const q = useQuery({
		queryKey: ["dossier", id],
		queryFn: () => get({ data: { id } })
	});
	const canRunAi = can("runAi");
	(0, import_react.useEffect)(() => {
		if (!canRunAi || !q.data || aiSummaryRequestId === id) return;
		setAiSummaryRequestId(id);
		setAiSummaryText(null);
		setAiSummaryLoading(true);
		fetch("/api/ai/summary", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id })
		}).then((r) => r.json()).then((r) => {
			if (r.ok && r.summary) setAiSummaryText(r.summary);
		}).catch(() => null).finally(() => setAiSummaryLoading(false));
	}, [
		id,
		canRunAi,
		q.data,
		aiSummaryRequestId
	]);
	if (q.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-sm text-muted-foreground",
		children: "Duke ngarkuar…"
	}) });
	if (!q.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: "Dosja nuk u gjet."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			asChild: true,
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dosjet",
				children: "Mbrapsht te dosjet"
			})
		})]
	}) });
	const { dossier: d, summary, alerts, deadline, nextStep } = q.data;
	const proc = PROCESSES[d.process];
	const currentPhase = proc.phases.find((p) => p.id === d.currentPhaseId);
	const currentStep = currentPhase?.steps.find((s) => s.id === d.currentStepId);
	const currentPhaseDuration = currentPhase ? phaseDurationDays(currentPhase) : void 0;
	const gisAssessment = buildAiGisAssessment(d);
	const latestValuation = [...d.insights].reverse().find((item) => item.kind === "valuation");
	async function handleCalculateValuation() {
		setValuationLoading(true);
		try {
			const result = await calculateValuation({ data: { id: d.id } });
			toast.success(`Akt Vleresimi u llogarit: ${result.valuation.finalValueAll.toLocaleString("sq-AL")} ALL`);
			await qc.invalidateQueries({ queryKey: ["dossier", id] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Llogaritja deshtoi");
		} finally {
			setValuationLoading(false);
		}
	}
	if (role === "citizen") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 md:px-6 py-5 max-w-[900px] mx-auto space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessNotice, {
			title: "Dosja e brendshme nuk shfaqet per qytetarin",
			body: "Ky ekran ka audit, shenime pune, dokumente dhe veprime administrative. Qytetari sheh vetem pamjen publike me kod gjurmimi."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-wider text-muted-foreground",
					children: "Perdoruesi aktiv"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-xl font-semibold",
					children: profile.displayName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						profile.credentialLabel,
						" - ",
						profile.description
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/track/$code",
							params: { code: d.trackingCode },
							children: "Hap portalin qytetar"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/track/$code",
							params: { code: "EKB-2026-000014" },
							children: "Demo EKB qytetar"
						})
					})]
				})
			]
		})]
	}) });
	const priority = deadline.state === "overdue" ? "high" : alerts.filter((a) => a.severity === "critical").length >= 2 ? "high" : deadline.state === "due_soon" ? "normal" : "low";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] space-y-3 px-3 py-3 sm:space-y-4 sm:px-4 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "work-surface p-3 sm:p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "ghost",
						className: "h-8 px-2 text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dosjet",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Kthehu"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "console-pill",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: d.trackingCode
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "console-pill border-warning/40 bg-warning/10 text-warning-foreground",
							children: currentStep?.title ?? currentPhase?.title ?? "Ne shqyrtim"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-muted-foreground",
										children: d.trackingCode
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: proc.title
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 line-clamp-2 text-lg font-semibold tracking-tight md:text-xl",
								children: d.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: [
									currentPhase?.institutions.join(" · "),
									" · Faza ",
									currentPhase?.order,
									" ·",
									" ",
									currentPhase?.title,
									currentPhaseDuration ? ` · Kohëzgjatje ${currentPhaseDuration} ditë` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: [
									"Operator përgjegjës:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: d.assignedOperatorName ? "font-medium text-foreground" : "",
										children: d.assignedOperatorName ?? "Pa caktuar"
									}),
									!d.assignedOperatorName && d.assignmentDueAt ? ` · auto pas ${new Date(d.assignmentDueAt).toLocaleTimeString("sq-AL", {
										hour: "2-digit",
										minute: "2-digit"
									})}` : ""
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:flex-col lg:items-end",
						children: [
							can("advanceDossier") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "w-full sm:w-auto",
								onClick: async () => {
									try {
										const r = await advance({ data: { id: d.id } });
										toast.success(r.final ? "Procedura u mbyll" : "U avancua hapi");
										qc.invalidateQueries({ queryKey: ["dossier", id] });
										qc.invalidateQueries({ queryKey: ["dashboard"] });
									} catch (e) {
										toast.error(e instanceof Error ? e.message : "Gabim");
									}
								},
								children: ["Avanco hapin ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 ml-1" })]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareTracking, { code: d.trackingCode })
							}),
							nextStep && !nextStep.isFinal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-full text-left text-[11px] text-muted-foreground lg:text-right",
								children: ["Tjetri: ", nextStep.step.title]
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierProgressRail, {
					phases: proc.phases,
					currentPhaseId: d.currentPhaseId
				}),
				alerts.length > 0 && can("runAi") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("mt-3 rounded-md border p-3", alerts.some((a) => a.severity === "critical") ? "border-destructive/40 bg-destructive/10" : "border-warning/40 bg-warning/10"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: cn("size-4 mt-0.5 shrink-0", alerts.some((a) => a.severity === "critical") ? "text-destructive" : "text-warning") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold",
									children: [
										"AI detektoi ",
										alerts.length,
										" pikë kritike — veprim i nevojshëm"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setActiveTab("ai"),
									className: "text-[11px] font-medium text-primary hover:underline shrink-0",
									children: "Hap AI Asistentin →"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-1.5 space-y-1",
								children: [alerts.slice(0, 3).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
										severity: a.severity,
										children: a.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground leading-relaxed",
										children: a.description
									})]
								}, a.id)), alerts.length > 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"+",
										alerts.length - 3,
										" alarme të tjera në tab-in AI"
									]
								}) : null]
							})]
						})]
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1.5 min-w-max",
						children: proc.phases.map((p) => {
							const isCurrent = p.id === d.currentPhaseId;
							const isDone = proc.phases.findIndex((x) => x.id === d.currentPhaseId) > p.order - 1;
							const durationDays = phaseDurationDays(p);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] border", isCurrent ? "bg-info/15 text-info border-info/30" : isDone ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-transparent"),
								children: [
									isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }) : isCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-3 fill-info text-info" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-3" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["F", p.order] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] opacity-75",
										children: [durationDays, " ditë"]
									})
								]
							}, p.id);
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			value: activeTab,
			onValueChange: setActiveTab,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid w-full grid-cols-2 gap-2 rounded-xl border bg-white/80 p-2 shadow-soft sm:grid-cols-3 sm:p-3 xl:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierTabDropdown, {
							title: "Orientim",
							description: "Pamja e shpejte",
							activeTab,
							onSelect: setActiveTab,
							options: [{
								value: "permbledhje",
								icon: Sparkles,
								label: "Kryesore"
							}]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierTabDropdown, {
							title: "Dosja",
							description: "Dokumente dhe kontroll",
							activeTab,
							onSelect: setActiveTab,
							options: [{
								value: "dokumentet",
								icon: FileText,
								label: "Dokumente"
							}, {
								value: "verifikimi",
								icon: UserCheck,
								label: "Verifikim"
							}]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierTabDropdown, {
							title: "Ndjekje",
							description: "Afate, ankesa, hapa",
							activeTab,
							onSelect: setActiveTab,
							options: [
								{
									value: "pershpejtimi",
									icon: Clock,
									label: "Afate",
									badge: d.expeditedProcedure?.status === "submitted" ? 1 : void 0,
									badgeTone: "warning"
								},
								...can("viewAudit") ? [{
									value: "ankesa",
									icon: MessageSquare,
									label: "Ankesa",
									badge: d.citizenComplaints?.length || void 0,
									badgeTone: "danger"
								}] : [],
								{
									value: "lista",
									icon: ListChecks,
									label: "Hapat"
								}
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierTabDropdown, {
							title: "Vendim",
							description: "Miratim dhe dalje",
							activeTab,
							onSelect: setActiveTab,
							options: [
								{
									value: "workflow",
									icon: ClipboardCheck,
									label: "Miratimi"
								},
								...can("generateDocuments") ? [{
									value: "gjenero",
									icon: FileText,
									label: "Gjenero"
								}] : [],
								...can("viewAudit") ? [{
									value: "historiku",
									icon: History,
									label: "Historik"
								}] : []
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierTabDropdown, {
							title: "Harta & AI",
							description: "GIS dhe asistence",
							activeTab,
							onSelect: setActiveTab,
							options: [{
								value: "gis",
								icon: MapPinned,
								label: "Harta"
							}, ...can("runAi") ? [{
								value: "ai",
								icon: Sparkles,
								label: "AI"
							}] : []]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "permbledhje",
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-info" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-sm font-semibold",
											children: "AI përmbledhje për menaxherin"
										}),
										aiSummaryLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground animate-pulse",
											children: "Duke analizuar…"
										})
									]
								}), aiSummaryText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed whitespace-pre-wrap",
									children: aiSummaryText
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "text-xs space-y-1 text-foreground/90",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Procesi:" }),
											" ",
											summary.process
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Faza aktuale:" }),
											" ",
											summary.currentPhase,
											" — ",
											summary.currentStep
										] }),
										summary.nextStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Hapi tjetër:" }),
											" ",
											summary.nextStep
										] }) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dokumente:" }),
											" ",
											summary.documentsUploaded,
											" të ngarkuara,",
											" ",
											summary.documentsMissing.length,
											" mungojnë"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Afati:" }),
											" ",
											summary.deadlineState,
											summary.daysToNearestDeadline !== void 0 ? ` (${summary.daysToNearestDeadline} ditë)` : ""
										] }),
										currentPhaseDuration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Kohëzgjatja e fazës:" }),
											" ",
											currentPhaseDuration,
											" ditë",
											currentStep?.slaDays ? ` (hapi aktual ${currentStep.slaDays} ditë)` : ""
										] }) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Bazë ligjore:" }),
											" ",
											summary.legalBasis.join(", ")
										] })
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold mb-1.5",
									children: "Fushat që mungojnë"
								}), summary.documentsMissing.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "text-xs space-y-1",
									children: summary.documentsMissing.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3 text-warning" }),
											" ",
											t
										]
									}, t))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Të gjitha të plotësuara."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold mb-1.5",
								children: "Alarme kritike"
							}), alerts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
										severity: a.severity,
										children: a.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: a.description
									})]
								}, a.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Pa alarme."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-emerald-200 bg-emerald-50/70 p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-8 shrink-0 place-items-center rounded-md border border-emerald-200 bg-emerald-100 text-emerald-800",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
												className: "text-sm font-semibold text-emerald-950",
												children: "AI GIS aktiv"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs leading-relaxed text-emerald-800",
												children: gisAssessment.aiUse
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-xs font-medium text-emerald-950",
												children: [
													gisAssessment.zoning,
													" - ",
													gisAssessment.landCategory
												]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 shrink-0 border-emerald-300 bg-white",
									onClick: () => setActiveTab("gis"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "mr-1.5 size-3.5" }), "Hap AI GIS"]
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "dokumentet",
					className: "space-y-3",
					children: [
						can("uploadDocument") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadCard, { dossierId: d.id }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessNotice, {
							title: "Ngarkimi i dokumenteve eshte i kufizuar",
							body: "Ky rol mund te konsultoje dosjen, por nuk mund te shtoje dokumente administrative."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold mb-2",
								children: "Dokumentet e ngarkuara"
							}), d.documents.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y",
								children: d.documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "py-2 text-sm flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium truncate",
												children: doc.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													doc.type,
													" · ",
													doc.status
												]
											}),
											doc.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex flex-wrap items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 rounded-md border border-success/25 bg-success/10 px-1.5 py-0.5 text-[10px] text-success",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }), doc.notes.includes("Vulosur elektronikisht") ? "Vulosur elektronikisht" : doc.notes]
												}), doc.notes.includes("Vulosur elektronikisht") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-flex items-center rounded-md border border-info/25 bg-info/10 px-1.5 py-0.5 text-[10px] text-info",
													children: "I dërguar qytetarit"
												}) : null]
											}) : null
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground shrink-0",
										children: doc.uploadedAt?.slice(0, 10)
									})]
								}, doc.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Pa dokumente."
							})]
						}),
						d.insights.filter((i) => i.kind === "extraction").length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold mb-2",
								children: "Fusha të ekstraktuara nga AI"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 text-sm",
								children: d.insights.filter((i) => i.kind === "extraction").map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "border rounded-md p-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: i.text
									}), i.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "mt-1 text-[11px] bg-muted/40 rounded p-1.5 overflow-x-auto",
										children: JSON.stringify(i.data, null, 2)
									}) : null]
								}, i.id))
							})]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "verifikimi",
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequesterVerificationPanel, {
						dossier: d,
						readOnly: !can("uploadDocument")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "pershpejtimi",
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditedProcedurePanel, {
						dossier: d,
						readOnly: !can("advanceDossier")
					})
				}),
				can("viewAudit") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "ankesa",
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorComplaintsPanel, { dossier: d })
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "lista",
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-4 text-info" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Checklist për fazën aktuale"
							})]
						}), currentStep?.requiredDocuments?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5 text-sm",
							children: currentStep.requiredDocuments.map((t) => {
								const ok = d.documents.some((doc) => doc.type === t);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: ok ? "" : "text-muted-foreground",
										children: t
									})]
								}, t);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Pa kërkesa specifike."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold mb-2",
							children: "Lista e plotë e procesit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-2 text-sm",
							children: proc.phases.flatMap((p) => p.steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-l-2 pl-3 py-0.5 border-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground",
										children: [
											"F",
											p.order,
											" · ",
											p.title
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-sm",
										children: s.title
									}),
									s.requiredDocuments?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: ["Dok: ", s.requiredDocuments.join(", ")]
									}) : null
								]
							}, s.id)))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "workflow",
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalHierarchyCard, {
						dossier: d,
						currentPhase
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "relative border-l ml-3 space-y-3",
							children: proc.phases.flatMap((p) => p.steps.map((s) => {
								const phaseIdx = proc.phases.findIndex((x) => x.id === p.id);
								const currentPhaseIdx = proc.phases.findIndex((x) => x.id === d.currentPhaseId);
								const isCurrent = s.id === d.currentStepId;
								const isDone = phaseIdx < currentPhaseIdx || phaseIdx === currentPhaseIdx && p.steps.findIndex((x) => x.id === s.id) < p.steps.findIndex((x) => x.id === d.currentStepId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "ml-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute -left-[7px] mt-1 size-3 rounded-full border-2 border-background", isDone ? "bg-success" : isCurrent ? "bg-info" : "bg-muted") }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[11px] text-muted-foreground",
													children: [
														"F",
														p.order,
														" · ",
														p.title
													]
												}),
												isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
													severity: "info",
													children: "aktiv"
												}),
												isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
													severity: "info",
													children: "kryer"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: s.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground",
											children: [
												s.institution,
												s.slaDays ? ` · Kohëzgjatje ${s.slaDays} ditë` : "",
												s.manual ? " · manual" : ""
											]
										}),
										s.criticalPoints?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 flex flex-wrap gap-1",
											children: s.criticalPoints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
												severity: c.severity,
												children: c.label
											}, c.id))
										}) : null
									]
								}, s.id);
							}))
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "gis",
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkptGisDemoCard, { dossier: d })
				}),
				can("runAi") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "ai",
					className: "space-y-3",
					children: [
						d.process === "ekb_privatization" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EkbValuationAssistant, {
							dossier: d,
							loading: valuationLoading,
							latestValuation,
							onCalculate: handleCalculateValuation
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiExtractPanel, { dossier: d }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiAssistPanel, { dossier: {
							id: d.id,
							trackingCode: d.trackingCode
						} })
					]
				}) : null,
				can("generateDocuments") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "gjenero",
					className: "space-y-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocGeneratorPanel, { dossierId: d.id })
				}) : null,
				can("viewAudit") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "historiku",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Historiku i audituar"
							})]
						}), d.audit.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-1.5",
							children: [...d.audit].reverse().map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-xs flex items-start gap-2 border-b pb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 mt-0.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: e.action
									}), e.details ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [" — ", e.details]
									}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: [
											e.at.replace("T", " ").slice(0, 19),
											" · ",
											e.actor
										]
									})]
								})]
							}, e.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Pa ngjarje."
						})]
					})
				}) : null
			]
		})]
	}) });
}
function phaseDurationDays(phase) {
	return phase.steps.reduce((total, step) => total + (step.slaDays ?? 0), 0);
}
function DossierTabDropdown({ title, description, options, activeTab, onSelect }) {
	const activeOption = options.find((option) => option.value === activeTab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-lg border border-border/80 bg-muted/30 p-2.5 transition-colors", activeOption && "border-primary/40 bg-primary/5"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-semibold uppercase tracking-wide text-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden text-[10px] text-muted-foreground 2xl:block",
					children: description
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: activeOption?.value,
				onValueChange: onSelect,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: cn("h-10 w-full rounded-md border bg-white text-sm font-semibold shadow-none", activeOption && "border-primary/40 text-primary"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Zgjidh seksionin" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: options.map((option) => {
					const Icon = option.icon;
					const tone = option.badgeTone ?? "neutral";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: option.value,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex w-full items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 shrink-0 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: option.label }),
								option.badge !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none", tone === "danger" && "bg-destructive/15 text-destructive", tone === "warning" && "bg-warning/20 text-warning-foreground", tone === "neutral" && "bg-muted text-muted-foreground"),
									children: option.badge
								}) : null
							]
						})
					}, option.value);
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 truncate text-[11px] text-muted-foreground",
				children: activeOption ? `Aktive: ${activeOption.label}` : description
			})
		]
	});
}
function fmtAll(value) {
	if (value === void 0 || value === null || !Number.isFinite(value)) return "-";
	return `${Math.round(value).toLocaleString("sq-AL")} ALL`;
}
function EkbValuationAssistant({ dossier, loading, latestValuation, onCalculate }) {
	const data = latestValuation?.data;
	const steps = Array.isArray(data?.steps) ? data.steps : [];
	const finalValue = typeof data?.finalValueAll === "number" ? data.finalValueAll : dossier.finalValueAll;
	const missingInputs = dossier.property.familyIncomeAll === void 0 || dossier.property.marketPriceAll === void 0;
	const auditActor = dossier.assignedOperatorName ?? dossier.assignedOperatorId ?? "Asistent AI";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden border-primary/30 bg-primary/5 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b bg-white px-4 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "AI llogarit Akt Vleresimi"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-lg font-semibold",
							children: "Nga dokumentet te akti final, me audit te plote"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground",
							children: "AI merr te ardhurat familjare, siperfaqen, cmimin e tregut dhe truallin; aplikon VKM 179/2020 + VKM 898/2020 hap pas hapi; gjeneron dokumentin \"Akt Vleresimi\"."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: onCalculate,
					disabled: loading || missingInputs,
					className: "h-10",
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "mr-1.5 size-4" }), "Llogarit me AI dhe krijo Aktin"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-2 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValuationStage, {
						number: "1",
						title: "Te dhenat e nxjerra",
						body: "AI perdor fushat e verifikuara nga dokumentet e dosjes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValuationStage, {
						number: "2",
						title: "Formula VKM",
						body: "Vp = Vb + Vt - Vsh - Vg, me referenca ne cdo hap."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValuationStage, {
						number: "3",
						title: "Akt + audit",
						body: `Regjistrohet kush e llogariti: ${auditActor}.`
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 p-4 lg:grid-cols-[0.9fr_1.1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniFact, {
						label: "Te ardhura familjare",
						value: fmtAll(dossier.property.familyIncomeAll)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniFact, {
						label: "Siperfaqe",
						value: dossier.property.areaSqm ? `${dossier.property.areaSqm} m2` : "-"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniFact, {
						label: "Cmimi i tregut",
						value: fmtAll(dossier.property.marketPriceAll)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniFact, {
						label: "Vlera e truallit",
						value: fmtAll(dossier.property.landPriceAll ?? 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniFact, {
						label: "Vlera finale",
						value: fmtAll(finalValue),
						strong: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-primary/25 bg-white px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wide text-muted-foreground",
								children: "Dokumenti qe krijohet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-sm font-semibold text-primary",
								children: "Akt Vleresimi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] leading-relaxed text-muted-foreground",
								children: "Ruhet ne dokumente dhe lidhet me historikun e auditimit."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-primary/25 bg-white px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wide text-muted-foreground",
								children: "Audit trail"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 text-sm font-semibold",
								children: auditActor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] leading-relaxed text-muted-foreground",
								children: "Formula, vlera finale, dokumenti dhe koha ruhen automatikisht."
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border bg-white p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Hapat e llogaritjes"
					}), latestValuation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground",
						children: latestValuation.createdAt.replace("T", " ").slice(0, 16)
					}) : null]
				}), missingInputs ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-warning/35 bg-warning/10 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-warning-foreground",
						children: "Mungojne fusha te domosdoshme"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: "Mungojne te ardhurat familjare ose cmimi i tregut. Ngarko dokumentet dhe perdor nxjerrjen AI para llogaritjes."
					})]
				}) : steps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-2",
					children: steps.map((step, index) => {
						const item = step;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-md bg-muted/40 p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-5 shrink-0 place-items-center rounded bg-primary text-[10px] font-semibold text-primary-foreground",
									children: index + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold",
											children: item.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: item.formula
										}),
										typeof item.resultAll === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-xs font-semibold",
											children: fmtAll(item.resultAll)
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-[10px] text-muted-foreground",
											children: item.legalReference
										})
									]
								})]
							})
						}, `${item.title ?? "step"}-${index}`);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-primary/25 bg-primary/5 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Gati per llogaritje"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: "Kliko butonin per te krijuar hapat, vleren finale, dokumentin \"Akt Vleresimi\" dhe ngjarjen ne audit trail."
					})]
				})]
			})]
		})]
	});
}
function ValuationStage({ number, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-2 rounded-md border bg-primary/5 p-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-6 shrink-0 place-items-center rounded-md bg-primary text-xs font-semibold text-primary-foreground",
			children: number
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-[11px] leading-relaxed text-muted-foreground",
				children: body
			})]
		})]
	});
}
function MiniFact({ label, value, strong = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-white px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-0.5 text-sm tabular-nums", strong && "font-semibold text-primary"),
			children: value
		})]
	});
}
function ApprovalHierarchyCard({ dossier, currentPhase }) {
	const institution = currentPhase?.institutions[0] ?? "Institucioni";
	const steps = [
		{
			title: "Eksperti",
			subtitle: dossier.assignedOperatorName ?? "Pa caktuar",
			state: dossier.assignedOperatorName ? "Ne proces" : "Ne pritje",
			icon: UserCheck,
			active: true
		},
		{
			title: "Sekretari",
			subtitle: institution,
			state: "Ne pritje",
			icon: FileText,
			active: false
		},
		{
			title: "Drejtori Juridik",
			subtitle: currentPhase?.title ?? "Verifikim",
			state: "Refuzoi",
			icon: Scale,
			active: false
		},
		{
			title: "Drejtori i Pergjithshem",
			subtitle: institution,
			state: "Refuzoi",
			icon: ShieldCheck,
			active: false
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "work-surface p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Hierarkia e Miratimit"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "console-pill bg-primary/10 text-primary",
				children: dossier.status === "blocked" ? "Bllokuar" : "Ne Shqyrtim"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid gap-3 text-center md:grid-cols-4",
			"aria-label": "Hierarkia e miratimit te dosjes",
			children: steps.map((step, index) => {
				const Icon = step.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "relative",
					children: [
						index > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-1/2 top-5 hidden h-px w-full bg-border md:block" }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("relative mx-auto grid size-11 place-items-center rounded-full border bg-card text-muted-foreground shadow-soft", step.active && "border-primary bg-primary text-primary-foreground"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-xs font-semibold",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto mt-0.5 max-w-[9rem] truncate text-[11px] text-muted-foreground",
							children: step.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("mt-1 text-[10px] font-semibold", step.active ? "text-primary" : "text-muted-foreground"),
							children: step.state
						})
					]
				}, step.title);
			})
		})]
	});
}
function DossierProgressRail({ phases, currentPhaseId }) {
	const currentIndex = Math.max(0, phases.findIndex((phase) => phase.id === currentPhaseId));
	const progress = phases.length > 1 ? (currentIndex + 1) / phases.length * 100 : 100;
	const currentPhase = phases[currentIndex] ?? phases[0];
	const nextPhase = phases[currentIndex + 1];
	const completedCount = currentIndex;
	const waitingCount = Math.max(phases.length - currentIndex - 1, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-xl border border-border bg-white p-3 shadow-soft sm:p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 shrink-0 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground shadow-soft ring-4 ring-primary/10 sm:size-14 sm:text-xl",
						children: currentIndex + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Ecuria e dosjes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-1 line-clamp-2 text-base font-semibold text-foreground",
								children: ["Hapi aktual: ", currentPhase?.title ?? "Ne proces"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm leading-5 text-muted-foreground",
								children: [
									"Dosja eshte ne hapin ",
									currentIndex + 1,
									" nga ",
									phases.length,
									".",
									nextPhase ? ` Pas ketij hapi vijon: ${nextPhase.title}.` : " Ky eshte hapi final."
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2 rounded-lg bg-muted/25 p-1.5 text-center sm:min-w-[360px] sm:gap-3 sm:bg-transparent sm:p-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressFact, {
							label: "Kryer",
							value: completedCount,
							tone: "success"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressFact, {
							label: "Ne proces",
							value: 1,
							tone: "primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressFact, {
							label: "Ne pritje",
							value: waitingCount,
							tone: "muted"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between gap-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium text-foreground",
						children: [Math.round(progress), "% ecuri e procesit"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-primary",
						children: [
							currentIndex + 1,
							"/",
							phases.length,
							" hapa"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2.5 overflow-hidden rounded-full bg-primary/12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all",
						style: { width: `${progress}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-1 mt-4 overflow-x-auto px-1 pb-1 sm:mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "grid min-w-[540px] gap-0 lg:min-w-0",
					style: { gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))` },
					children: phases.map((phase, index) => {
						const isCurrent = index === currentIndex;
						const isDone = index < currentIndex;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative px-1 text-center",
							children: [index > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								className: cn("absolute left-[-50%] top-5 z-0 h-1 w-full rounded-full sm:top-6", index <= currentIndex ? "bg-success/55" : "bg-primary/15")
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 flex flex-col items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("grid size-10 shrink-0 place-items-center rounded-full border bg-white text-sm font-semibold transition-all sm:size-12", isDone && "border-success bg-success text-white shadow-soft", isCurrent && "animate-pulse border-primary bg-primary text-primary-foreground ring-4 ring-primary/15 shadow-soft", !isDone && !isCurrent && "animate-pulse border-primary/25 bg-primary/5 text-primary/70 ring-2 ring-primary/10"),
										children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }) : index + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 min-w-0 px-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
											children: ["Hapi ", index + 1]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: cn("mx-auto mt-0.5 line-clamp-2 max-w-[7.5rem] text-[11px] font-medium leading-tight sm:max-w-[9.5rem]", isCurrent ? "text-primary" : "text-foreground"),
											children: phase.title
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", isDone && "bg-success/10 text-success", isCurrent && "bg-primary/10 text-primary", !isDone && !isCurrent && "bg-muted text-muted-foreground"),
										children: isDone ? "Kryer" : isCurrent ? "Ne proces" : "Ne pritje"
									})
								]
							})]
						}, phase.id);
					})
				})
			})
		]
	});
}
function ProgressFact({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("px-1.5 py-1 sm:px-2", tone === "success" && "text-success", tone === "primary" && "text-primary"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("text-base font-semibold tabular-nums sm:text-lg", tone === "success" && "text-success", tone === "primary" && "text-primary", tone === "muted" && "text-foreground"),
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[9px] font-medium uppercase tracking-wide text-muted-foreground sm:text-[10px]",
			children: label
		})]
	});
}
function formatOperatorDateTime(iso) {
	try {
		return new Date(iso).toLocaleString("sq-AL", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {
		return iso;
	}
}
function uploadedDocumentUrl(code, documentId, download = false) {
	const params = new URLSearchParams({ uploadedDocumentId: documentId });
	if (download) params.set("download", "1");
	return `/api/public/track/${encodeURIComponent(code)}?${params.toString()}`;
}
function complaintStatusLabel(status) {
	if (status === "resolved") return "E mbyllur";
	if (status === "in_review") return "Në shqyrtim";
	return "E re";
}
function OperatorComplaintsPanel({ dossier }) {
	const complaints = [...dossier.citizenComplaints ?? []].reverse();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Ankesa të qytetarit"
			})]
		}), complaints.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Nuk ka ankesa të dërguara nga qytetari për këtë dosje."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: complaints.map((complaint) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-md border border-warning/25 bg-warning/5 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold leading-snug",
								children: complaint.subject
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: [
									formatOperatorDateTime(complaint.createdAt),
									" · ",
									complaint.routedToLabel
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
							severity: complaint.status === "resolved" ? "info" : "warning",
							children: complaintStatusLabel(complaint.status)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed",
						children: complaint.message
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-background/80 px-2 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Faza"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: complaint.phaseTitle ?? "Faza aktuale"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-background/80 px-2 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Hapi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: complaint.stepTitle ?? "Hapi aktual"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-background/80 px-2 py-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: "Kontakt"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: complaint.contact ?? "Pa kontakt"
								})]
							})
						]
					})
				]
			}, complaint.id))
		})]
	});
}
function expeditedStatusLabel(status) {
	if (status === "approved") return "E miratuar";
	if (status === "submitted") return "Ne shqyrtim";
	if (status === "rejected") return "E refuzuar";
	return "Pa kerkese";
}
function ExpeditedReviewDocumentTile({ trackingCode, label, fileName, documentId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border px-3 py-2",
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
				children: "Skedari nuk eshte ruajtur ne kete demo."
			}) : null
		]
	});
}
function expeditedDocumentId(dossier, type, fileName, explicitId) {
	return explicitId ?? dossier.documents.find((doc) => doc.type === type && doc.name === fileName)?.id;
}
function ExpeditedProcedurePanel({ dossier, readOnly }) {
	const expedited = dossier.expeditedProcedure;
	const [reviewNote, setReviewNote] = (0, import_react.useState)(expedited?.reviewNote ?? "");
	const review = useServerFn(reviewExpeditedProcedure);
	const qc = useQueryClient();
	const status = expedited?.status ?? "not_requested";
	const statusSeverity = status === "approved" ? "info" : status === "rejected" ? "critical" : "warning";
	async function save(statusToSave) {
		try {
			await review({ data: {
				id: dossier.id,
				status: statusToSave,
				reviewNote
			} });
			toast.success(statusToSave === "approved" ? "Procedura e pershpejtuar u miratua" : "Procedura e pershpejtuar u refuzua");
			qc.invalidateQueries({ queryKey: ["dossier", dossier.id] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gabim ne shqyrtim");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "size-8 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Procedure e pershpejtuar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Kerkesa e qytetarit shqyrtohet vetem kur ka formular PDF te plotesuar dhe dokument provues. Tarifa demo nuk garanton miratim."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
				severity: statusSeverity,
				children: expeditedStatusLabel(status)
			})]
		}), !expedited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Ende nuk ka kerkese per procedure te pershpejtuar nga qytetari."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border bg-muted/30 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: expedited.reasonLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: [
								"Derguar: ",
								formatOperatorDateTime(expedited.requestedAt),
								expedited.paymentRequired && expedited.paymentAmountAll ? ` · Tarife demo ${expedited.paymentAmountAll.toLocaleString("sq-AL")} ALL` : " · Pa tarife"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed",
							children: expedited.justification
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditedReviewDocumentTile, {
							trackingCode: dossier.trackingCode,
							label: "Formulari PDF",
							fileName: expedited.requestPdfName,
							documentId: expeditedDocumentId(dossier, "expedite_request_form", expedited.requestPdfName, expedited.requestPdfDocumentId)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditedReviewDocumentTile, {
							trackingCode: dossier.trackingCode,
							label: "Dokumenti provues",
							fileName: expedited.supportingDocumentName,
							documentId: expeditedDocumentId(dossier, "expedite_supporting_document", expedited.supportingDocumentName, expedited.supportingDocumentId)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpeditedReviewDocumentTile, {
							trackingCode: dossier.trackingCode,
							label: "Mandati",
							fileName: expedited.paymentReceiptName,
							documentId: expeditedDocumentId(dossier, "payment_receipt", expedited.paymentReceiptName, expedited.paymentReceiptDocumentId)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Shenim shqyrtimi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: reviewNote,
						onChange: (e) => setReviewNote(e.target.value),
						disabled: readOnly || status !== "submitted",
						rows: 3,
						className: "text-sm",
						placeholder: "p.sh. Miratohet sepse dokumentacioni provon afatin e afert."
					})]
				}),
				!readOnly && status === "submitted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: () => save("rejected"),
						children: "Refuzo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => save("approved"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 mr-1" }), "Mirato pershpejtimin"]
					})]
				}) : null
			]
		})]
	});
}
var REQUESTER_DOC_LABELS = {
	id_card_copy: "Kopje e kartes se identitetit",
	ashk_certificate: "Certifikate pronesie ASHK",
	ashk_certificate_final: "Certifikate perfundimtare ASHK",
	ownership_extract: "Ekstrakt pronesie nga kadastra",
	legal_authorization: "Prokure / autorizim perfaqesimi"
};
function requesterDocLabel(type) {
	return REQUESTER_DOC_LABELS[type] ?? type.replace(/_/g, " ");
}
function requiredRequesterDocs(process, claimType) {
	const base = ["id_card_copy", process === "expropriation" ? "ownership_extract" : "ashk_certificate"];
	return claimType === "legal_representative" ? [...base, "legal_authorization"] : base;
}
function hasRequesterDoc(dossier, type) {
	if (type === "ashk_certificate") return dossier.documents.some((doc) => (doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") && doc.status !== "rejected");
	if (type === "ownership_extract") return dossier.documents.some((doc) => (doc.type === "ownership_extract" || doc.type === "ashk_certificate" || doc.type === "ashk_certificate_final") && doc.status !== "rejected");
	return dossier.documents.some((doc) => doc.type === type && doc.status !== "rejected");
}
function verificationLabel(status) {
	if (status === "verified") return "E verifikuar";
	if (status === "needs_documents") return "Kerkohet plotesim";
	if (status === "rejected") return "E refuzuar";
	return "Ne pritje";
}
function RequesterVerificationPanel({ dossier, readOnly }) {
	const current = dossier.requesterVerification;
	const [claimType, setClaimType] = (0, import_react.useState)(current?.claimType ?? "owner");
	const [cadastralSubjectName, setCadastralSubjectName] = (0, import_react.useState)(current?.cadastralSubjectName ?? dossier.parties[0]?.fullName ?? "");
	const [notes, setNotes] = (0, import_react.useState)(current?.notes ?? "");
	const updateVerification = useServerFn(updateRequesterVerification);
	const qc = useQueryClient();
	const requiredDocs = requiredRequesterDocs(dossier.process, claimType);
	const missingDocs = requiredDocs.filter((type) => !hasRequesterDoc(dossier, type));
	const status = current?.status ?? "pending";
	const statusSeverity = status === "verified" ? "info" : status === "rejected" ? "critical" : "warning";
	async function save(statusToSave) {
		try {
			await updateVerification({ data: {
				id: dossier.id,
				claimType,
				cadastralSubjectName,
				status: statusToSave,
				notes
			} });
			toast.success(statusToSave === "verified" ? "E drejta e kerkuesit u verifikua" : "Statusi i verifikimit u perditesua");
			qc.invalidateQueries({ queryKey: ["dossier", dossier.id] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Gabim ne verifikim");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-8 rounded-md bg-primary/10 text-primary grid place-items-center shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "E drejta per te marre dokumentin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Kontrollon nese kerkuesi eshte personi ne kadaster ose perfaqesues ligjor i tij."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
					severity: statusSeverity,
					children: verificationLabel(status)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border border-warning/25 bg-warning/5 p-3 text-xs text-warning-foreground mb-3",
				children: "Pa kete verifikim dokumentet e vulosura nuk shfaqen per shkarkim ne portalin e qytetarit."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Roli i kerkuesit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: claimType,
						onValueChange: (value) => setClaimType(value),
						disabled: readOnly,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "owner",
							children: "Personi/pronari ne kadaster"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "legal_representative",
							children: "Perfaqesues ligjor"
						})] })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Emri qe duhet te perputhet me kadastres"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: cadastralSubjectName,
						onChange: (e) => setCadastralSubjectName(e.target.value),
						disabled: readOnly,
						className: "h-9 text-sm"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-1 md:grid-cols-3 gap-2",
				children: requiredDocs.map((type) => {
					const uploaded = hasRequesterDoc(dossier, type);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("rounded-md border px-3 py-2", uploaded ? "border-success/25 bg-success/5" : "border-warning/30 bg-warning/5"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-medium",
							children: [type === "id_card_copy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdCard, { className: "size-4 text-muted-foreground" }) : type === "legal_authorization" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: requesterDocLabel(type) })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("mt-1 text-[11px]", uploaded ? "text-success" : "text-warning-foreground"),
							children: uploaded ? "U ngarkua ne dosje" : "Mungon"
						})]
					}, type);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Shenim verifikimi"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					disabled: readOnly,
					rows: 3,
					className: "text-sm",
					placeholder: "p.sh. ID dhe certifikata ASHK perputhen me emrin e kerkuesit."
				})]
			}),
			!readOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap justify-end gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => save("needs_documents"),
						children: "Kthe per plotesim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: () => save("rejected"),
						children: "Refuzo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => save("verified"),
						disabled: missingDocs.length > 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5 mr-1" }), "Verifiko te drejten"]
					})
				]
			}) : null,
			missingDocs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[11px] text-muted-foreground",
				children: [
					"Per verifikim mungon: ",
					missingDocs.map(requesterDocLabel).join(", "),
					"."
				]
			}) : null
		]
	});
}
function AkptGisDemoCard({ dossier }) {
	const gis = buildAiGisAssessment(dossier);
	const mapPdfUrl = `/api/public/track/${encodeURIComponent(dossier.trackingCode)}?mapPdf=1`;
	const place = gis.place;
	const mapPrintUrl = `/api/public/track/${encodeURIComponent(dossier.trackingCode)}?mapPrint=1`;
	const riskLabel = gis.aiRiskLevel === "high" ? "rrezik i larte" : gis.aiRiskLevel === "medium" ? "rrezik mesatar" : "rrezik i ulet";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden border-emerald-200 bg-emerald-50/70",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-emerald-200/80 px-3 py-2.5 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 size-8 shrink-0 rounded-md bg-emerald-100 text-emerald-800 grid place-items-center border border-emerald-200",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-emerald-950",
							children: "AI GIS · AKPT / e-Harta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-emerald-800 mt-0.5",
							children: gis.aiUse
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col items-end gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800",
							children: ["AI · ", riskLabel]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							className: "h-8 border-emerald-300 bg-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: mapPdfUrl,
								download: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 size-3.5" }), "Shkarko PDF"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							className: "h-8 border-emerald-300 bg-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: mapPrintUrl,
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1.5 size-3.5" }), "Printo / PDF"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-2 p-3 md:grid-cols-3 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkptFact, {
						label: "Zona e verifikuar",
						value: dossier.property.zone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkptFact, {
						label: "Poligoni i parceles",
						value: `${place.parcelPolygon.length} pika`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkptFact, {
						label: "Zonimi GIS",
						value: gis.zoning
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkptFact, {
						label: "Kategoria e tokes",
						value: gis.landCategory
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AkptFact, {
						label: "Sinjali AI",
						value: gis.aiSignal
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-3 mb-3 overflow-hidden rounded-md border border-emerald-200 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-[16/7] min-h-56 bg-slate-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParcelMap, {
						center: place,
						parcelPolygon: place.parcelPolygon
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 border-t bg-white/90 px-3 py-2 text-xs text-emerald-900 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium",
						children: [
							"Vendodhja e prones - ",
							place.lat.toFixed(4),
							", ",
							place.lon.toFixed(4)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: gis.realMapUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-1 font-medium text-emerald-800 hover:underline",
						children: ["Hap harten reale", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-3 mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: "Konsultim read-only i perdorur nga AI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-amber-800",
						children: ["Demo regjistron konsultimin si evidence pune, por nuk shkruan te dhena ne sistemet shteterore. ", gis.aiSignal]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-amber-800",
						children: place.accuracyLabel
					})
				]
			})
		]
	});
}
function AkptFact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-emerald-200 bg-white/75 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] text-emerald-700",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-sm font-medium text-emerald-950",
			children: value
		})]
	});
}
function UploadCard({ dossierId }) {
	const [type, setType] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [extracted, setExtracted] = (0, import_react.useState)("");
	const [electronicSeal, setElectronicSeal] = (0, import_react.useState)(true);
	const upload = useServerFn(uploadDocument);
	const qc = useQueryClient();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4 text-info" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Ngarko PDF dhe vulos elektronikisht"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 rounded-md border border-info/20 bg-info/5 p-3 text-xs text-muted-foreground",
				children: "Operatori ngarkon dosjen në PDF; sistemi vendos vulën demo të institucionit dhe e ruan dokumentin si të verifikuar në historikun e dosjes dhe në portalin e qytetarit."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "PDF i dosjes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "file",
					accept: "application/pdf",
					className: "h-9 text-sm",
					onChange: (e) => {
						const file = e.target.files?.[0];
						if (!file) return;
						setName(file.name);
						if (!type) setType("dossier_pdf");
						setElectronicSeal(true);
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Tipi (p.sh. dossier_pdf)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: type,
						onChange: (e) => setType(e.target.value),
						className: "h-9 text-sm"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-xs",
						children: "Emri i skedarit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "h-9 text-sm"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5 mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs",
					children: "Fusha të ekstraktuara (JSON, opsionale)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: extracted,
					onChange: (e) => setExtracted(e.target.value),
					rows: 3,
					className: "text-xs font-mono",
					placeholder: "{\"emri\":\"Arta Beqiri\",\"atesia\":\"Petrit\"}"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 flex items-start gap-2 rounded-md border bg-muted/30 p-2 text-xs cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: electronicSeal,
					onCheckedChange: (v) => setElectronicSeal(v === true),
					className: "mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-success" }), "Vulos elektronikisht me vulën e institucionit"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "block text-muted-foreground mt-0.5",
					children: [
						"Për demo, vula merret nga ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/stamps/ashk-demo-stamp.png" }),
						" dhe dokumenti shënohet si i verifikuar. Dokumenti i vulosur shfaqet automatikisht te gjurmimi i qytetarit."
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex justify-end gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: async () => {
						try {
							let extractedObj;
							if (extracted.trim()) try {
								extractedObj = JSON.parse(extracted);
							} catch {
								toast.error("JSON i pavlefshëm");
								return;
							}
							await upload({ data: {
								id: dossierId,
								type: type || "document",
								name: name || "untitled.pdf",
								extracted: extractedObj,
								aiGenerated: !!extractedObj,
								electronicSeal
							} });
							toast.success(electronicSeal ? "PDF u ngarkua dhe u vulos" : "U ngarkua");
							setName("");
							setType("");
							setExtracted("");
							setElectronicSeal(true);
							qc.invalidateQueries({ queryKey: ["dossier", dossierId] });
						} catch (e) {
							toast.error(e instanceof Error ? e.message : "Gabim");
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 mr-1" }), " Ngarko"]
				})
			})
		]
	});
}
//#endregion
export { DossierWorkspace as component };
