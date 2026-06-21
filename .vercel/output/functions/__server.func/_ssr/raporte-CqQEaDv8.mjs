import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as Card, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { At as Bot, Et as ChartColumn, Tt as ChartPie, V as ListChecks, Z as Gauge, a as UsersRound, d as TriangleAlert, f as TrendingUp, ft as Clock3, kt as BriefcaseBusiness, nt as FileExclamationPoint } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { g as getDashboard, v as listDossiers } from "./dossiers.functions-D8xRMefQ.mjs";
import { n as Badge, t as AppShell } from "./app-shell-zR2LMms-.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as CartesianGrid, c as Cell, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/raporte-CqQEaDv8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHART_COLORS = [
	"var(--primary)",
	"var(--accent)",
	"var(--info)",
	"var(--success)",
	"var(--warning)",
	"var(--destructive)"
];
var STATUS_LABELS = {
	draft: "Draft",
	in_progress: "Ne proces",
	blocked: "Bllokuar",
	awaiting_external: "Pritje institucioni",
	completed: "Mbyllur",
	rejected: "Refuzuar"
};
var PROCESS_LABELS = {
	ekb_privatization: "EKB",
	expropriation: "Shpronesim",
	property_registration: "Biznes"
};
var AI_KINDS = new Set([
	"summary",
	"next_step",
	"extraction",
	"valuation"
]);
function ReportsPage() {
	const dash = useServerFn(getDashboard);
	const list = useServerFn(listDossiers);
	const dashQ = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => dash()
	});
	const items = useQuery({
		queryKey: ["dossiers", "all"],
		queryFn: () => list({ data: {} })
	}).data?.items ?? [];
	const statusCounts = dashQ.data?.countsByStatus ?? {};
	const expiringDeadlines = dashQ.data?.expiringDeadlines ?? [];
	const criticalAlerts = dashQ.data?.criticalAlerts ?? [];
	const bottlenecks = dashQ.data?.bottlenecks ?? [];
	const workloads = dashQ.data?.assignment.operatorWorkloads ?? [];
	const activeCount = items.filter((d) => d.status !== "completed" && d.status !== "rejected").length;
	const blockedCount = (statusCounts.blocked ?? 0) + (statusCounts.awaiting_external ?? 0);
	const overdueCount = expiringDeadlines.filter((d) => d.state === "overdue").length;
	const dueSoonCount = expiringDeadlines.filter((d) => d.state === "due_soon").length;
	const aiTouchedDossiers = items.filter((d) => d.insights.some((insight) => AI_KINDS.has(insight.kind))).length;
	const aiInsightCount = items.reduce((total, d) => total + d.insights.filter((insight) => AI_KINDS.has(insight.kind)).length, 0);
	const automationRate = items.length ? Math.round(aiTouchedDossiers / items.length * 100) : 0;
	const phaseData = (0, import_react.useMemo)(() => (dashQ.data?.countsByPhase ?? []).slice(0, 8).map((c) => ({
		name: `F${PROCESSES[c.processKind].phases.find((p) => p.id === c.phaseId)?.order ?? "?"}`,
		label: c.phaseTitle,
		count: c.count
	})), [dashQ.data]);
	const statusData = (0, import_react.useMemo)(() => Object.entries(statusCounts).map(([key, value], index) => ({
		name: STATUS_LABELS[key] ?? key,
		value,
		color: CHART_COLORS[index % CHART_COLORS.length]
	})), [statusCounts]);
	const processData = (0, import_react.useMemo)(() => {
		const counts = items.reduce((acc, d) => {
			acc[d.process] = (acc[d.process] ?? 0) + 1;
			return acc;
		}, {});
		return Object.entries(counts).map(([key, value], index) => ({
			name: PROCESS_LABELS[key] ?? key,
			value,
			color: CHART_COLORS[index % CHART_COLORS.length]
		}));
	}, [items]);
	const recentAi = (0, import_react.useMemo)(() => items.flatMap((d) => d.insights.filter((insight) => AI_KINDS.has(insight.kind)).map((insight) => ({
		dossierId: d.id,
		trackingCode: d.trackingCode,
		kind: insight.kind,
		text: insight.text,
		createdAt: insight.createdAt
	}))).sort((a, b) => b.createdAt > a.createdAt ? 1 : -1).slice(0, 6), [items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1400px] space-y-3 px-3 py-4 sm:space-y-4 sm:px-4 md:px-6 md:py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "Qendra e raporteve"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-semibold tracking-tight",
						children: "Raporte operative"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Fokus te afatet, bllokimet, ngarkesa e operatoreve dhe impakti i AI."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "outline",
					className: "w-full md:w-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dosjet",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "mr-1.5 size-4" }), "Hap listen e dosjeve"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: BriefcaseBusiness,
						label: "Dosje gjithsej",
						value: dashQ.data?.totals.dossiers ?? items.length,
						detail: `${activeCount} aktive`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: FileExclamationPoint,
						label: "Ne risk",
						value: blockedCount + criticalAlerts.length,
						detail: `${blockedCount} bllokuar / pritje`,
						tone: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: Clock3,
						label: "Afate",
						value: overdueCount + dueSoonCount,
						detail: `${overdueCount} tejkaluar, ${dueSoonCount} afer afatit`,
						tone: overdueCount ? "danger" : "default"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: Bot,
						label: "AI i perdorur",
						value: `${automationRate}%`,
						detail: `${aiInsightCount} veprime AI`,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						icon: UsersRound,
						label: "Pa operator",
						value: dashQ.data?.assignment.unassignedCount ?? 0,
						detail: `${dashQ.data?.assignment.autoDueCount ?? 0} per auto-caktim`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 xl:grid-cols-[1.15fr_0.85fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHeader, {
						icon: ChartColumn,
						title: "Dosje sipas fazes",
						description: "Ku po grumbullohet puna."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 sm:h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: phaseData,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										opacity: .25
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: { fontSize: 11 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: { fontSize: 11 },
										allowDecimals: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: tooltipStyle,
										labelFormatter: phaseLabel(phaseData)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "var(--primary)",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHeader, {
						icon: Gauge,
						title: "Fokus per sot",
						description: "Veprimet me prioritet me te larte."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							expiringDeadlines.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportLinkRow, {
								to: item.dossierId,
								code: item.trackingCode,
								title: item.label ?? item.title,
								meta: `${item.state === "overdue" ? "Tejkaluar" : "Afer afatit"}${item.daysRemaining !== void 0 ? ` · ${item.daysRemaining} dite` : ""}`,
								tone: item.state === "overdue" ? "danger" : "warning"
							}, `${item.dossierId}-${item.label}`)),
							criticalAlerts.slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportLinkRow, {
								to: item.dossierId,
								code: item.trackingCode,
								title: item.alert.label,
								meta: item.title,
								tone: "danger"
							}, `${item.dossierId}-${item.alert.id}`)),
							!expiringDeadlines.length && !criticalAlerts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Asnje alarm kritik per momentin."
							}) : null
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 xl:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHeader, {
								icon: ChartPie,
								title: "Statusi",
								description: "Shperndarja aktuale."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-52 sm:h-56",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: statusData,
										dataKey: "value",
										nameKey: "name",
										innerRadius: 48,
										outerRadius: 80,
										children: statusData.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, entry.name))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle })] })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { items: statusData })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHeader, {
							icon: TrendingUp,
							title: "Proceset",
							description: "Volumi sipas tipit te aplikimit."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-52 sm:h-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: processData,
									layout: "vertical",
									margin: { left: 10 },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											opacity: .25
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											type: "number",
											tick: { fontSize: 11 },
											allowDecimals: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											type: "category",
											dataKey: "name",
											tick: { fontSize: 11 },
											width: 96
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "value",
											radius: [
												0,
												4,
												4,
												0
											],
											children: processData.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, entry.name))
										})
									]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHeader, {
								icon: Bot,
								title: "AI dhe automatizimi",
								description: "Ku po kursen kohe."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-2 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniMetric, {
										label: "Dosje me AI",
										value: aiTouchedDossiers
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniMetric, {
										label: "Insight",
										value: aiInsightCount
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniMetric, {
										label: "Akt Vleresimi",
										value: items.filter((d) => d.insights.some((i) => i.kind === "valuation")).length
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: recentAi.length ? recentAi.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportLinkRow, {
									to: item.dossierId,
									code: item.trackingCode,
									title: item.text,
									meta: `${item.kind} · ${item.createdAt.slice(0, 16).replace("T", " ")}`,
									tone: "primary"
								}, `${item.dossierId}-${item.createdAt}-${item.kind}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Ende pa veprime AI te regjistruara."
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHeader, {
						icon: TriangleAlert,
						title: "Pengesat kryesore",
						description: "Fazat qe duhen liruar te parat."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [bottlenecks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold",
										children: item.phaseTitle
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground",
										children: [
											PROCESSES[item.processKind].code,
											" · ",
											item.total,
											" dosje · mesatarisht",
											" ",
											item.avgDaysInPhase,
											" dite"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "w-fit shrink-0 text-[10px]",
									children: ["score ", item.score]
								})]
							}), item.alertLabels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1",
								children: item.alertLabels.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px]",
									children: label
								}, label))
							}) : null]
						}, `${item.processKind}-${item.phaseId}`)), !bottlenecks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Pa pengesa te dukshme."
						}) : null]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHeader, {
						icon: UsersRound,
						title: "Ngarkesa e operatoreve",
						description: "Balancim i shpejte i punes."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [workloads.map((operator) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold",
										children: operator.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: operator.unit
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "shrink-0",
									children: [operator.activeCases, " aktive"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 h-1.5 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary",
									style: { width: `${Math.min(100, operator.activeCases * 18)}%` }
								})
							})]
						}, operator.id)), !workloads.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Pa operatore aktive."
						}) : null]
					})]
				})]
			})
		]
	}) });
}
var tooltipStyle = {
	borderRadius: 6,
	borderColor: "var(--border)",
	boxShadow: "var(--shadow-soft)"
};
function phaseLabel(data) {
	return (value) => data.find((item) => item.name === value)?.label ?? value;
}
function KpiCard({ icon: Icon, label, value, detail, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: `p-3 ${tone === "danger" ? "border-destructive/30 bg-destructive/5 text-destructive" : tone === "warning" ? "border-warning/40 bg-warning/10 text-warning-foreground" : tone === "primary" ? "border-primary/25 bg-primary/5 text-primary" : "border-border bg-card text-foreground"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium uppercase tracking-wide opacity-75",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-2xl font-semibold tracking-tight tabular-nums",
					children: value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs opacity-75",
					children: detail
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-8 shrink-0 place-items-center rounded-md bg-white/70 text-current",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			})]
		})
	});
}
function PanelHeader({ icon: Icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-start gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: description
		})] })]
	});
}
function MiniMetric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-muted/25 px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-lg font-semibold tabular-nums",
			children: value
		})]
	});
}
function ReportLinkRow({ to, code, title, meta, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/dosja/$id",
		params: { id: to },
		className: "flex items-start gap-2 rounded-md border bg-card p-2 transition hover:border-primary/30 hover:bg-muted/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 size-2 shrink-0 rounded-full ${tone === "danger" ? "bg-destructive" : tone === "warning" ? "bg-warning" : "bg-primary"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-0.5 block truncate text-[11px] text-muted-foreground",
				children: [
					code,
					" · ",
					meta
				]
			})]
		})]
	});
}
function Legend({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-2",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-2 rounded-full",
					style: { backgroundColor: item.color }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: item.value
				})
			]
		}, item.name))
	});
}
//#endregion
export { ReportsPage as component };
