import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn, i as Input, n as Card, o as useDemoRole, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { C as Scale, Dt as CalendarClock, H as Link2, Ot as Building2, Q as FolderKanban, St as ChevronRight, T as RefreshCw, d as TriangleAlert, et as FileText, g as Sparkles, h as TimerReset, ht as Circle, l as UserCheck, m as Trash2, ot as ExternalLink, p as TrendingDown, r as Wrench, s as UserPlus, st as EllipsisVertical, v as ShieldAlert, wt as Check, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { S as runAutoAssignment, b as resetDemo, g as getDashboard, i as assignDossier, r as aiRiskBrief, t as addOperator, v as listDossiers, y as removeOperator } from "./dossiers.functions-D8xRMefQ.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as DialogContent, c as DialogHeader, i as Dialog, l as DialogTitle, n as Badge, o as DialogDescription, t as AppShell } from "./app-shell-zR2LMms-.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CLY2nigl.mjs";
import { n as SeverityBadge } from "./status-badge-Qt_WaQgB.mjs";
import { i as ToggleGroupItem, n as Skeleton, r as ToggleGroup, t as DossierBrowser } from "./dossier-browser-BeaKWP5T.mjs";
import { t as Markdown$1 } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DblK6Swx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Markdown({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("prose-dossier text-sm text-foreground", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown$1, { children })
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function DashboardPage() {
	const [processFilter, setProcessFilter] = (0, import_react.useState)("all");
	const [briefOpen, setBriefOpen] = (0, import_react.useState)(false);
	const [selectedOperators, setSelectedOperators] = (0, import_react.useState)({});
	const [publicTrackingCode, setPublicTrackingCode] = (0, import_react.useState)("EKB-2026-000014");
	const [newOperatorName, setNewOperatorName] = (0, import_react.useState)("");
	const [newOperatorUnit, setNewOperatorUnit] = (0, import_react.useState)("Kadaster - Tirane");
	const { role, profile, can } = useDemoRole();
	const qc = useQueryClient();
	const dash = useServerFn(getDashboard);
	const list = useServerFn(listDossiers);
	const reset = useServerFn(resetDemo);
	const brief = useServerFn(aiRiskBrief);
	const assign = useServerFn(assignDossier);
	const autoAssign = useServerFn(runAutoAssignment);
	const addOperatorFn = useServerFn(addOperator);
	const removeOperatorFn = useServerFn(removeOperator);
	const briefQ = useQuery({
		queryKey: ["ai-risk-brief"],
		queryFn: () => brief(),
		enabled: can("runAi"),
		staleTime: 5 * 6e4
	});
	const dashQ = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => dash()
	});
	const listQ = useQuery({
		queryKey: ["dossiers", processFilter],
		queryFn: () => list({ data: processFilter === "all" ? {} : { process: processFilter } })
	});
	const kpi = (0, import_react.useMemo)(() => {
		const d = dashQ.data;
		if (!d) return null;
		return {
			active: (d.countsByStatus.in_progress ?? 0) + (d.countsByStatus.awaiting_external ?? 0),
			blocked: d.countsByStatus.blocked ?? 0,
			expiring7d: d.expiringDeadlines.filter((x) => x.state === "due_soon" && (x.daysRemaining ?? 0) <= 7).length,
			aiThisWeek: d.recentExtractions.length
		};
	}, [dashQ.data]);
	(0, import_react.useEffect)(() => {
		if (dashQ.error) toast.error("Gabim gjatë ngarkimit të faqes kryesore");
	}, [dashQ.error]);
	(0, import_react.useEffect)(() => {
		if (listQ.error) toast.error("Gabim gjatë ngarkimit të dosjeve");
	}, [listQ.error]);
	(0, import_react.useEffect)(() => {
		setPublicTrackingCode(role === "business" ? "BIZ-2026-000901" : "EKB-2026-000014");
	}, [role]);
	async function handleReset() {
		if (!can("resetDemo")) {
			toast.error("Vetem Admin mund te beje reset te demo data.");
			return;
		}
		try {
			await reset();
			toast.success("Demo data u rifreskua");
			dashQ.refetch();
			listQ.refetch();
		} catch {
			toast.error("Reset dështoi");
		}
	}
	async function handleAssignDossier(id, operatorId) {
		try {
			const result = await assign({ data: {
				id,
				operatorId
			} });
			toast.success(`Dosja iu caktua ${result.assignedOperatorName}`);
			await Promise.all([
				dashQ.refetch(),
				listQ.refetch(),
				qc.invalidateQueries({ queryKey: ["dossiers"] })
			]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Caktimi dështoi");
		}
	}
	async function handleAutoAssign() {
		try {
			const result = await autoAssign();
			toast.success(result.assigned.length ? `U caktuan automatikisht ${result.assigned.length} dosje` : "Nuk ka dosje që kanë kaluar 30 minuta");
			await Promise.all([
				dashQ.refetch(),
				listQ.refetch(),
				qc.invalidateQueries({ queryKey: ["dossiers"] })
			]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Auto-assign dështoi");
		}
	}
	async function handleAddOperator() {
		if (!can("manageUsers")) {
			toast.error("Vetem Admin mund te menaxhoje operatoret.");
			return;
		}
		if (!newOperatorName.trim() || !newOperatorUnit.trim()) {
			toast.error("Plotesoni emrin dhe njesine e operatorit.");
			return;
		}
		try {
			const result = await addOperatorFn({ data: {
				name: newOperatorName.trim(),
				unit: newOperatorUnit.trim()
			} });
			toast.success(`Operatori u shtua: ${result.operator.name}`);
			setNewOperatorName("");
			await Promise.all([dashQ.refetch(), listQ.refetch()]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Shtimi i operatorit deshtoi");
		}
	}
	async function handleRemoveOperator(id) {
		if (!can("manageUsers")) {
			toast.error("Vetem Admin mund te menaxhoje operatoret.");
			return;
		}
		try {
			const result = await removeOperatorFn({ data: { id } });
			toast.success(result.requeued ? `Operatori u hoq; ${result.requeued} dosje u kthyen ne radhe.` : "Operatori u hoq.");
			await Promise.all([dashQ.refetch(), listQ.refetch()]);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Heqja e operatorit deshtoi");
		}
	}
	if (role === "citizen" || role === "business") {
		const normalizedTrackingCode = publicTrackingCode.trim().toUpperCase();
		const trackingHref = normalizedTrackingCode ? `/track/${encodeURIComponent(normalizedTrackingCode)}` : "";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[960px] space-y-3 px-3 py-4 sm:space-y-4 sm:px-4 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md border bg-white p-4 shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-primary",
								children: role === "business" ? "Portal biznesi" : "Portal qytetari"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-1 text-xl font-semibold tracking-tight",
								children: ["Mire se erdhe, ", profile.displayName]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Zgjidh nje veprim dhe vazhdo pa menu te panevojshme."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: profile.credentialLabel
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuidePanel, { role }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex flex-col justify-between gap-3 border-primary/25 bg-primary/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Aplikim i ri"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Nis aplikimin sipas profilit: qytetar per EKB/shpronesim ose biznes per NIPT."
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "w-full shrink-0 sm:w-fit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/aplikim",
								children: "Nis aplikimin"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex items-start gap-3 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-10 shrink-0 place-items-center rounded-md bg-[var(--brand-blue-soft)] text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Gjurmim aplikimi"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: role === "business" ? "Vendos kodin BIZ ose hap linkun e gjeneruar ne momentin e aplikimit." : "Vendos kodin e gjurmimit ose hap linkun e gjeneruar ne momentin e aplikimit."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: publicTrackingCode,
										onChange: (event) => setPublicTrackingCode(event.target.value),
										placeholder: role === "business" ? "BIZ-2026-000901" : "EKB-2026-000014",
										className: "h-10 font-mono text-sm",
										"aria-label": "Kodi i gjurmimit"
									}), trackingHref ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										type: "button",
										className: "w-full shrink-0 sm:w-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: trackingHref,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1.5 size-4" }), "Gjurmo aplikimin"]
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										disabled: true,
										className: "w-full shrink-0 sm:w-auto",
										children: "Gjurmo aplikimin"
									})]
								})
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartDossierFocus, { compact: true })
			]
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] space-y-4 px-3 py-4 sm:px-4 md:space-y-5 md:px-6 md:py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-semibold tracking-tight md:text-2xl",
						children: "Qendra e punes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs md:text-sm text-muted-foreground",
						children: "Rradha e dosjeve, sinjalet kritike dhe agjentet AI qe pergatisin punen per konfirmim."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:flex sm:flex-wrap sm:items-center lg:justify-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							className: "w-full sm:w-auto",
							onClick: () => setBriefOpen(true),
							"data-testid": "ai-risk-brief",
							disabled: !can("runAi"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 mr-1.5" }), "Analizo me AI"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							asChild: true,
							className: "w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dosjet",
								children: "Rradha e dosjeve"
							})
						}),
						can("resetDemo") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								"aria-label": "Demo / dev",
								"data-testid": "dev-menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-56",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
									className: "flex items-center gap-1.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-3.5" }), " Demo / Dev"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: handleReset,
									"data-testid": "reset-demo",
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5 mr-2" }), "Reset demo data"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									asChild: true,
									className: "text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/track/$code",
										params: { code: "EKB-2026-000014" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 mr-2" }), "Hap track DEMO (EKB-2026-000014)"]
									})
								})
							]
						})] }) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGuidePanel, { role }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiWorkConsole, {
				data: dashQ.data,
				loading: dashQ.isLoading,
				canRunAi: can("runAi"),
				canManageUsers: can("manageUsers"),
				onRiskBrief: () => setBriefOpen(true),
				onAutoAssign: handleAutoAssign
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4",
				"data-testid": "kpi-strip",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-4" }),
						label: "Dosje aktive",
						value: kpi?.active,
						loading: dashQ.isLoading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4" }),
						label: "Të bllokuara",
						value: kpi?.blocked,
						tone: "critical",
						loading: dashQ.isLoading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4" }),
						label: "Afate 7 dite",
						value: kpi?.expiring7d,
						tone: "warning",
						loading: dashQ.isLoading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
						label: "Pune AI",
						value: kpi?.aiThisWeek,
						tone: "info",
						loading: dashQ.isLoading
					})
				]
			}),
			can("runAi") && (briefQ.isLoading || briefQ.data) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4 border-destructive/25 bg-destructive/5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-destructive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: "AI Risk Brief"
								}),
								briefQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-muted-foreground" })
							]
						}), briefQ.data?.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-8 w-full text-xs sm:h-7 sm:w-auto",
							onClick: () => setBriefOpen(true),
							children: "Detaje të plota"
						})]
					}),
					briefQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Po analizohen risqet nga AI…"
					}),
					briefQ.data?.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm leading-relaxed",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { children: briefQ.data.brief.length > 600 ? briefQ.data.brief.slice(0, 600) + "…" : briefQ.data.brief })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 pt-1 border-t",
							children: briefQ.data.ranked.slice(0, 3).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-2.5" }),
									r.label,
									" · ",
									r.affectedCount,
									" dosje"
								]
							}, `${r.phaseId}-${r.label}`))
						})]
					}),
					briefQ.data?.ok === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: briefQ.data.error
					})
				]
			}) : null,
			can("manageUsers") && dashQ.data?.assignment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: "Operatoret dhe caktimet"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Admini shton, heq dhe cakton operatore sipas ngarkeses se dosjeve."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "w-full sm:w-auto",
							onClick: handleAutoAssign,
							disabled: dashQ.data.assignment.autoDueCount === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimerReset, { className: "size-3.5 mr-1" }), "Auto-assign tani"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-1 md:grid-cols-3 gap-2",
						children: dashQ.data.assignment.operatorWorkloads.map((operator) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border bg-muted/30 px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: operator.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: operator.unit
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "icon",
									variant: "ghost",
									className: "size-8 shrink-0 text-muted-foreground hover:text-destructive",
									onClick: () => handleRemoveOperator(operator.id),
									"aria-label": `Hiq ${operator.name}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs font-semibold text-primary",
								children: [operator.activeCases, " çështje aktive"]
							})]
						}, operator.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2 rounded-md border bg-background p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: newOperatorName,
								onChange: (event) => setNewOperatorName(event.target.value),
								placeholder: "Emri i operatorit",
								className: "h-9 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: newOperatorUnit,
								onChange: (event) => setNewOperatorUnit(event.target.value),
								placeholder: "Njesia / institucioni",
								className: "h-9 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								className: "w-full md:w-auto",
								onClick: handleAddOperator,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-1.5 size-3.5" }), "Shto operator"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-2",
						children: dashQ.data.assignment.queue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-success/25 bg-success/10 px-3 py-2 text-sm text-success",
							children: "Nuk ka aplikime në pritje për caktim operatori."
						}) : dashQ.data.assignment.queue.map((item) => {
							const selected = selectedOperators[item.id] ?? dashQ.data.assignment.operatorWorkloads[0]?.id ?? "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-2 rounded-md border bg-card p-3 md:grid-cols-[minmax(0,1fr)_190px_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[11px] text-muted-foreground",
													children: item.trackingCode
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: item.overdue ? "bg-destructive/15 text-destructive border-destructive/20" : "bg-warning/15 text-warning border-warning/20",
													children: item.overdue ? "Auto-assign gati" : "Në pritje 30 min"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 truncate text-sm font-medium",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													item.applicantName,
													" · afati",
													" ",
													new Date(item.assignmentDueAt).toLocaleTimeString("sq-AL", {
														hour: "2-digit",
														minute: "2-digit"
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selected,
										onValueChange: (value) => setSelectedOperators((prev) => ({
											...prev,
											[item.id]: value
										})),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-9 text-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: dashQ.data.assignment.operatorWorkloads.map((operator) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: operator.id,
											children: [
												operator.name,
												" (",
												operator.activeCases,
												")"
											]
										}, operator.id)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										className: "w-full md:w-auto",
										onClick: () => handleAssignDossier(item.id, selected),
										disabled: !selected,
										children: "Cakto"
									})
								]
							}, item.id);
						})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroup, {
				type: "single",
				value: processFilter,
				onValueChange: (v) => v && setProcessFilter(v),
				className: "grid grid-cols-2 justify-start gap-1 sm:flex sm:flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItem, {
						value: "all",
						className: "text-xs",
						children: "Të gjitha"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItem, {
						value: "ekb_privatization",
						className: "text-xs",
						children: "Privatizim EKB"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItem, {
						value: "expropriation",
						className: "text-xs",
						children: "Shpronësim"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItem, {
						value: "property_registration",
						className: "text-xs",
						children: "Biznes / regjistrim prone"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Pengesat kritike"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: dashQ.data?.bottlenecks.length ? dashQ.data.bottlenecks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b last:border-0 py-2 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: b.phaseTitle
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground truncate",
										children: [
											PROCESSES[b.processKind].title,
											" · ",
											b.total,
											" dosje · ~",
											b.avgDaysInPhase,
											"d në fazë"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [b.stuck > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SeverityBadge, {
										severity: "critical",
										children: [b.stuck, " bllok."]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold tabular-nums text-muted-foreground",
										children: ["score ", b.score]
									})]
								})]
							}), b.alertLabels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: b.alertLabels.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] font-normal",
									children: l
								}, l))
							})]
						}, `${b.processKind}-${b.phaseId}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Pa pengesa."
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "size-4 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Afate që përfundojnë"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: dashQ.data?.expiringDeadlines.length ? dashQ.data.expiringDeadlines.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/dosja/$id",
							params: { id: d.dossierId },
							className: "flex items-center justify-between gap-2 text-sm border-b last:border-0 py-1.5 hover:bg-muted/40 rounded px-1 -mx-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-medium",
									children: d.label ?? "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground truncate",
									children: d.title
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "shrink-0 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: d.state === "overdue" ? "text-xs font-semibold text-destructive" : "text-xs font-semibold text-warning",
									children: d.state === "overdue" ? `${Math.abs(d.daysRemaining ?? 0)} ditë vonesë` : `${d.daysRemaining ?? 0} ditë`
								})
							})]
						}, d.dossierId)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Pa afate të afërta."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierBrowser, {
				items: listQ.data?.items ?? [],
				total: listQ.data?.total,
				loading: listQ.isLoading,
				title: "Dosjet kryesore",
				description: "E njejta kategorizim si radha e dosjeve, ne pamje kompakte per faqen kryesore.",
				initialView: "compact",
				initialGroupBy: "priority",
				maxItems: 12
			}),
			false,
			dashQ.data?.recentExtractions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-info" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Ekstraktime AI të fundit"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "text-sm space-y-1.5",
					children: dashQ.data.recentExtractions.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[11px] text-muted-foreground shrink-0",
							children: e.trackingCode
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground/90 line-clamp-1",
							children: e.insight.text
						})]
					}, e.insight.id))
				})]
			}) : null
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: briefOpen,
		onOpenChange: setBriefOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[88vh] w-[calc(100vw-1.5rem)] max-w-2xl overflow-y-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 text-destructive" }), "AI Risk Brief"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "5 risqet kryesore operacionale të gjeneruara nga AI mbi të dhënat aktuale të alarmeve." })] }),
				briefQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm text-muted-foreground py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Po analizohen risqet…"]
				}),
				briefQ.data && briefQ.data.ok === false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-destructive py-4",
					children: briefQ.data.error
				}),
				briefQ.data && briefQ.data.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2 text-xs sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
									label: "Aktive",
									value: briefQ.data.stats.activeDossiers
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
									label: "Bllokuara",
									value: briefQ.data.stats.blocked,
									tone: "critical"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
									label: "Institucionale",
									value: briefQ.data.stats.awaitingExternal,
									tone: "warning"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatPill, {
									label: "Vonesa",
									value: briefQ.data.stats.overdue,
									tone: "critical"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { children: briefQ.data.brief }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-semibold text-muted-foreground mb-2",
								children: "Të dhënat burimore (deterministe)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1.5",
								children: briefQ.data.ranked.slice(0, 5).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-muted-foreground shrink-0",
										children: ["#", i + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 flex-wrap",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
												severity: r.severity,
												children: r.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													"· ",
													r.affectedCount,
													" dosje · ~",
													r.avgDaysInPhase,
													"d në fazë"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground truncate",
											children: [
												r.processTitle,
												" → ",
												r.phaseTitle
											]
										})]
									})]
								}, `${r.phaseId}-${r.label}`))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground",
							children: [
								"Modeli: ",
								briefQ.data.model,
								" ·",
								" ",
								new Date(briefQ.data.generatedAt).toLocaleString("sq-AL")
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 pt-2 sm:flex sm:justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "w-full sm:w-auto",
						onClick: () => briefQ.refetch(),
						disabled: briefQ.isFetching,
						children: "Rigjenero"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: "w-full sm:w-auto",
						onClick: () => setBriefOpen(false),
						children: "Mbyll"
					})]
				})
			]
		})
	})] });
}
function RoleGuidePanel({ role }) {
	const isCitizen = role === "citizen";
	const isBusiness = role === "business";
	const isAdmin = role === "admin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden border-primary/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b bg-primary/5 px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Udhezues i thjeshte"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 text-base font-semibold",
					children: isCitizen ? "Qytetar: cfare mund te besh ketu" : isBusiness ? "Biznes: cfare mund te besh ketu" : isAdmin ? "Admin: kontrollo platformen" : "Operator: puno dosjen pa humbur kohe"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: isCitizen ? "Tre hapa te thjeshte: apliko, ruaj kodin dhe ndiq statusin." : isBusiness ? "Regjistro kerkesen me NIPT, ngarko dokumentet dhe ndiq shqyrtimin." : isAdmin ? "Shiko raportet, balanco operatoret dhe kontrollo sinjalet AI." : "AI pergatit informacionin; operatori kontrollon dhe konfirmon."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 p-4 md:grid-cols-3",
			children: (isCitizen ? [
				{
					icon: Scale,
					title: "1. Nis aplikimin",
					body: "Zgjidh procesin, ploteso te dhenat dhe ngarko dokumentet baze.",
					href: "/aplikim",
					action: "Apliko"
				},
				{
					icon: Link2,
					title: "2. Ruaj kodin",
					body: "Kodi i gjurmimit hap statusin, fazat, afatet dhe dokumentet.",
					href: "/track/EKB-2026-000014",
					action: "Gjurmo"
				},
				{
					icon: Sparkles,
					title: "3. Pyet Ada",
					body: "Asistentja AI shpjegon dokumentet, afatet, ankesen dhe pershpejtimin.",
					href: "/faq",
					action: "Ndihme"
				}
			] : isBusiness ? [
				{
					icon: Building2,
					title: "1. Identifikohu me NIPT",
					body: "Profili biznes perdor NIPT-in dhe te dhenat e perfaqesuesit ligjor.",
					href: "/biznes",
					action: "Regjistro"
				},
				{
					icon: FileText,
					title: "2. Ngarko dokumentet",
					body: "Shto aktin e pronesise, planin dhe autorizimet qe kerkon procesi.",
					href: "/aplikim/dokumentacion",
					action: "Dokumente"
				},
				{
					icon: Link2,
					title: "3. Ndiq linkun",
					body: "Linku BIZ tregon statusin dhe dokumentet qe leshohen nga sistemi.",
					href: "/track/BIZ-2026-000901",
					action: "Gjurmo"
				}
			] : isAdmin ? [
				{
					icon: ShieldAlert,
					title: "1. Shiko riskun",
					body: "AI Risk Brief tregon fazat me bllokime, vonesa dhe alarmet kryesore.",
					href: "/raporte",
					action: "Raporte"
				},
				{
					icon: UserCheck,
					title: "2. Balanco operatoret",
					body: "Shto, hiq ose cakto operatore sipas ngarkeses se dosjeve.",
					href: "/",
					action: "Operatorët"
				},
				{
					icon: Sparkles,
					title: "3. Kontrollo AI",
					body: "Shiko sa pune ka pergatitur AI: ekstraktime, permbledhje dhe Akt Vleresimi.",
					href: "/raporte",
					action: "AI"
				}
			] : [
				{
					icon: FolderKanban,
					title: "1. Hap dosjet me prioritet",
					body: "Filloni nga dosjet me alarm, afat te afert ose dokumente qe mungojne.",
					href: "/dosjet",
					action: "Dosjet"
				},
				{
					icon: Sparkles,
					title: "2. Perdorni tab-in AI",
					body: "AI ben permbledhje, sugjeron hapin tjeter dhe nxjerr fusha nga dokumentet.",
					href: "/dosjet",
					action: "AI"
				},
				{
					icon: FileText,
					title: "3. Gjenero dhe vulos",
					body: "Pas verifikimit krijo dokumentet, vulosi dhe ruaji ne audit.",
					href: "/dosjet",
					action: "Dokumente"
				}
			]).map((item) => {
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border bg-background p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 min-h-12 text-xs leading-relaxed text-muted-foreground",
								children: item.body
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "outline",
						className: "mt-3 h-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: item.href,
							children: item.action
						})
					})]
				}, item.title);
			})
		})]
	});
}
function AiWorkConsole({ data, loading, canRunAi, canManageUsers, onRiskBrief, onAutoAssign }) {
	const unassigned = data?.assignment?.unassignedCount ?? 0;
	const autoDue = data?.assignment?.autoDueCount ?? 0;
	const leastLoaded = data?.assignment?.operatorWorkloads?.[0];
	const topBottleneck = data?.bottlenecks?.[0];
	const expiring = data?.expiringDeadlines?.filter((item) => item.state === "overdue" || item.state === "due_soon").length ?? 0;
	const aiReads = data?.recentExtractions?.length ?? 0;
	const recommended = autoDue > 0 ? `${autoDue} dosje jane gati per auto-caktim` : topBottleneck ? `${topBottleneck.total} dosje kerkojne vemendje te ${topBottleneck.phaseTitle}` : "Rradha eshte e qete; kontrolloni dosjet e reja";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden border-primary/25 bg-primary/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-[minmax(0,1fr)_260px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "bg-primary text-primary-foreground",
							children: "AI workspace"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Nepunesi konfirmon"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-lg font-semibold tracking-tight",
						children: "Agjentet AI pergatisin dosjen para klikimit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-3xl text-sm text-muted-foreground",
						children: "Sistemi lexon dokumentet, propozon caktimin, llogarit sinjalet dhe nxjerr veprimin e radhes. Stafi sheh vetem cfare duhet te konfirmoje."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border bg-background/80 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Veprimi i radhes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm font-semibold",
						children: loading ? "Duke lexuar..." : recommended
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: onAutoAssign,
							disabled: !canManageUsers || autoDue === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimerReset, { className: "mr-1.5 size-3.5" }), "Auto-cakto"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/dosjet",
								children: "Hap rradhen"
							})
						})]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3 border-t bg-background/60 p-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentTile, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-4" }),
					title: "Agjenti i ndarjes se puneve",
					metric: loading ? "..." : `${unassigned} pa caktuar`,
					body: leastLoaded ? `Sugjeron ${leastLoaded.name}, sepse ka ${leastLoaded.activeCases} ceshtje aktive.` : "Analizon operatorin me ngarkesen me te ulet.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onAutoAssign,
						disabled: !canManageUsers || autoDue === 0,
						children: "Konfirmo ndarjen"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentTile, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
					title: "Agjenti i verifikimit",
					metric: loading ? "..." : `${aiReads} lexime AI`,
					body: "Nxjerr te dhenat nga PDF, shenon dokumentet qe mungojne dhe pergatit statusin per miratim.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dosjet",
							children: "Shiko dosjet"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentTile, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4" }),
					title: "Agjenti i llogaritjes",
					metric: loading ? "..." : `${expiring} sinjale`,
					body: "Monitoron afatet, faturat, kompensimin dhe rastet qe kerkojne vendim te shpejte.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: onRiskBrief,
						disabled: !canRunAi,
						children: "Raport AI"
					})
				})
			]
		})]
	});
}
function AgentTile({ icon, title, metric, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-start justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
						children: icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-semibold",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-medium text-primary",
							children: metric
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 min-h-10 text-xs leading-relaxed text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: action
			})
		]
	});
}
function SmartDossierFocus({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b bg-muted/30 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), "Smart Dossier"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 text-base font-semibold",
						children: "Nje dosje e vetme per procesin, dokumentet dhe gjurmimin"
					}),
					!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-3xl text-sm text-muted-foreground",
						children: "Programi fokusohet te shpronesimi per interes publik dhe privatizimi i banesave, ndersa aksesimi i dokumenteve sherben si shtresa qe lidh qytetarin, biznesin, operatorin dhe institucionet."
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 p-4 md:grid-cols-3",
				children: [
					{
						icon: Scale,
						title: "Shpronesimi per interes publik",
						body: "Aplikim, verifikim prone, vleresim, ankim dhe pagesa nga Ministria e Ekonomise.",
						action: "Apliko",
						href: "/aplikim"
					},
					{
						icon: Building2,
						title: "Privatizimi i banesave",
						body: "Dosja EKB kalon nga aplikimi dhe verifikimi deri te fatura, kontrata dhe certifikata.",
						action: "Shiko demo",
						href: "/track/EKB-2026-000014"
					},
					{
						icon: FileText,
						title: "Aksesimi i dokumenteve",
						body: "Dokumentet vulosen, ruhen ne dosje dhe hapen per shkarkim pas verifikimit te te drejtes.",
						action: "Pyetje te shpeshta",
						href: "/faq"
					}
				].map((pillar) => {
					const Icon = pillar.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border bg-background/80 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: pillar.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: pillar.body
								})]
							})]
						}), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							className: "mt-3 h-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: pillar.href,
								children: pillar.action
							})
						}) : null]
					}, pillar.title);
				})
			}),
			!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "1. Aplikim"
					}), " nga qytetar ose biznes."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "2. Operator"
					}), " verifikon dhe monitoron fazat."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "3. Institucione"
					}), " trajtojne pagesa, VKM, ASHK dhe dokumente."] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: "4. Gjurmim"
					}), " me link publik dhe dokumente te shkarkueshme."] })
				]
			}) : null
		]
	});
}
function StatPill({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border rounded-md px-2 py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] text-muted-foreground truncate",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-base font-semibold tabular-nums ${tone === "critical" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-foreground"}`,
			children: value
		})]
	});
}
function KpiCard({ icon, label, value, tone, loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex items-center gap-1.5 text-xs ${tone === "critical" ? "text-destructive" : tone === "warning" ? "text-warning" : tone === "info" ? "text-info" : "text-foreground"}`,
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: label
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-1 h-7 w-12" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-2xl font-semibold tabular-nums",
			children: value ?? "—"
		})]
	});
}
//#endregion
export { DashboardPage as component };
