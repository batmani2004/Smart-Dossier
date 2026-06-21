import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as TriangleAlert } from "../_libs/lucide-react.mjs";
import { M as redirect, _ as Link, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as useLocation, m as lazyRouteComponent, p as Outlet, s as Scripts, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { X as booleanType, Y as arrayType, Z as enumType, rt as stringType, tt as objectType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { d as upsert, n as allDossiers, r as getById } from "./store-mnrjP0DR.mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { a as getDeadlineState, i as getCriticalAlerts, o as getNextStep, r as buildDossierSummaryFacts } from "./dossiers-helpers-BSyvCqzm.mjs";
import { C as submitCitizenComplaint, a as buildAkptMapDownload, c as buildExpeditedProcedureForm, l as buildTrackingPayload, o as buildAkptMapPrintPage, s as buildCitizenDocumentDownload, u as buildUploadedDocumentDownload, w as submitExpeditedProcedureRequest } from "./dossiers.functions-D8xRMefQ.mjs";
import { a as retrieveFaq, i as renderFaqForPrompt, r as fallbackFaqAnswer } from "./faq-BRjx188h.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { i as runExtraction, t as Route$19 } from "./extract.functions-fHTdyP_h.mjs";
import { t as callOpenAi } from "./openai-TTrdtFQa.mjs";
import { t as Route$20 } from "./track._code-CdNSu4I9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-7V0qJ1gO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BF6Y07Av.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var PUBLIC_PATHS = ["/login", "/track"];
var VALID_ROLES = [
	"admin",
	"operator",
	"citizen",
	"business"
];
var ROLE_KEY = "smart-dossier-demo-role";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#0f172a] px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-10 text-center shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-7 w-7 text-red-400" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400",
					children: "Smart Dossier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold text-slate-100",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-slate-400",
					children: "We ran into an unexpected error. Try refreshing — if it keeps happening, head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium text-slate-300 transition-opacity hover:opacity-85",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	beforeLoad: ({ location }) => {
		if (typeof window === "undefined") return;
		if (PUBLIC_PATHS.some((p) => location.pathname.startsWith(p))) return;
		const stored = window.localStorage.getItem(ROLE_KEY);
		if (!VALID_ROLES.includes(stored ?? "")) throw redirect({ to: "/login" });
	},
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Smart Dossier — AI-Powered Property Procedure Management" },
			{
				name: "description",
				content: "AI platform for managing property procedures in Albania — expropriation and HCA privatization."
			},
			{
				name: "author",
				content: "Innovation4Albania"
			},
			{
				property: "og:title",
				content: "Smart Dossier — AI-Powered Property Procedure Management"
			},
			{
				property: "og:description",
				content: "Property dossier management with AI assistance at every phase."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "Smart Dossier — AI-Powered Property Procedure Management"
			},
			{
				name: "twitter:description",
				content: "Property dossier management with AI assistance at every phase."
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	(0, import_react.useEffect)(() => {
		if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return;
		const stored = window.localStorage.getItem(ROLE_KEY);
		if (!VALID_ROLES.includes(stored ?? "")) navigate({ to: "/login" });
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			richColors: true,
			position: "top-right",
			closeButton: true
		})]
	});
}
var $$splitComponentImporter$8 = () => import("./raporte-CqQEaDv8.mjs");
var Route$17 = createFileRoute("/raporte")({
	head: () => ({ meta: [{ title: "Raporte - Smart Dossier" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./login-CqbhDoAh.mjs");
var Route$16 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Hyrje - Smart Dossier" }, {
		name: "description",
		content: "Hyrje dhe regjistrim i thjeshte per Qytetar, Biznes dhe Operator."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./faq-DC8VjWE_.mjs");
var Route$15 = createFileRoute("/faq")({
	head: () => ({ meta: [{ title: "Pyetje te shpeshta - Smart Dossier" }, {
		name: "description",
		content: "Pyetje te shpeshta per qytetaret ne Smart Dossier."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./dosjet-DqMct-NA.mjs");
var Route$14 = createFileRoute("/dosjet")({
	head: () => ({ meta: [{ title: "Dosjet - Smart Dossier" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./biznes-CiVC35Yt.mjs");
var Route$13 = createFileRoute("/biznes")({
	head: () => ({ meta: [{ title: "Portali i biznesit — Smart Dossier" }, {
		name: "description",
		content: "Aplikim biznesi me NIPT per regjistrim prone dhe gjurmim te dosjes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./aplikim-B90PkJ72.mjs");
var Route$12 = createFileRoute("/aplikim")({
	head: () => ({ meta: [{ title: "Aplikim i ri - Smart Dossier" }, {
		name: "description",
		content: "Aplikim i ri per privatizim banese, shpronesim/kompensim ose regjistrim prone biznesi."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin-login-ctHyYDBS.mjs");
var Route$11 = createFileRoute("/admin-login")({
	head: () => ({ meta: [{ title: "Hyrje Admin - Smart Dossier" }, {
		name: "description",
		content: "Hyrje e vecante per administratoret e platformes Smart Dossier."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./routes-DblK6Swx.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Faqja Kryesore — Smart Dossier" }, {
		name: "description",
		content: "Paneli i nëpunësit civil për menaxhimin e dosjeve."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./aplikim.dokumentacion-CnPI4Ft9.mjs");
var Route$9 = createFileRoute("/aplikim/dokumentacion")({
	head: () => ({ meta: [{ title: "Dokumentet e aplikimit - Smart Dossier" }, {
		name: "description",
		content: "Ngarkoni dokumentet e aplikimit në një pamje të qartë për qytetarin."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var inputSchema$4 = objectType({
	question: stringType().min(2).max(1e3),
	trackingCode: stringType().max(32).optional()
});
var llmSchema$1 = objectType({
	answer: stringType(),
	citations: arrayType(stringType()).default([]),
	hasEnoughInfo: booleanType()
});
function json(data, init) {
	return Response.json(data, {
		...init,
		headers: {
			"cache-control": "no-store",
			...init?.headers ?? {}
		}
	});
}
function mapCitations(ids, sourceItems) {
	const byId = new Map(sourceItems.map((item) => [item.id, item]));
	return ids.map((id) => byId.get(id)).filter((item) => Boolean(item)).map((item) => ({
		id: item.id,
		title: item.question,
		source: item.category
	}));
}
function isTrackingQuestion(question) {
	const normalized = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	return [
		"status",
		"dosj",
		"faze",
		"hap",
		"afat",
		"mung",
		"dokument",
		"vulos",
		"ankes",
		"pershpejt"
	].some((token) => normalized.includes(token));
}
function renderTrackingForPrompt(tracking) {
	return [
		`Kodi: ${tracking.trackingCode}`,
		`Procesi: ${tracking.process}`,
		`Statusi: ${tracking.status}`,
		`Faza aktuale: ${tracking.currentPhase.number}. ${tracking.currentPhase.title}`,
		`Institucioni: ${tracking.currentPhase.institution}`,
		tracking.nextMilestone ? `Hapi tjeter: ${tracking.nextMilestone}` : "Hapi tjeter: nuk ka",
		tracking.nextInstitution ? `Institucioni i radhes: ${tracking.nextInstitution}` : null,
		tracking.deadline ? `Afati kryesor: ${tracking.deadline.label}, ${tracking.deadline.daysRemaining} dite, gjendja ${tracking.deadline.state}` : "Pa afat kryesor aktiv",
		tracking.missingDocuments.length ? `Dokumente qe mungojne: ${tracking.missingDocuments.map((item) => item.label).join(", ")}` : "Nuk shfaqen dokumente te munguar",
		`Verifikimi i te drejtes: ${tracking.requesterVerification.status}`,
		tracking.requesterVerification.canReceiveDocuments ? "Dokumentet e vulosura mund te shfaqen per qytetarin" : `Dokumentet e vulosura mbahen ne pritje: ${tracking.requesterVerification.heldDocumentsCount}`,
		`Procedura e pershpejtuar: ${tracking.expeditedProcedure.status}`
	].filter(Boolean).join("\n");
}
function trackingCitation(tracking) {
	return {
		id: `tracking:${tracking.trackingCode}`,
		title: `Status publik ${tracking.trackingCode}`,
		source: "Gjurmimi i dosjes"
	};
}
function fallbackAnswer(question, tracking) {
	const local = fallbackFaqAnswer(question);
	if (!tracking || !isTrackingQuestion(question)) return local;
	const missing = tracking.missingDocuments.map((item) => item.label).join(", ");
	return {
		answer: [
			`Dosja ${tracking.trackingCode} eshte ne statusin "${tracking.status}".`,
			`Faza aktuale: ${tracking.currentPhase.number}. ${tracking.currentPhase.title} (${tracking.currentPhase.institution}).`,
			tracking.nextMilestone ? `Hapi tjeter i pritshëm: ${tracking.nextMilestone}.` : "Nuk ka hap tjeter te shfaqur publikisht.",
			missing ? `Dokumente qe mungojne: ${missing}.` : "Aktualisht nuk shfaqen dokumente te munguar.",
			tracking.deadline ? `Afati kryesor: ${tracking.deadline.label}, ${tracking.deadline.daysRemaining} dite.` : null,
			tracking.requesterVerification.canReceiveDocuments ? "Dokumentet e vulosura mund te shfaqen per shkarkim." : "Dokumentet e vulosura hapen pas verifikimit te te drejtes se kerkuesit."
		].filter(Boolean).join("\n"),
		citations: [trackingCitation(tracking), ...local.citations],
		hasEnoughInfo: true
	};
}
var Route$8 = createFileRoute("/api/public/faq-assist")({ server: { handlers: { POST: async ({ request }) => {
	let parsed;
	try {
		parsed = inputSchema$4.parse(await request.json());
	} catch {
		return json({
			ok: false,
			error: "Pyetja nuk eshte e vlefshme."
		}, { status: 400 });
	}
	const tracking = parsed.trackingCode ? buildTrackingPayload(parsed.trackingCode.trim().toUpperCase()) : null;
	const retrieved = retrieveFaq(parsed.question, 5);
	const local = fallbackAnswer(parsed.question, tracking);
	const sourceItems = retrieved.length ? retrieved : [];
	if (!sourceItems.length && !tracking) return json({
		ok: true,
		...local,
		mode: "local"
	});
	const r = await callOpenAi({
		system: "Je ndihmes AI per qytetaret ne Smart Dossier. Pergjigju shkurt ne shqip. Perdor vetem pyetjet e shpeshta dhe statusin publik te dosjes qe jepen. Mos jep keshille ligjore perfundimtare dhe mos shpik afate, tarifa ose institucione. Nese pyetjet e shpeshta nuk mjaftojne, kthe hasEnoughInfo=false dhe answer=\"Kjo pyetje nuk mbulohet nga pyetjet e shpeshta aktuale.\" Kthe vetem JSON me fushat answer, citations (id te pyetjeve te perdorura), hasEnoughInfo.",
		user: [
			`PYETJA: ${parsed.question}`,
			tracking ? "" : null,
			tracking ? "STATUS PUBLIK I DOSJES:" : null,
			tracking ? renderTrackingForPrompt(tracking) : null,
			"",
			sourceItems.length ? "PYETJE TE SHPESHTA:" : "PYETJE TE SHPESHTA: nuk ka perputhje te forte",
			sourceItems.length ? renderFaqForPrompt(sourceItems) : ""
		].filter((line) => line !== null).join("\n"),
		jsonMode: true,
		temperature: .1
	});
	if (!r.ok) return json({
		ok: true,
		...local,
		mode: "local",
		aiUnavailable: r.error
	});
	try {
		const llm = llmSchema$1.parse(JSON.parse(r.content));
		const citations = [...tracking && isTrackingQuestion(parsed.question) ? [trackingCitation(tracking)] : [], ...mapCitations(llm.citations, sourceItems)];
		return json({
			ok: true,
			answer: llm.answer,
			hasEnoughInfo: llm.hasEnoughInfo,
			citations,
			mode: "ai",
			model: r.model
		});
	} catch {
		return json({
			ok: true,
			...local,
			mode: "local"
		});
	}
} } } });
var CORS_HEADERS = {
	"access-control-allow-origin": "*",
	"access-control-allow-methods": "GET, POST, OPTIONS",
	"access-control-allow-headers": "Content-Type, Authorization",
	"cache-control": "no-store"
};
function corsJson(body, init = {}) {
	return new Response(JSON.stringify(body), {
		status: init.status ?? 200,
		headers: {
			"content-type": "application/json",
			...CORS_HEADERS,
			...init.headers ?? {}
		}
	});
}
function corsOptions() {
	return new Response(null, {
		status: 204,
		headers: CORS_HEADERS
	});
}
function summarizeDossier(d) {
	const proc = PROCESSES[d.process];
	const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
	const step = phase?.steps.find((s) => s.id === d.currentStepId);
	const ds = getDeadlineState(d, proc);
	const alerts = getCriticalAlerts(d, proc);
	return {
		id: d.id,
		trackingCode: d.trackingCode,
		title: d.title,
		process: d.process,
		processTitle: proc.title,
		status: d.status,
		phaseId: d.currentPhaseId,
		phaseTitle: phase?.title ?? d.currentPhaseId,
		stepTitle: step?.title ?? "",
		institution: phase?.institutions[0] ?? "—",
		deadline: ds.nearest ? {
			label: ds.nearest.label,
			dueAt: ds.nearest.dueAt,
			daysRemaining: ds.daysRemaining,
			state: ds.state
		} : null,
		deadlineState: ds.state,
		criticalAlertCount: alerts.filter((a) => a.severity === "critical").length,
		updatedAt: d.updatedAt
	};
}
function listDossiersPublic(q) {
	const term = (q.search ?? "").trim().toLowerCase();
	return allDossiers().filter((d) => !q.process || d.process === q.process).filter((d) => !q.status || d.status === q.status).filter((d) => !term || d.parties.some((p) => p.fullName.toLowerCase().includes(term)) || d.title.toLowerCase().includes(term) || d.trackingCode.toLowerCase().includes(term) || false).map(summarizeDossier);
}
function getDossierPublic(id) {
	const d = getById(id);
	if (!d) return null;
	const proc = PROCESSES[d.process];
	const phase = proc.phases.find((p) => p.id === d.currentPhaseId);
	const step = phase?.steps.find((s) => s.id === d.currentStepId);
	const next = getNextStep(d, proc);
	const ds = getDeadlineState(d, proc);
	const alerts = getCriticalAlerts(d, proc);
	const facts = buildDossierSummaryFacts(d, proc);
	return {
		summary: summarizeDossier(d),
		phase: phase ? {
			id: phase.id,
			order: phase.order,
			title: phase.title,
			description: phase.description,
			institutions: phase.institutions,
			stepTitle: step?.title ?? ""
		} : null,
		nextStep: next && !next.isFinal ? {
			title: next.step.title,
			institution: next.step.institution
		} : null,
		isFinal: !!next?.isFinal,
		deadline: ds.nearest ? {
			label: ds.nearest.label,
			dueAt: ds.nearest.dueAt,
			daysRemaining: ds.daysRemaining,
			state: ds.state
		} : null,
		alerts: alerts.map((a) => ({
			severity: a.severity,
			label: a.label,
			description: a.description
		})),
		documents: d.documents.map((doc) => ({
			id: doc.id,
			type: doc.type,
			name: doc.name,
			status: doc.status,
			uploadedAt: doc.uploadedAt
		})),
		missingDocumentTypes: d.missingDocumentTypes,
		parties: d.parties.map((p) => ({
			role: p.role,
			fullName: p.fullName
		})),
		facts
	};
}
function dashboardPublic() {
	const dossiers = allDossiers();
	const now = /* @__PURE__ */ new Date();
	const active = dossiers.filter((d) => d.status !== "completed" && d.status !== "rejected");
	const blocked = dossiers.filter((d) => d.status === "blocked").length;
	const criticalAlerts = dossiers.flatMap((d) => getCriticalAlerts(d, PROCESSES[d.process], now).filter((a) => a.severity === "critical").map((a) => ({
		dossierId: d.id,
		trackingCode: d.trackingCode,
		title: d.title,
		label: a.label,
		description: a.description
	})));
	const expiring = dossiers.map((d) => ({
		d,
		ds: getDeadlineState(d, PROCESSES[d.process], now)
	})).filter((x) => x.ds.state === "due_soon" || x.ds.state === "overdue").map((x) => ({
		dossierId: x.d.id,
		trackingCode: x.d.trackingCode,
		title: x.d.title,
		state: x.ds.state,
		daysRemaining: x.ds.daysRemaining,
		label: x.ds.nearest?.label ?? "",
		dueAt: x.ds.nearest?.dueAt ?? ""
	})).sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0)).slice(0, 10);
	return {
		totals: {
			dossiers: dossiers.length,
			active: active.length,
			blocked
		},
		criticalAlerts: criticalAlerts.slice(0, 10),
		expiringDeadlines: expiring,
		recent: active.slice(0, 10).map(summarizeDossier)
	};
}
var inputSchema$3 = objectType({
	processKind: enumType([
		"ekb_privatization",
		"expropriation",
		"property_registration"
	]),
	documentType: stringType().min(1),
	text: stringType().min(1).max(2e5),
	fileName: stringType().optional()
});
var Route$7 = createFileRoute("/api/public/extract")({ server: { handlers: {
	OPTIONS: async () => corsOptions(),
	POST: async ({ request }) => {
		let body;
		try {
			body = await request.json();
		} catch {
			return corsJson({
				ok: false,
				error: "Invalid JSON"
			}, { status: 400 });
		}
		const parsed = inputSchema$3.safeParse(body);
		if (!parsed.success) return corsJson({
			ok: false,
			error: "Invalid input"
		}, { status: 400 });
		const result = await runExtraction(parsed.data);
		return corsJson(result, { status: result.ok ? 200 : 502 });
	}
} } });
var Route$6 = createFileRoute("/api/public/dossiers")({ server: { handlers: {
	OPTIONS: async () => corsOptions(),
	GET: async ({ request }) => {
		const url = new URL(request.url);
		return corsJson({ items: listDossiersPublic({
			process: url.searchParams.get("process") ?? void 0,
			status: url.searchParams.get("status") ?? void 0,
			search: url.searchParams.get("search") ?? void 0
		}) });
	}
} } });
var Route$5 = createFileRoute("/api/public/dashboard")({ server: { handlers: {
	OPTIONS: async () => corsOptions(),
	GET: async () => corsJson(dashboardPublic())
} } });
function loadDossierOr404(id) {
	const d = getById(id);
	if (!d) throw new Response("Dossier not found", { status: 404 });
	return d;
}
function recordAiRun(d, opts) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	d.insights = [...d.insights, {
		id: `ai-${d.insights.length + 1}-${Date.now().toString(36)}`,
		kind: opts.kind,
		createdAt: now,
		text: opts.text,
		data: opts.data,
		confidence: opts.confidence
	}];
	const ev = {
		id: `a-${d.audit.length + 1}-${Date.now().toString(36)}`,
		at: now,
		actor: "ai_assistant",
		action: opts.auditAction,
		details: opts.auditDetails
	};
	d.audit = [...d.audit, ev];
	d.updatedAt = now;
	upsert(d);
}
async function readJson(req) {
	try {
		return await req.json();
	} catch {
		throw new Response("Invalid JSON body", { status: 400 });
	}
}
function jsonResponse(body, init = {}) {
	return new Response(JSON.stringify(body), {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init.headers ?? {}
		}
	});
}
var inputSchema$2 = objectType({ id: stringType().min(1) });
var Route$4 = createFileRoute("/api/ai/summary")({ server: { handlers: { POST: async ({ request }) => {
	let parsed;
	try {
		parsed = inputSchema$2.parse(await readJson(request));
	} catch (e) {
		if (e instanceof Response) return e;
		return jsonResponse({
			ok: false,
			error: "Invalid input"
		}, { status: 400 });
	}
	const d = loadDossierOr404(parsed.id);
	const proc = PROCESSES[d.process];
	const facts = buildDossierSummaryFacts(d, proc);
	const alerts = getCriticalAlerts(d, proc);
	const deadline = getDeadlineState(d, proc);
	const context = {
		dossier: facts,
		alerts: alerts.map((a) => ({
			label: a.label,
			severity: a.severity,
			description: a.description
		})),
		deadline
	};
	const r = await callOpenAi({
		system: "Je analist i nje ekipi sherbimi civil shqiptar. Jep nje permbledhje per menaxherin, 3-5 fjali, ne shqip, EKSKLUZIVISHT bazuar te konteksti. Mbulo: (1) ku ndodhet dosja, (2) cfare mungon, (3) rreziku me i madh i voneses, (4) si perdoret sinjali AI GIS/AKPT kur eshte relevant, (5) veprimi i rekomanduar tjeter. Mos shpik fakte ose hapa jashte procesit.",
		user: `KONTEKSTI (JSON):\n${JSON.stringify(context, null, 2)}`,
		temperature: .2
	});
	if (!r.ok) return jsonResponse({
		ok: false,
		error: r.error
	}, { status: 502 });
	recordAiRun(d, {
		kind: "summary",
		text: r.content,
		data: {
			model: r.model,
			phaseId: d.currentPhaseId,
			stepId: d.currentStepId
		},
		auditAction: "Permbledhje AI",
		auditDetails: `model=${r.model}`
	});
	return jsonResponse({
		ok: true,
		summary: r.content,
		model: r.model
	});
} } } });
var inputSchema$1 = objectType({ id: stringType().min(1) });
var nextStepResponseSchema = objectType({
	nextAction: stringType(),
	responsibleInstitution: stringType(),
	requiredDocuments: arrayType(stringType()).default([]),
	deadline: stringType().nullable(),
	risk: stringType(),
	legalOrProcessSource: stringType()
});
var Route$3 = createFileRoute("/api/ai/next-step")({ server: { handlers: { POST: async ({ request }) => {
	let parsed;
	try {
		parsed = inputSchema$1.parse(await readJson(request));
	} catch (e) {
		if (e instanceof Response) return e;
		return jsonResponse({
			ok: false,
			error: "Invalid input"
		}, { status: 400 });
	}
	const d = loadDossierOr404(parsed.id);
	const proc = PROCESSES[d.process];
	const det = getNextStep(d, proc);
	const alerts = getCriticalAlerts(d, proc);
	const deadline = getDeadlineState(d, proc);
	const frame = det ? {
		isFinal: det.isFinal,
		phaseId: det.phase.id,
		phaseTitle: det.phase.title,
		stepId: det.step.id,
		stepTitle: det.step.title,
		stepDescription: det.step.description,
		responsibleInstitution: det.step.institution,
		requiredDocuments: det.step.requiredDocuments ?? [],
		slaDays: det.step.slaDays ?? null,
		criticalPoints: (det.step.criticalPoints ?? []).map((c) => ({
			label: c.label,
			severity: c.severity,
			description: c.description
		})),
		legalBasis: [...proc.legalBasis, ...det.phase.legalBasis ?? []].map((l) => l.reference)
	} : null;
	if (!frame) return jsonResponse({
		ok: false,
		error: "Nuk u gjet hapi tjetër — gjendja aktuale e dosjes nuk përputhet me procesin."
	}, { status: 409 });
	const sourceLabel = `${proc.kind === "ekb_privatization" ? "EKB" : "Shpronësim"} · ${frame.phaseTitle} → ${frame.stepTitle}`;
	if (frame.isFinal) {
		const result = {
			nextAction: "Procesi është në hapin final; nuk ka veprim të mëtejshëm.",
			responsibleInstitution: frame.responsibleInstitution,
			requiredDocuments: frame.requiredDocuments,
			deadline: null,
			risk: "Pa rrezik të mëtejshëm operacional.",
			legalOrProcessSource: sourceLabel
		};
		recordAiRun(d, {
			kind: "next_step",
			text: result.nextAction,
			data: {
				...result,
				source: sourceLabel
			},
			auditAction: "Sugjerim AI: hap tjetër (final)"
		});
		return jsonResponse({
			ok: true,
			result
		});
	}
	const r = await callOpenAi({
		system: "Je asistent procesi. Përshtat hapin DETERMINISTIK të mëposhtëm në një rekomandim të qartë në shqip. MOS shpik hap, institucion, dokumente ose afat. Përdor saktësisht stepTitle, responsibleInstitution dhe requiredDocuments të dhëna. Kthe JSON me fushat: nextAction (1-2 fjali), responsibleInstitution, requiredDocuments[], deadline (string ose null), risk (1 fjali bazuar te criticalPoints dhe alarmet), legalOrProcessSource (string).",
		user: JSON.stringify({
			frame,
			alerts: alerts.map((a) => ({
				label: a.label,
				severity: a.severity
			})),
			deadline,
			suggestedSource: sourceLabel
		}, null, 2),
		jsonMode: true,
		temperature: .1
	});
	if (!r.ok) return jsonResponse({
		ok: false,
		error: r.error
	}, { status: 502 });
	let llm;
	try {
		llm = nextStepResponseSchema.parse(JSON.parse(r.content));
	} catch {
		llm = {
			nextAction: frame.stepDescription || frame.stepTitle,
			responsibleInstitution: frame.responsibleInstitution,
			requiredDocuments: frame.requiredDocuments,
			deadline: frame.slaDays ? `~${frame.slaDays} ditë` : null,
			risk: frame.criticalPoints[0]?.description ?? "Pa rrezik të identifikuar.",
			legalOrProcessSource: sourceLabel
		};
	}
	const result = {
		nextAction: llm.nextAction,
		responsibleInstitution: frame.responsibleInstitution,
		requiredDocuments: frame.requiredDocuments,
		deadline: llm.deadline ?? (frame.slaDays ? `~${frame.slaDays} ditë` : null),
		risk: llm.risk,
		legalOrProcessSource: sourceLabel
	};
	recordAiRun(d, {
		kind: "next_step",
		text: result.nextAction,
		data: {
			...result,
			model: r.model,
			source: sourceLabel
		},
		auditAction: "Sugjerim AI: hap tjetër",
		auditDetails: `${frame.phaseId}/${frame.stepId}`
	});
	return jsonResponse({
		ok: true,
		result,
		source: sourceLabel
	});
} } } });
function buildChunks(dossier, process) {
	const chunks = [];
	for (const lb of process.legalBasis) chunks.push({
		id: `legal:${lb.reference}`,
		title: `Baza ligjore: ${lb.reference}`,
		text: `${lb.title ?? lb.reference}${lb.url ? ` (${lb.url})` : ""}`,
		source: "legal"
	});
	for (const phase of process.phases) {
		if (phase.legalBasis?.length) for (const lb of phase.legalBasis) chunks.push({
			id: `legal:${phase.id}:${lb.reference}`,
			title: `${process.title} — Faza ${phase.order}: ${phase.title} (baza ligjore ${lb.reference})`,
			text: `${lb.title ?? lb.reference}${lb.url ? ` ${lb.url}` : ""}`,
			source: "legal",
			phaseId: phase.id
		});
		for (const step of phase.steps) {
			chunks.push({
				id: `step:${phase.id}:${step.id}`,
				title: `${process.title} — Faza ${phase.order} ${phase.title} · Hapi ${step.order}: ${step.title}`,
				text: [
					step.description,
					`Institucioni: ${step.institution}.`,
					step.slaDays ? `Afat operacional: ${step.slaDays} ditë.` : null,
					step.manual ? "Procedurë manuale (jashtë e-Albania)." : null,
					step.requiredDocuments?.length ? `Dokumente të kërkuara: ${step.requiredDocuments.join(", ")}.` : null
				].filter(Boolean).join(" "),
				source: "process",
				phaseId: phase.id,
				stepId: step.id
			});
			for (const cp of step.criticalPoints ?? []) chunks.push({
				id: `cp:${phase.id}:${step.id}:${cp.id}`,
				title: `Pikë kritike — ${process.title} · ${phase.title}: ${cp.label}`,
				text: `${cp.description} [severity=${cp.severity}; tags=${cp.tags.join(",")}]${cp.expectedDelayDays ? ` Vonesë e pritshme: ~${cp.expectedDelayDays} ditë.` : ""}`,
				source: "critical_point",
				phaseId: phase.id,
				stepId: step.id
			});
		}
	}
	const facts = buildDossierSummaryFacts(dossier, process);
	chunks.push({
		id: `dossier:${dossier.id}`,
		title: `Faktet e dosjes ${dossier.trackingCode}`,
		text: [
			`Statusi: ${facts.status}. Faza aktuale: ${facts.currentPhase}. Hapi aktual: ${facts.currentStep}.`,
			facts.nextStep ? `Hapi tjetër: ${facts.nextStep}.` : "Hapi tjetër: (final ose i panjohur).",
			facts.applicantName ? `Aplikanti: ${facts.applicantName}.` : "",
			`Dokumente të ngarkuara: ${facts.documentsUploaded}.`,
			facts.documentsMissing.length ? `Dokumente që mungojnë: ${facts.documentsMissing.join(", ")}.` : "Asnjë dokument në listën e detyrueshme nuk mungon.",
			facts.criticalAlerts.length ? `Alarme: ${facts.criticalAlerts.map((a) => `${a.label} (${a.severity})`).join("; ")}.` : "Pa alarme aktive.",
			facts.deadlineState !== "none" ? `Afat: ${facts.deadlineState}${facts.daysToNearestDeadline !== void 0 ? ` (${facts.daysToNearestDeadline} ditë)` : ""}; të kaluara: ${facts.overdueDeadlines}.` : "Pa afate aktive.",
			`AI GIS/AKPT: ${facts.gisAssessment.zoning}; ${facts.gisAssessment.landCategory}; sinjali ${facts.gisAssessment.aiRiskLevel}: ${facts.gisAssessment.aiSignal} ${facts.gisAssessment.aiUse}`,
			facts.finalValueAll !== void 0 ? `Vlera përfundimtare: ${facts.finalValueAll} ALL.` : ""
		].filter(Boolean).join(" "),
		source: "dossier",
		phaseId: dossier.currentPhaseId,
		stepId: dossier.currentStepId
	});
	return chunks;
}
function tokenize(s) {
	return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/[^a-z0-9]+/i).filter((t) => t.length > 2);
}
var STOPWORDS = new Set([
	"the",
	"and",
	"for",
	"with",
	"from",
	"che",
	"qe",
	"per",
	"dhe",
	"nga",
	"kjo",
	"kete",
	"cili",
	"cila",
	"cfare",
	"eshte",
	"jane",
	"edhe",
	"ose",
	"nese"
]);
function retrieveChunks(chunks, opts) {
	const k = opts.topK ?? 6;
	const qTokens = tokenize(opts.query).filter((t) => !STOPWORDS.has(t));
	const scored = chunks.map((c) => {
		const blob = `${c.title} ${c.text}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		let score = 0;
		for (const t of qTokens) if (blob.includes(t)) score += 2;
		if (opts.phaseId && c.phaseId === opts.phaseId) score += 3;
		if (c.source === "dossier") score += 4;
		if (c.source === "critical_point") score += 1;
		return {
			c,
			score
		};
	});
	scored.sort((a, b) => b.score - a.score);
	const picked = scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.c);
	const dossier = chunks.find((c) => c.source === "dossier");
	if (dossier && !picked.includes(dossier)) picked.unshift(dossier);
	return picked;
}
function renderChunksForPrompt(chunks) {
	return chunks.map((c, i) => `[#${i + 1} | id=${c.id}] ${c.title}\n${c.text}`).join("\n\n");
}
var inputSchema = objectType({
	id: stringType().min(1),
	question: stringType().min(2).max(2e3)
});
var llmSchema = objectType({
	answer: stringType(),
	citations: arrayType(stringType()).default([]),
	hasEnoughInfo: booleanType()
});
var Route$2 = createFileRoute("/api/ai/assist")({ server: { handlers: { POST: async ({ request }) => {
	let parsed;
	try {
		parsed = inputSchema.parse(await readJson(request));
	} catch (e) {
		if (e instanceof Response) return e;
		return jsonResponse({
			ok: false,
			error: "Invalid input"
		}, { status: 400 });
	}
	const d = loadDossierOr404(parsed.id);
	const proc = PROCESSES[d.process];
	const retrieved = retrieveChunks(buildChunks(d, proc), {
		query: parsed.question,
		phaseId: d.currentPhaseId,
		topK: 6
	});
	const citationsCatalog = retrieved.map((c, i) => ({
		marker: `#${i + 1}`,
		id: c.id,
		title: c.title
	}));
	const r = await callOpenAi({
		system: "Je asistent procesi për nëpunësin civil. Përgjigju në shqip. PËRDOR VETËM informacionin nga chunk-et e dhëna më poshtë dhe faktet e dosjes. Mos shpik institucione, hapa, afate, ose baza ligjore që nuk janë në kontekst. Nëse informacioni nuk mjafton, kthe hasEnoughInfo=false dhe answer=\"Platforma nuk ka këtë informacion.\" Kthe JSON me fushat: answer (string), citations (array me id-të e chunk-ve të përdorur, p.sh. ['step:ekb-3:value-calc']), hasEnoughInfo (boolean). Çdo pretendim duhet të jetë i lidhshëm me një chunk të cituar.",
		user: [
			`PYETJA: ${parsed.question}`,
			"",
			"CHUNK-ET E NJOHURISË (përdor VETËM këto):",
			renderChunksForPrompt(retrieved)
		].join("\n"),
		jsonMode: true,
		temperature: .1
	});
	if (!r.ok) return jsonResponse({
		ok: false,
		error: r.error
	}, { status: 502 });
	let llm;
	try {
		llm = llmSchema.parse(JSON.parse(r.content));
	} catch {
		return jsonResponse({
			ok: false,
			error: "Model nuk ktheu JSON të vlefshme.",
			raw: r.content
		}, { status: 502 });
	}
	const byId = new Map(retrieved.map((c) => [c.id, c]));
	const citations = llm.citations.map((cid) => byId.get(cid)).filter((c) => Boolean(c)).map((c) => ({
		id: c.id,
		title: c.title,
		source: c.source
	}));
	recordAiRun(d, {
		kind: "summary",
		text: `Q: ${parsed.question}\nA: ${llm.answer}`,
		data: {
			model: r.model,
			hasEnoughInfo: llm.hasEnoughInfo,
			citations: citations.map((c) => c.id)
		},
		auditAction: "Pyetje në asistentin RAG",
		auditDetails: parsed.question.slice(0, 200)
	});
	return jsonResponse({
		ok: true,
		answer: llm.answer,
		hasEnoughInfo: llm.hasEnoughInfo,
		citations,
		retrieved: citationsCatalog,
		model: r.model
	});
} } } });
function bytesToArrayBuffer(bytes) {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	return copy.buffer;
}
var Route$1 = createFileRoute("/api/public/track/$code")({ server: { handlers: {
	GET: async ({ params, request }) => {
		const url = new URL(request.url);
		if (url.searchParams.get("mapPdf") === "1") {
			const map = buildAkptMapDownload(params.code);
			if (!map) return Response.json({ error: "not_found" }, { status: 404 });
			return new Response(bytesToArrayBuffer(map.body), { headers: {
				"content-type": map.mimeType,
				"content-disposition": `attachment; filename="${map.fileName}"`,
				"cache-control": "no-store"
			} });
		}
		if (url.searchParams.get("mapPrint") === "1") {
			const print = buildAkptMapPrintPage(params.code);
			if (!print) return Response.json({ error: "not_found" }, { status: 404 });
			return new Response(print.body, { headers: {
				"content-type": "text/html; charset=utf-8",
				"content-disposition": `inline; filename="${print.fileName}"`,
				"cache-control": "no-store"
			} });
		}
		if (url.searchParams.get("expediteForm") === "1") {
			const form = buildExpeditedProcedureForm(params.code);
			if (!form) return Response.json({ error: "not_found" }, { status: 404 });
			return new Response(bytesToArrayBuffer(form.body), { headers: {
				"content-type": form.mimeType,
				"content-disposition": `attachment; filename="${form.fileName}"`,
				"cache-control": "no-store"
			} });
		}
		const uploadedDocumentId = url.searchParams.get("uploadedDocumentId");
		if (uploadedDocumentId) {
			const download = buildUploadedDocumentDownload(params.code, uploadedDocumentId);
			if (!download) return Response.json({ error: "document_not_found" }, { status: 404 });
			const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";
			return new Response(bytesToArrayBuffer(download.body), { headers: {
				"content-type": download.mimeType,
				"content-disposition": `${disposition}; filename="${download.fileName}"`,
				"cache-control": "no-store"
			} });
		}
		const documentId = url.searchParams.get("documentId");
		if (documentId) {
			const download = buildCitizenDocumentDownload(params.code, documentId);
			if (!download) return Response.json({ error: "document_not_found" }, { status: 404 });
			const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";
			return new Response(bytesToArrayBuffer(download.body), { headers: {
				"content-type": download.mimeType,
				"content-disposition": `${disposition}; filename="${download.fileName}"`,
				"cache-control": "no-store"
			} });
		}
		const payload = buildTrackingPayload(params.code);
		if (!payload) return Response.json({ error: "not_found" }, { status: 404 });
		return Response.json(payload, { headers: { "cache-control": "no-store" } });
	},
	POST: async ({ params, request }) => {
		if ((request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
			const form = await request.formData();
			if (form.get("kind") === "expedite") {
				const bytesToBase64 = (bytes) => {
					let binary = "";
					const chunkSize = 32768;
					for (let i = 0; i < bytes.length; i += chunkSize) binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
					return btoa(binary);
				};
				const fileMeta = async (name) => {
					const value = form.get(name);
					if (!value || typeof value === "string") return null;
					const maybe = value;
					const fileName = typeof maybe.name === "string" ? maybe.name.trim() : "";
					if (!fileName) return null;
					const arrayBuffer = typeof maybe.arrayBuffer === "function" ? await maybe.arrayBuffer.call(value) : /* @__PURE__ */ new ArrayBuffer(0);
					return {
						name: fileName,
						mimeType: typeof maybe.type === "string" && maybe.type.trim() ? maybe.type : "application/octet-stream",
						sizeBytes: typeof maybe.size === "number" ? maybe.size : arrayBuffer.byteLength,
						contentBase64: bytesToBase64(new Uint8Array(arrayBuffer))
					};
				};
				const reason = form.get("reason");
				const justification = form.get("justification");
				const paymentRequired = form.get("paymentRequired") === "true";
				const requestPdf = await fileMeta("requestPdf");
				const supportingDocument = await fileMeta("supportingDocument");
				const paymentReceipt = await fileMeta("paymentReceipt");
				if (!(reason === "health" || reason === "deadline" || reason === "court" || reason === "social" || reason === "other") || typeof justification !== "string" || justification.trim().length < 10 || justification.trim().length > 2e3 || !requestPdf || !supportingDocument || paymentRequired && !paymentReceipt) return Response.json({
					error: "invalid_expedite_request",
					message: "Plotesoni formularin PDF, dokumentin provues dhe mandatin kur ka tarife."
				}, { status: 400 });
				try {
					const expedited = submitExpeditedProcedureRequest(params.code, {
						reason,
						justification,
						requestPdf,
						supportingDocument,
						paymentRequired,
						paymentReceipt: paymentReceipt ?? void 0
					});
					if (!expedited) return Response.json({ error: "not_found" }, { status: 404 });
					return Response.json({
						ok: true,
						expedited
					}, { headers: { "cache-control": "no-store" } });
				} catch (e) {
					return Response.json({
						error: "invalid_expedite_request",
						message: e instanceof Error ? e.message : "Kerkesa nuk u pranua."
					}, { status: 400 });
				}
			}
		}
		let body;
		try {
			body = await request.json();
		} catch {
			return Response.json({ error: "invalid_json" }, { status: 400 });
		}
		const parsed = (() => {
			if (!body || typeof body !== "object") return null;
			const value = body;
			const subject = typeof value.subject === "string" ? value.subject.trim() : "";
			const message = typeof value.message === "string" ? value.message.trim() : "";
			const contact = typeof value.contact === "string" ? value.contact.trim() : "";
			const stage = value.stage === "final_review" || value.stage === "phase_review" ? value.stage : void 0;
			if (subject.length < 3 || subject.length > 120) return null;
			if (message.length < 10 || message.length > 2e3) return null;
			return {
				subject,
				message,
				contact,
				stage
			};
		})();
		if (!parsed) return Response.json({
			error: "invalid_complaint",
			message: "Subjekti ose ankesa nuk është e vlefshme."
		}, { status: 400 });
		const complaint = submitCitizenComplaint(params.code, parsed);
		if (!complaint) return Response.json({ error: "not_found" }, { status: 404 });
		return Response.json({
			ok: true,
			complaint
		}, { headers: { "cache-control": "no-store" } });
	},
	OPTIONS: async () => new Response(null, {
		status: 204,
		headers: {
			"access-control-allow-origin": "*",
			"access-control-allow-methods": "GET, POST, OPTIONS",
			"access-control-allow-headers": "Content-Type"
		}
	})
} } });
var Route = createFileRoute("/api/public/dossiers/$id")({ server: { handlers: {
	OPTIONS: async () => corsOptions(),
	GET: async ({ params }) => {
		const data = getDossierPublic(params.id);
		if (!data) return corsJson({ error: "not_found" }, { status: 404 });
		return corsJson(data);
	}
} } });
var RaporteRoute = Route$17.update({
	id: "/raporte",
	path: "/raporte",
	getParentRoute: () => Route$18
});
var LoginRoute = Route$16.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$18
});
var FaqRoute = Route$15.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$18
});
var DosjetRoute = Route$14.update({
	id: "/dosjet",
	path: "/dosjet",
	getParentRoute: () => Route$18
});
var BiznesRoute = Route$13.update({
	id: "/biznes",
	path: "/biznes",
	getParentRoute: () => Route$18
});
var AplikimRoute = Route$12.update({
	id: "/aplikim",
	path: "/aplikim",
	getParentRoute: () => Route$18
});
var AdminLoginRoute = Route$11.update({
	id: "/admin-login",
	path: "/admin-login",
	getParentRoute: () => Route$18
});
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var TrackCodeRoute = Route$20.update({
	id: "/track/$code",
	path: "/track/$code",
	getParentRoute: () => Route$18
});
var DosjaIdRoute = Route$19.update({
	id: "/dosja/$id",
	path: "/dosja/$id",
	getParentRoute: () => Route$18
});
var AplikimDokumentacionRoute = Route$9.update({
	id: "/dokumentacion",
	path: "/dokumentacion",
	getParentRoute: () => AplikimRoute
});
var ApiPublicFaqAssistRoute = Route$8.update({
	id: "/api/public/faq-assist",
	path: "/api/public/faq-assist",
	getParentRoute: () => Route$18
});
var ApiPublicExtractRoute = Route$7.update({
	id: "/api/public/extract",
	path: "/api/public/extract",
	getParentRoute: () => Route$18
});
var ApiPublicDossiersRoute = Route$6.update({
	id: "/api/public/dossiers",
	path: "/api/public/dossiers",
	getParentRoute: () => Route$18
});
var ApiPublicDashboardRoute = Route$5.update({
	id: "/api/public/dashboard",
	path: "/api/public/dashboard",
	getParentRoute: () => Route$18
});
var ApiAiSummaryRoute = Route$4.update({
	id: "/api/ai/summary",
	path: "/api/ai/summary",
	getParentRoute: () => Route$18
});
var ApiAiNextStepRoute = Route$3.update({
	id: "/api/ai/next-step",
	path: "/api/ai/next-step",
	getParentRoute: () => Route$18
});
var ApiAiAssistRoute = Route$2.update({
	id: "/api/ai/assist",
	path: "/api/ai/assist",
	getParentRoute: () => Route$18
});
var ApiPublicTrackCodeRoute = Route$1.update({
	id: "/api/public/track/$code",
	path: "/api/public/track/$code",
	getParentRoute: () => Route$18
});
var ApiPublicDossiersIdRoute = Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiPublicDossiersRoute
});
var AplikimRouteChildren = { AplikimDokumentacionRoute };
var AplikimRouteWithChildren = AplikimRoute._addFileChildren(AplikimRouteChildren);
var ApiPublicDossiersRouteChildren = { ApiPublicDossiersIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AdminLoginRoute,
	AplikimRoute: AplikimRouteWithChildren,
	BiznesRoute,
	DosjetRoute,
	FaqRoute,
	LoginRoute,
	RaporteRoute,
	DosjaIdRoute,
	TrackCodeRoute,
	ApiAiAssistRoute,
	ApiAiNextStepRoute,
	ApiAiSummaryRoute,
	ApiPublicDashboardRoute,
	ApiPublicDossiersRoute: ApiPublicDossiersRoute._addFileChildren(ApiPublicDossiersRouteChildren),
	ApiPublicExtractRoute,
	ApiPublicFaqAssistRoute,
	ApiPublicTrackCodeRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
