import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, i as Input, n as Card, o as useDemoRole, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { $ as FileUp, At as Bot, C as Scale, Et as ChartColumn, Ft as Activity, G as LayoutDashboard, I as LogOut, M as MessageCircle, Mt as Bell, O as Plus, Ot as Building2, Q as FolderKanban, St as ChevronRight, U as LifeBuoy, Y as House, _ as ShieldCheck, b as Send, bt as ChevronsUpDown, c as UserCog, et as FileText, g as Sparkles, gt as CircleQuestionMark, jt as BookOpen, n as X, o as UserRound, pt as ClipboardList, q as Info, t as Zap, vt as CircleCheck, y as Settings2, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { _ as Link, l as useLocation, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as FAQ_SUGGESTED_QUESTIONS } from "./faq-BRjx188h.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-zR2LMms-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
async function askFaq(question, trackingCode) {
	const response = await fetch("/api/public/faq-assist", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			question,
			trackingCode: trackingCode?.trim() || void 0
		})
	});
	const payload = await response.json().catch(() => null);
	if (!response.ok || !payload?.ok) throw new Error(payload?.error ?? "Ndihmesi nuk u pergjigj.");
	return {
		text: payload.answer ?? "Nuk u gjet pergjigje.",
		hasEnoughInfo: payload.hasEnoughInfo ?? false,
		citations: payload.citations ?? [],
		mode: payload.mode ?? "local"
	};
}
async function fetchTrackingContext(code) {
	const response = await fetch(`/api/public/track/${encodeURIComponent(code.trim().toUpperCase())}`, { cache: "no-store" });
	if (!response.ok) throw new Error("Kodi i gjurmimit nuk u gjet.");
	return await response.json();
}
function trackingSummary(data) {
	const missing = data.missingDocuments.map((item) => item.label).join(", ");
	return [
		`E gjeta dosjen ${data.trackingCode}.`,
		`Statusi: ${data.status}.`,
		`Faza aktuale: ${data.currentPhase.number}. ${data.currentPhase.title} (${data.currentPhase.institution}).`,
		data.nextMilestone ? `Hapi tjeter: ${data.nextMilestone}.` : "Nuk ka hap tjeter publik.",
		missing ? `Dokumente qe mungojne: ${missing}.` : "Nuk shfaqen dokumente te munguar.",
		data.deadline ? `Afati kryesor: ${data.deadline.label}, ${data.deadline.daysRemaining} dite.` : null,
		data.requesterVerification.canReceiveDocuments ? "Dokumentet e vulosura mund te shfaqen per shkarkim." : "Dokumentet e vulosura hapen pas verifikimit te kerkuesit."
	].filter(Boolean).join("\n");
}
function CitizenVirtualAgent({ defaultTrackingCode = "EKB-2026-000014", audience = "public" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [question, setQuestion] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [trackingCode, setTrackingCode] = (0, import_react.useState)(defaultTrackingCode);
	const [trackingContext, setTrackingContext] = (0, import_react.useState)(null);
	const [trackingLoading, setTrackingLoading] = (0, import_react.useState)(false);
	const activeCode = trackingContext?.trackingCode ?? trackingCode;
	const isStaff = audience === "staff";
	const agentActions = isStaff ? [
		{
			label: "Hapi i pare",
			icon: Activity,
			action: () => submit("Cfare duhet te beje nje operator i ri ne Smart Dossier?")
		},
		{
			label: "Akt Vleresimi",
			icon: FileText,
			action: () => submit("Si funksionon AI Akt Vleresimi?")
		},
		{
			label: "Raportet",
			icon: ClipboardList,
			action: () => submit("Si perdoren raportet nga drejtuesit?")
		},
		{
			label: "Vulosja",
			icon: ShieldCheck,
			action: () => submit("Si vulosen dokumentet elektronikisht?")
		}
	] : [
		{
			label: "Statusi",
			icon: Activity,
			action: () => trackingContext ? submit("Cili eshte statusi i dosjes time?") : lookupTracking()
		},
		{
			label: "Dokumentet",
			icon: FileText,
			action: () => submit("Cfare dokumentesh mungojne dhe kur i shoh dokumentet e vulosura?")
		},
		{
			label: "Pershpejtim",
			icon: Zap,
			action: () => submit("Si mund te kerkoj procedure te pershpejtuar?")
		},
		{
			label: "Ankesa",
			icon: LifeBuoy,
			action: () => submit("Si dergoj ankese per dosjen time?")
		}
	];
	async function submit(text) {
		const trimmed = text.trim();
		if (!trimmed || loading) return;
		setError(null);
		setQuestion("");
		setMessages((current) => [...current, {
			role: "user",
			text: trimmed
		}]);
		setLoading(true);
		try {
			const answer = await askFaq(trimmed, activeCode);
			setMessages((current) => [...current, {
				role: "assistant",
				tone: "answer",
				...answer
			}]);
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
			setMessages((current) => [...current, {
				role: "assistant",
				text: trackingSummary(data),
				hasEnoughInfo: true,
				citations: [{
					id: `tracking:${data.trackingCode}`,
					title: `Status publik ${data.trackingCode}`,
					source: "Gjurmimi i dosjes"
				}],
				mode: "local",
				tone: "status"
			}]);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Kodi nuk u gjet.");
			setTrackingContext(null);
		} finally {
			setTrackingLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "fixed bottom-20 right-4 z-[60] flex items-center gap-2 rounded-full border border-primary/20 bg-background/95 p-1.5 pr-3 text-sm font-semibold text-foreground shadow-[0_18px_50px_rgba(6,35,76,0.22)] backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_22px_60px_rgba(6,35,76,0.26)] md:bottom-5 md:right-5",
		"aria-label": "Hap agjentin virtual",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/agents/ada-avatar.png",
				alt: "Ada",
				className: "size-14 rounded-full border-2 border-destructive bg-white object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-1 right-0 size-3 rounded-full border-2 border-background bg-success" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "hidden sm:flex flex-col items-start leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isStaff ? "Pyet AI" : "Pyet Ada" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-medium text-muted-foreground",
				children: "Asistente AI"
			})]
		})]
	}) : null, open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "fixed bottom-20 left-3 right-3 z-[60] flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden border-primary/20 bg-background shadow-[0_24px_80px_rgba(6,35,76,0.28)] md:bottom-5 md:left-auto md:right-5 md:h-[620px] md:w-[410px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b bg-[var(--brand-navy)] p-3 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/agents/ada-avatar.png",
								alt: "Ada",
								className: "size-14 rounded-full border-2 border-white bg-white object-cover shadow-soft"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-[var(--brand-navy)] bg-success" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-[10px] font-semibold uppercase text-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), "Agjent virtual"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-semibold leading-tight",
									children: isStaff ? "Ada per ekipin" : "Ada per qytetarin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-white/75",
									children: isStaff ? "Pyet per AI, raportet, Akt Vleresimi, vulosjen ose hapat e punes." : "Pyet per statusin, dokumentet, afatet, pershpejtimin ose ankesen."
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "ghost",
						onClick: () => setOpen(false),
						"aria-label": "Mbyll agjentin",
						className: "size-8 shrink-0 text-white hover:bg-white/10 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 rounded-md border border-white/15 bg-white/10 p-2",
					children: isStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2 text-xs leading-relaxed text-white/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-3.5 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ada shpjegon funksionet ne fjale te thjeshta. Per pyetje mbi nje dosje konkrete, hapni dosjen dhe perdorni tab-in AI." })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: trackingCode,
							onChange: (event) => setTrackingCode(event.target.value),
							placeholder: "Kodi i gjurmimit",
							className: "h-9 border-white/15 bg-white text-sm text-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "sm",
							variant: "secondary",
							onClick: lookupTracking,
							disabled: trackingLoading || !trackingCode.trim(),
							className: "h-9 shrink-0",
							children: [trackingLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 hidden sm:inline",
								children: "Kontrollo"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex items-center gap-2 text-[11px] text-white/75",
						children: trackingContext ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 truncate",
							children: [
								trackingContext.trackingCode,
								" - ",
								trackingContext.currentPhase.title
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate",
							children: "Kodi personalizon pergjigjet."
						})] })
					})] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b bg-muted/25 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: agentActions.map((item) => {
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: item.action,
							disabled: loading || trackingLoading,
							className: "flex h-9 items-center gap-2 rounded-md border bg-background px-2.5 text-left text-xs font-medium transition hover:bg-muted disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: item.label
							})]
						}, item.label);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: FAQ_SUGGESTED_QUESTIONS.slice(0, 2).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => submit(item),
						disabled: loading,
						className: "rounded-md border bg-background px-2 py-1 text-left text-[11px] transition hover:bg-muted disabled:opacity-50",
						children: item
					}, item))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto bg-muted/10 p-3",
				children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full min-h-44 flex-col items-center justify-center rounded-md border border-dashed bg-background/70 p-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-11 place-items-center rounded-full bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-sm font-semibold",
							children: "Si mund t'ju ndihmoj?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground",
							children: isStaff ? "Zgjidhni nje teme pune ose pyesni me fjale te thjeshta." : "Shkruani pyetjen ose perdorni veprimet e shpejta."
						})
					]
				}) : messages.map((message, index) => message.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-[86%] rounded-lg rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground shadow-soft",
						children: message.text
					})
				}, index) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md bg-[var(--brand-navy)] text-white",
						children: message.tone === "status" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-[92%] rounded-lg rounded-tl-sm border bg-background p-3 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-pre-wrap text-sm leading-relaxed",
							children: message.text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: message.mode === "ai" ? "secondary" : "outline",
									className: "text-[10px]",
									children: message.mode === "ai" ? "AI" : "Pyetje te shpeshta"
								}),
								!message.hasEnoughInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: "informacion i kufizuar"
								}) : null,
								message.citations.map((citation) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "text-[10px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3 mr-1" }), citation.title]
								}, citation.id))
							]
						})]
					})]
				}, index)), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), "Ada po pergatit pergjigjen..."]
				}) : null]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t px-3 py-2 text-xs text-destructive",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => {
					event.preventDefault();
					submit(question);
				},
				className: "flex gap-2 border-t bg-background p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: question,
					onChange: (event) => setQuestion(event.target.value),
					placeholder: "Shkruani pyetjen tuaj...",
					disabled: loading,
					className: "h-10 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: loading || !question.trim(),
					className: cn("h-10 px-3", loading && "opacity-80"),
					children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "Dergo"
					})]
				})]
			})
		]
	}) : null] });
}
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var roleIcons = {
	admin: ShieldCheck,
	operator: UserCog,
	citizen: UserRound,
	business: Building2
};
var primaryNav = [{
	to: "/",
	label: "Faqja Kryesore",
	icon: LayoutDashboard,
	exact: true
}, {
	to: "/dosjet",
	label: "Dosjet",
	icon: FolderKanban,
	badge: "4"
}];
var managementNav = [{
	to: "/raporte",
	label: "Raporte",
	icon: ChartColumn
}, {
	to: "/faq",
	label: "Pyetje te shpeshta",
	icon: CircleQuestionMark
}];
function pageLabel(path) {
	if (path.startsWith("/dosja/")) return "Detaje dosje";
	if (path.startsWith("/dosjet")) return "Dosjet";
	if (path.startsWith("/raporte")) return "Raporte";
	if (path.startsWith("/faq")) return "Pyetje te shpeshta";
	if (path.startsWith("/aplikim/dokumentacion")) return "Dokumentet e aplikimit";
	if (path.startsWith("/aplikim")) return "Aplikim i ri";
	if (path.startsWith("/biznes")) return "Regjistrim prone";
	if (path.startsWith("/track/")) return "Gjurmim qytetar";
	return "Faqja Kryesore";
}
function AppShell({ children, notifications = [] }) {
	const loc = useLocation();
	const navigate = useNavigate();
	const { role, profile, logout, can } = useDemoRole();
	const path = loc.pathname;
	const RoleIcon = roleIcons[role];
	const citizenPortalActive = path.startsWith("/track/");
	const businessPortalActive = path.startsWith("/biznes");
	const applicationDocsActive = path.startsWith("/aplikim/dokumentacion");
	const applicationPortalActive = path === "/aplikim";
	const faqActive = path.startsWith("/faq");
	const aiAgentAudience = role === "citizen" || role === "business" ? "public" : "staff";
	const isActive = (item) => item.to === "/dosjet" ? path.startsWith("/dosjet") || path.startsWith("/dosja/") : item.exact ? path === item.to : path.startsWith(item.to);
	function handleLogout() {
		logout();
		navigate({ to: "/login" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden md:flex fixed left-0 top-0 h-full w-[248px] flex-col z-50",
				style: { background: "linear-gradient(180deg, var(--brand-navy) 0%, var(--brand-navy-dark) 100%)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 pt-5 pb-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-3 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/brand/smart-dossier-logo-mark.svg",
								alt: "Smart Dossier",
								className: "size-9 object-contain shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-base font-bold text-white tracking-tight leading-tight",
								children: "Smart Dossier"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-white/45",
								children: "Portal dosjesh"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 px-3 space-y-0.5 overflow-y-auto",
						children: role === "citizen" || role === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroupLabel, { children: "Navigimi" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								to: "/aplikim",
								active: applicationPortalActive,
								icon: Scale,
								label: "Aplikim i ri"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								to: "/aplikim/dokumentacion",
								active: applicationDocsActive,
								icon: FileUp,
								label: "Dokumentet",
								nested: true
							}),
							role === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								to: "/biznes",
								active: businessPortalActive,
								icon: Building2,
								label: "Regjistrim prone"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								to: "/track/$code",
								params: { code: "EKB-2026-000014" },
								active: citizenPortalActive,
								icon: UserRound,
								label: "Gjurmo aplikimin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								to: "/faq",
								active: faqActive,
								icon: CircleQuestionMark,
								label: "Pyetje te shpeshta"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroupLabel, { children: "Kryesore" }),
							primaryNav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								to: item.to,
								active: isActive(item),
								icon: item.icon,
								label: item.label,
								badge: item.badge
							}, item.to)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroupLabel, {
								className: "mt-4",
								children: "Menaxhimi"
							}),
							managementNav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
								to: item.to,
								active: isActive(item),
								icon: item.icon,
								label: item.label
							}, item.to))
						] })
					}),
					(role === "citizen" || role === "business") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/aplikim",
							className: "flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-white py-2.5 rounded-md text-sm font-semibold transition-all duration-150 shadow-lg shadow-accent/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Aplikim i ri"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-3 pb-4 pt-3 mt-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMenuPopover, {
							role,
							profile,
							RoleIcon,
							onLogout: handleLogout
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:ml-[248px] flex flex-col min-h-screen",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden md:flex h-11 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-6 sticky top-0 z-30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "hover:text-foreground transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3 text-muted-foreground/40" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: pageLabel(path)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsPopover, { notifications })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-4 py-3 text-white md:hidden",
						style: { background: "linear-gradient(90deg, var(--brand-navy), var(--brand-navy-dark))" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-7 shrink-0 place-items-center rounded-lg bg-accent/25 text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-sm font-bold truncate",
								children: "Smart Dossier"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "text-[11px] text-white/60 hover:text-white transition-colors",
								children: profile.displayName
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 grid border-t pb-[env(safe-area-inset-bottom)] md:hidden",
				style: {
					gridTemplateColumns: "repeat(3, 1fr)",
					background: "var(--brand-navy-dark)",
					borderColor: "rgba(255,255,255,0.08)"
				},
				children: role === "citizen" || role === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileLink, {
						to: "/aplikim",
						active: applicationPortalActive || applicationDocsActive,
						icon: Scale,
						label: "Aplikim"
					}),
					role === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileLink, {
						to: "/biznes",
						active: businessPortalActive,
						icon: Building2,
						label: "Regjistrim"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileLink, {
						to: "/track/$code",
						params: { code: "EKB-2026-000014" },
						active: citizenPortalActive,
						icon: UserRound,
						label: "Gjurmim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileLink, {
						to: "/faq",
						active: faqActive,
						icon: CircleQuestionMark,
						label: "Pyetje te shpeshta"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: [...primaryNav, managementNav[0]].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileLink, {
					to: item.to,
					active: isActive(item),
					icon: item.icon,
					label: item.label
				}, item.to)) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenVirtualAgent, { audience: aiAgentAudience })
		]
	});
}
function NavGroupLabel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30", className),
		children
	});
}
function NavItem({ to, params, active, icon: Icon, label, badge, nested = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		params,
		className: cn("flex items-center gap-3 rounded-xl text-sm transition-all duration-150 select-none", nested ? "ml-5 py-2 px-3 text-xs" : "py-2.5 px-3", active ? "bg-accent text-white font-semibold shadow-md shadow-accent/20" : "text-white/60 hover:text-white hover:bg-white/[0.07]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("shrink-0", nested ? "size-3.5" : "size-[18px]") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: label
			}),
			badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("ml-auto grid size-5 place-items-center rounded-full text-[10px] font-bold", active ? "bg-white/20 text-white" : "bg-destructive/80 text-white"),
				children: badge
			}) : null
		]
	});
}
function MobileLink({ to, params, active, icon: Icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		params,
		className: cn("flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors", active ? "text-accent" : "text-white/40"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-[20px]", active && "text-accent") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate px-1",
			children: label
		})]
	});
}
function NotificationsPopover({ notifications }) {
	const count = notifications.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors",
			"aria-label": "Hap njoftimet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-3.5" }),
				"Njoftime",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-white",
					children: count
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		align: "end",
		className: "w-80 p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b px-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: "Njoftime"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted-foreground",
				children: count ? `${count} njoftime aktive` : "Nuk ka njoftime të reja"
			})]
		}), count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "max-h-80 overflow-y-auto p-2 space-y-1",
			children: notifications.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-lg border-l-2 border-accent/40 bg-muted/40 px-3 py-2 text-xs hover:bg-muted/70 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium text-foreground leading-snug",
					children: n.title
				}), n.meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-[11px] text-muted-foreground",
					children: n.meta
				}) : null]
			}, n.id ?? i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4 text-xs text-muted-foreground text-center",
			children: "Njoftimet e dosjes shfaqen këtu kur të ketë përditësime."
		})]
	})] });
}
async function callAi(prompt) {
	try {
		const d = await (await fetch("/api/ai/summary", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: "_platform_",
				_prompt: prompt
			})
		})).json();
		if (d.summary) return d.summary;
	} catch {
		return "";
	}
	return "";
}
var SETTINGS_CONTENT = `**Smart Dossier — Cilësimet e platformës**

• **Gjuha:** Shqip (sq-AL)
• **Zona kohore:** UTC+2 (Tiranë, Shqipëri)
• **Njoftime:** Aktivizuara për dosjet me alarme kritike
• **Ruajtja automatike:** Çdo 30 sekonda
• **Auditimi:** I aktivizuar — çdo veprim regjistrohet
• **Roli aktual:** Nëpunës civil — Dosje pronësore
• **Versioni i AI:** GPT-4o-mini (ekstraktim + asistencë)
• **Siguria:** Sesion i enkriptuar, të dhëna vetëm në server

*Cilësimet e avancuara administrohen nga administratori i sistemit.*`;
var ABOUT_CONTENT = `**Smart Dossier — Platforma e Menaxhimit të Dosjeve**

Smart Dossier është një platformë e digjitalizuar për procesin e privatizimit të banesave (EKB) dhe shpronësimit në Shqipëri.

**Çfarë bën AI në këtë platformë:**
• Lexon dhe nxjerr automatikisht të dhëna nga dokumentet e ngarkuara
• Sugjeron hapin tjetër bazuar në procesin ligjor
• Paralajmëron për pikat kritike dhe vonesat e mundshme
• Gjeneron përmbledhje për menaxherin në 3–5 fjali
• Përgjigjet pyetjeve të nëpunësit vetëm duke u bazuar në burime ligjore

**Teknologjia:** TanStack Start · React 19 · Tailwind v4 · OpenAI GPT-4o-mini

**Versioni:** v2.0 — Hakaton AI 2026
**Zhvilluar nga:** Innovation4Albania`;
function UserMenuPopover({ role, profile, RoleIcon, onLogout }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [dialog, setDialog] = (0, import_react.useState)(null);
	const [aiSettings, setAiSettings] = (0, import_react.useState)(null);
	const [aiAbout, setAiAbout] = (0, import_react.useState)(null);
	const [loadingAi, setLoadingAi] = (0, import_react.useState)(false);
	async function openDialog(type) {
		setOpen(false);
		setDialog(type);
		if (type === "settings" && !aiSettings) {
			setLoadingAi(true);
			setAiSettings(await callAi("Gjenero cilësimet e platformës Smart Dossier për nëpunësin civil.") || SETTINGS_CONTENT);
			setLoadingAi(false);
		}
		if (type === "about" && !aiAbout) {
			setLoadingAi(true);
			setAiAbout(await callAi("Gjenero një përshkrim të shkurtër të platformës Smart Dossier dhe rolit të AI.") || ABOUT_CONTENT);
			setLoadingAi(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-150 hover:bg-white/[0.07] group",
					style: {
						border: "1px solid rgba(255,255,255,0.08)",
						background: "rgba(255,255,255,0.04)"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-9 rounded-full flex items-center justify-center bg-gradient-to-br from-accent/60 to-accent/30 ring-2 ring-accent/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleIcon, { className: "size-4 text-white" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar bg-success" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold text-white truncate leading-tight",
								children: profile.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-white/45 truncate",
								children: profile.credentialLabel
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "size-3.5 text-white/30 group-hover:text-white/60 transition-colors shrink-0" })
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
				side: "top",
				align: "start",
				sideOffset: 8,
				className: "w-60 p-0 overflow-hidden",
				style: {
					background: "#1a2540",
					border: "1px solid rgba(255,255,255,0.10)"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3 flex items-center gap-3",
						style: { borderBottom: "1px solid rgba(255,255,255,0.08)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-8 rounded-full flex items-center justify-center bg-gradient-to-br from-accent/60 to-accent/30 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleIcon, { className: "size-4 text-white" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold text-white truncate",
								children: profile.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-white/45 truncate",
								children: profile.credentialLabel
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2 py-2 space-y-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Bell,
								label: "Njoftime",
								desc: "Alarme dhe përditësime",
								onClick: () => openDialog("njoftime")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Settings2,
								label: "Cilësimet",
								desc: "Preferencat e platformës",
								onClick: () => openDialog("settings"),
								badge: "AI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuItem, {
								icon: Info,
								label: "Rreth platformës",
								desc: "Smart Dossier v2.0",
								onClick: () => openDialog("about"),
								badge: "AI"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2 pb-2",
						style: { borderTop: "1px solid rgba(255,255,255,0.08)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onLogout,
							className: "w-full flex items-center gap-3 px-3 py-2 mt-1.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-destructive/15 transition-all duration-150 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4 shrink-0 text-destructive/60 group-hover:text-destructive transition-colors" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dil nga llogaria" })]
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dialog === "settings",
			onOpenChange: (o) => !o && setDialog(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "size-4 text-accent" }),
						"Cilësimet",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-2.5" }), " AI"]
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm leading-relaxed",
					children: loadingAi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-muted-foreground py-6 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Po gjenerohet nga AI…" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 text-foreground/90 whitespace-pre-wrap",
						children: (aiSettings || SETTINGS_CONTENT).split("\n").map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: line.startsWith("**") && line.endsWith("**") ? "font-semibold text-foreground" : "",
							children: line.replace(/\*\*/g, "")
						}, i))
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dialog === "about",
			onOpenChange: (o) => !o && setDialog(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4 text-accent" }),
						"Rreth platformës",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-2.5" }), " AI"]
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm leading-relaxed",
					children: loadingAi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-muted-foreground py-6 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Po gjenerohet nga AI…" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 text-foreground/90",
						children: (aiAbout || ABOUT_CONTENT).split("\n").map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: line.startsWith("**") && line.endsWith("**") ? "font-semibold text-foreground" : "",
							children: line.replace(/\*\*/g, "")
						}, i))
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dialog === "njoftime",
			onOpenChange: (o) => !o && setDialog(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4 text-accent" }), "Njoftime"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 py-2",
					children: [
						{
							title: "EKB-2026-000014 — alarm kritik",
							meta: "Certifikata familjare mungon · Tani",
							color: "border-destructive/50 bg-destructive/5"
						},
						{
							title: "3 dosje me afat brenda 7 ditëve",
							meta: "Shpronësim · Sot",
							color: "border-warning/50 bg-warning/5"
						},
						{
							title: "AI ekstraktoi dokumentin me 92% besueshmëri",
							meta: "EXP-2026-000003 · 2 orë më parë",
							color: "border-accent/30 bg-accent/5"
						}
					].map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("rounded-xl border px-3 py-2.5", n.color),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium text-foreground",
							children: n.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground mt-0.5",
							children: n.meta
						})]
					}, i))
				})]
			})
		})
	] });
}
function MenuItem({ icon: Icon, label, desc, onClick, badge }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 hover:bg-white/[0.07] group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "size-7 rounded-lg flex items-center justify-center bg-white/[0.06] group-hover:bg-accent/20 transition-colors shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-white/60 group-hover:text-accent transition-colors" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-white/80 group-hover:text-white transition-colors font-medium",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] text-white/35",
					children: desc
				})]
			}),
			badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-[9px] font-bold text-accent bg-accent/15 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-2" }), badge]
			})
		]
	});
}
//#endregion
export { DialogContent as a, DialogHeader as c, Dialog as i, DialogTitle as l, Badge as n, DialogDescription as o, CitizenVirtualAgent as r, DialogFooter as s, AppShell as t, DialogTrigger as u };
