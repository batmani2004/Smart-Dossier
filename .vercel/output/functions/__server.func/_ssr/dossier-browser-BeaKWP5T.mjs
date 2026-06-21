import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, n as Card } from "./demo-access-SJl8-tLA.mjs";
import { B as List, Ot as Building2, Q as FolderKanban, W as LayoutGrid, _t as CircleDashed, d as TriangleAlert, et as FileText, o as UserRound, w as Rows3 } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PROCESSES } from "./processes-CMdovryr.mjs";
import { n as Badge } from "./app-shell-zR2LMms-.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CLY2nigl.mjs";
import { n as SeverityBadge, r as StatusBadge, t as PriorityBadge } from "./status-badge-Qt_WaQgB.mjs";
import { t as Root } from "../_libs/radix-ui__react-toggle.mjs";
import { n as ToggleGroupItem$1, t as ToggleGroup$1 } from "../_libs/radix-ui__react-toggle-group.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dossier-browser-BeaKWP5T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var toggleVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium cursor-pointer transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-transparent",
			outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
		},
		size: {
			default: "h-9 px-2 min-w-9",
			sm: "h-8 px-1.5 min-w-8",
			lg: "h-10 px-2.5 min-w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Toggle = import_react.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(toggleVariants({
		variant,
		size,
		className
	})),
	...props
}));
Toggle.displayName = Root.displayName;
var ToggleGroupContext = import_react.createContext({
	size: "default",
	variant: "default"
});
var ToggleGroup = import_react.forwardRef(({ className, variant, size, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroup$1, {
	ref,
	className: cn("flex items-center justify-center gap-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupContext.Provider, {
		value: {
			variant,
			size
		},
		children
	})
}));
ToggleGroup.displayName = ToggleGroup$1.displayName;
var ToggleGroupItem = import_react.forwardRef(({ className, children, variant, size, ...props }, ref) => {
	const context = import_react.useContext(ToggleGroupContext);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleGroupItem$1, {
		ref,
		className: cn(toggleVariants({
			variant: context.variant || variant,
			size: context.size || size
		}), className),
		...props,
		children
	});
});
ToggleGroupItem.displayName = ToggleGroupItem$1.displayName;
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
var CATEGORY_LABELS = {
	all: {
		label: "Te gjitha",
		helper: "Gjithe rezultati"
	},
	attention: {
		label: "Kerkon vemendje",
		helper: "Alarm, afat ose prioritet"
	},
	unassigned: {
		label: "Pa operator",
		helper: "Ne pritje caktimi"
	},
	high_priority: {
		label: "Prioritet i larte",
		helper: "Per tu hapur i pari"
	},
	blocked: {
		label: "Bllokuar",
		helper: "Nuk ecen pa veprim"
	},
	due_soon: {
		label: "Afat i afert",
		helper: "Sot, vonese ose 7 dite"
	},
	waiting_external: {
		label: "Pritje institucionale",
		helper: "Koordinim me institucion"
	},
	completed: {
		label: "Mbyllur",
		helper: "Te perfunduara"
	}
};
var STATUS_LABELS = {
	draft: "Draft",
	in_progress: "Ne proces",
	blocked: "Bllokuar",
	awaiting_external: "Pritje institucionale",
	completed: "Mbyllur",
	rejected: "Refuzuar"
};
var PRIORITY_LABELS = {
	high: "Prioritet i larte",
	normal: "Prioritet normal",
	low: "Prioritet i ulet"
};
var CATEGORY_ORDER = [
	"all",
	"attention",
	"unassigned",
	"high_priority",
	"blocked",
	"due_soon",
	"waiting_external",
	"completed"
];
function DossierBrowser({ items, total, loading = false, title = "Dosjet", description = "Kategorizoni, gruponi dhe hapni dosjet sipas menyres se punes.", initialView = "board", initialGroupBy = "phase", maxItems, emptyTitle = "Pa dosje per keto filtra.", emptyBody = "Pastro filtrat ose krijo nje dosje te re.", className }) {
	const [category, setCategory] = (0, import_react.useState)("all");
	const [view, setView] = (0, import_react.useState)(initialView);
	const [groupBy, setGroupBy] = (0, import_react.useState)(initialGroupBy);
	const categoryCounts = (0, import_react.useMemo)(() => buildCategoryCounts(items), [items]);
	const categorized = (0, import_react.useMemo)(() => items.filter((item) => matchesCategory(item, category)), [category, items]);
	const visibleItems = (0, import_react.useMemo)(() => maxItems ? categorized.slice(0, maxItems) : categorized, [categorized, maxItems]);
	const groups = (0, import_react.useMemo)(() => groupDossiers(visibleItems, groupBy), [groupBy, visibleItems]);
	const displayedTotal = total ?? items.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("overflow-hidden p-0", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b px-3 py-3 sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 shrink-0 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "min-w-0 text-sm font-semibold",
									children: title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "shrink-0 text-[11px]",
									children: [displayedTotal, " rekorde"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: description
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid w-full grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center lg:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroup, {
							type: "single",
							value: view,
							onValueChange: (value) => value && setView(value),
							className: "grid grid-cols-3 justify-start sm:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroupItem, {
									value: "board",
									className: "h-8 px-2 text-xs",
									"aria-label": "Board",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "mr-1.5 size-3.5" }), "Board"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroupItem, {
									value: "list",
									className: "h-8 px-2 text-xs",
									"aria-label": "Liste",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "mr-1.5 size-3.5" }), "Liste"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToggleGroupItem, {
									value: "compact",
									className: "h-8 px-2 text-xs",
									"aria-label": "Kompakt",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rows3, { className: "mr-1.5 size-3.5" }), "Kompakt"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: groupBy,
							onValueChange: (value) => setGroupBy(value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-full text-xs sm:w-[165px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "phase",
									children: "Grupo sipas fazes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "process",
									children: "Grupo sipas procesit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "status",
									children: "Grupo sipas statusit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "operator",
									children: "Grupo sipas operatorit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "priority",
									children: "Grupo sipas prioritetit"
								})
							] })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8",
					children: CATEGORY_ORDER.map((key) => {
						const meta = CATEGORY_LABELS[key];
						const active = category === key;
						const count = categoryCounts[key] ?? 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCategory(key),
							className: cn("min-h-[4rem] rounded-md border px-2.5 py-2 text-left transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:border-primary/50 hover:bg-[var(--brand-blue-soft)]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-xs font-semibold",
									children: meta.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums", active ? "bg-white/15 text-white" : "bg-muted text-muted-foreground"),
									children: count
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("mt-1 truncate text-[10px]", active ? "text-primary-foreground/75" : "text-muted-foreground"),
								children: meta.helper
							})]
						}, key);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-2.5 sm:p-3",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierLoading, { view }) : !visibleItems.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDossierState, {
					title: emptyTitle,
					body: emptyBody
				}) : view === "board" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardView, { groups }) : view === "list" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListView, { groups }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompactView, { groups })
			}),
			maxItems && categorized.length > maxItems ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t bg-muted/25 px-4 py-2 text-xs text-muted-foreground",
				children: [
					"Po shfaqen ",
					maxItems,
					" nga ",
					categorized.length,
					" dosje ne kete kategori."
				]
			}) : null
		]
	});
}
function buildCategoryCounts(items) {
	const result = Object.fromEntries(CATEGORY_ORDER.map((key) => [key, 0]));
	for (const item of items) for (const key of CATEGORY_ORDER) if (matchesCategory(item, key)) result[key] += 1;
	return result;
}
function matchesCategory(item, category) {
	if (category === "all") return true;
	if (category === "attention") return item.status === "blocked" || item.priority === "high" || item.criticalCount > 0 || item.warningCount > 0 || item.deadlineState === "overdue" || item.deadlineState === "due_soon";
	if (category === "unassigned") return !item.assignedOperatorId && item.status !== "completed";
	if (category === "high_priority") return item.priority === "high";
	if (category === "blocked") return item.status === "blocked";
	if (category === "due_soon") return item.deadlineState === "overdue" || item.deadlineState === "due_soon";
	if (category === "waiting_external") return item.status === "awaiting_external";
	if (category === "completed") return item.status === "completed";
	return true;
}
function groupDossiers(items, groupBy) {
	const groups = /* @__PURE__ */ new Map();
	for (const item of items) {
		const meta = groupMeta(item, groupBy);
		const existing = groups.get(meta.key);
		if (existing) existing.items.push(item);
		else groups.set(meta.key, {
			...meta,
			items: [item]
		});
	}
	return Array.from(groups.values()).map((group) => ({
		...group,
		items: [...group.items].sort(sortDossiers)
	})).sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label));
}
function groupMeta(item, groupBy) {
	const proc = PROCESSES[item.process];
	const phase = currentPhase(item);
	if (groupBy === "process") return {
		key: `process:${item.process}`,
		label: proc.title,
		helper: proc.code,
		sort: processSort(item.process)
	};
	if (groupBy === "status") return {
		key: `status:${item.status}`,
		label: STATUS_LABELS[item.status],
		helper: "Statusi i dosjes",
		sort: statusSort(item.status)
	};
	if (groupBy === "operator") {
		const name = item.assignedOperatorName ?? "Pa operator";
		return {
			key: `operator:${item.assignedOperatorId ?? "none"}`,
			label: name,
			helper: item.assignedOperatorId ? "I caktuar" : "Ne pritje caktimi",
			sort: item.assignedOperatorId ? 10 : 0
		};
	}
	if (groupBy === "priority") return {
		key: `priority:${item.priority}`,
		label: PRIORITY_LABELS[item.priority],
		helper: "Renditje pune",
		sort: prioritySort(item.priority)
	};
	return {
		key: `phase:${item.process}:${item.currentPhaseId}`,
		label: `Faza ${phase?.order ?? "-"} - ${phase?.title ?? item.currentPhaseId}`,
		helper: proc.title,
		sort: processSort(item.process) * 100 + (phase?.order ?? 99)
	};
}
function BoardView({ groups }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3",
		children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-md border bg-muted/20 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, { group }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierTile, { item }, item.id))
			})]
		}, group.key))
	});
}
function ListView({ groups }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "overflow-hidden rounded-md border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b bg-muted/25 px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
					group,
					compact: true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
					className: "min-w-[480px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Kodi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Dosja"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "hidden text-xs sm:table-cell",
							children: "Aplikuesi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "hidden text-xs lg:table-cell",
							children: "Faza"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs",
							children: "Sinjale"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "hidden text-xs md:table-cell",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-xs text-right",
							children: "Veprim"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierTableRow, { item }, item.id)) })]
				})
			})]
		}, group.key))
	});
}
function CompactView({ groups }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupHeader, {
			group,
			compact: true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 divide-y rounded-md border",
			children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dosja/$id",
				params: { id: item.id },
				className: "grid gap-2 px-3 py-2 hover:bg-muted/40 md:grid-cols-[130px_minmax(0,1fr)_130px_120px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-xs text-muted-foreground",
						children: item.trackingCode
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								applicantName(item),
								" - ",
								propertyZone(item)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalBadges, {
							item,
							compact: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-start gap-1 md:justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: item.priority })
					})
				]
			}, item.id))
		})] }, group.key))
	});
}
function DossierTile({ item }) {
	const proc = PROCESSES[item.process];
	const phase = currentPhase(item);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/dosja/$id",
		params: { id: item.id },
		className: "block rounded-md border bg-card p-3 shadow-soft transition-colors hover:border-primary/40 hover:bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[11px] text-muted-foreground",
						children: item.trackingCode
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 line-clamp-2 text-sm font-semibold leading-snug",
						children: item.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorityBadge, { priority: item.priority })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-1.5 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaLine, {
						icon: processIcon(item.process),
						text: proc.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaLine, {
						icon: UserRound,
						text: applicantName(item)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaLine, {
						icon: CircleDashed,
						text: `Faza ${phase?.order ?? "-"} - ${phase?.title ?? item.currentPhaseId}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalBadges, { item })]
			})
		]
	});
}
function DossierTableRow({ item }) {
	const phase = currentPhase(item);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "font-mono text-xs",
			children: item.trackingCode
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
			className: "max-w-[260px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-xs font-medium",
				children: item.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-[11px] text-muted-foreground",
				children: PROCESSES[item.process].title
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "hidden max-w-[170px] truncate text-xs sm:table-cell",
			children: applicantName(item)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
			className: "hidden text-xs lg:table-cell",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium",
					children: ["Faza ", phase?.order ?? "-"]
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: ["- ", phase?.title ?? item.currentPhaseId]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalBadges, { item })
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "hidden md:table-cell",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			className: "text-right",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/dosja/$id",
				params: { id: item.id },
				className: "inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-primary hover:bg-[var(--brand-blue-soft)]",
				children: "Hap"
			})
		})
	] });
}
function GroupHeader({ group, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("truncate font-semibold", compact ? "text-sm" : "text-[13px]"),
				children: group.label
			}), group.helper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 truncate text-[11px] text-muted-foreground",
				children: group.helper
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 rounded-md bg-background px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground",
			children: group.items.length
		})]
	});
}
function SignalBadges({ item, compact = false }) {
	if (item.criticalCount + item.warningCount === 0 && item.deadlineState !== "overdue" && item.deadlineState !== "due_soon") return compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-xs text-muted-foreground",
		children: "Pa alarm"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
		severity: "info",
		children: "qete"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		item.criticalCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SeverityBadge, {
			severity: "critical",
			children: [item.criticalCount, " kritike"]
		}) : null,
		item.warningCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SeverityBadge, {
			severity: "warning",
			children: [item.warningCount, " paralajm."]
		}) : null,
		item.deadlineState === "overdue" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
			severity: "critical",
			children: "vonese"
		}) : null,
		item.deadlineState === "due_soon" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, {
			severity: "warning",
			children: "afat"
		}) : null
	] });
}
function MetaLine({ icon: Icon, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: text
		})]
	});
}
function DossierLoading({ view }) {
	const count = view === "board" ? 6 : 5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("grid gap-3", view === "board" ? "md:grid-cols-2 xl:grid-cols-3" : ""),
		children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md border p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-28" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-5 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-4 w-2/3" })
			]
		}, index))
	});
}
function EmptyDossierState({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-2 rounded-md border border-dashed py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-7 text-muted-foreground/60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-md text-xs text-muted-foreground",
				children: body
			})
		]
	});
}
function currentPhase(item) {
	return PROCESSES[item.process].phases.find((phase) => phase.id === item.currentPhaseId);
}
function applicantName(item) {
	return item.parties[0]?.fullName ?? "-";
}
function propertyZone(item) {
	return item.property.zone || "Zone pa emer";
}
function sortDossiers(a, b) {
	return prioritySort(a.priority) - prioritySort(b.priority) || signalSort(a) - signalSort(b) || (b.updatedAt > a.updatedAt ? 1 : -1);
}
function signalSort(item) {
	if (item.deadlineState === "overdue") return 0;
	if (item.criticalCount > 0 || item.status === "blocked") return 1;
	if (item.deadlineState === "due_soon") return 2;
	if (item.warningCount > 0) return 3;
	return 4;
}
function prioritySort(value) {
	if (value === "high") return 0;
	if (value === "normal") return 1;
	return 2;
}
function statusSort(value) {
	return [
		"blocked",
		"awaiting_external",
		"in_progress",
		"draft",
		"rejected",
		"completed"
	].indexOf(value);
}
function processSort(value) {
	return [
		"ekb_privatization",
		"expropriation",
		"property_registration"
	].indexOf(value);
}
function processIcon(process) {
	if (process === "property_registration") return Building2;
	if (process === "expropriation") return TriangleAlert;
	return FolderKanban;
}
//#endregion
export { ToggleGroupItem as i, Skeleton as n, ToggleGroup as r, DossierBrowser as t };
