import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as Input, n as Card, o as useDemoRole, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { O as Plus, g as Sparkles, ot as ExternalLink, ut as Copy, vt as CircleCheck, x as Search } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-CgYZPzcy.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { p as createDossier, v as listDossiers } from "./dossiers.functions-D8xRMefQ.mjs";
import { a as DialogContent, c as DialogHeader, i as Dialog, l as DialogTitle, s as DialogFooter, t as AppShell, u as DialogTrigger } from "./app-shell-zR2LMms-.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as AccessNotice } from "./role-switcher-Cgz82BMS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CLY2nigl.mjs";
import { t as DossierBrowser } from "./dossier-browser-BeaKWP5T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dosjet-DqMct-NA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DosjetPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [process, setProcess] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [priority, setPriority] = (0, import_react.useState)("all");
	const { role, profile, can } = useDemoRole();
	const list = useServerFn(listDossiers);
	const listQ = useQuery({
		queryKey: [
			"dossiers",
			process,
			status,
			priority,
			q
		],
		queryFn: () => list({ data: {
			process: process === "all" ? void 0 : process,
			status: status === "all" ? void 0 : status,
			priority: priority === "all" ? void 0 : priority,
			search: q || void 0
		} })
	});
	if (role === "citizen" || role === "business") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[900px] space-y-4 px-4 py-5 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessNotice, {
			title: "Lista e dosjeve eshte e brendshme",
			body: role === "business" ? "Biznesi nuk sheh dosjet e subjekteve te tjera. Aplikimi behet me NIPT dhe gjurmohet me kodin publik." : "Qytetari nuk sheh dosjet e qytetareve te tjere, shenime pune, audit apo dokumente. Per qytetarin perdoret vetem kodi i gjurmimit."
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					className: "mt-4",
					children: role === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/biznes",
						children: "Hap portalin e biznesit"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/track/$code",
						params: { code: "EKB-2026-000014" },
						children: "Hap portalin qytetar"
					})
				})
			]
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1500px] space-y-3 px-3 py-4 sm:space-y-4 sm:px-4 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-semibold tracking-tight md:text-2xl",
						children: "Dosjet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Hapni radhen e punes; AI nxjerr sinjalet dhe nepunesi konfirmon veprimin."
					})]
				}), can("createDossier") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewDossierDialog, { onCreated: () => listQ.refetch() }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-primary/25 bg-primary/5 p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Radha e asistuar nga AI"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Filloni me prioritetin e larte; agjenti sugjeron verifikimin, llogaritjen dhe dokumentin per konfirmim."
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5 text-[11px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border bg-background px-2 py-1",
								children: "1. Lexo PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border bg-background px-2 py-1",
								children: "2. Llogarit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md border bg-background px-2 py-1",
								children: "3. Konfirmo"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "grid grid-cols-1 items-center gap-2 p-3 md:grid-cols-[1fr_auto_auto_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (event) => setQ(event.target.value),
							placeholder: "Kerko sipas kodit, titullit, qytetarit...",
							className: "h-9 pl-8 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: process,
						onValueChange: setProcess,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full text-sm md:w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Te gjitha proceset"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "ekb_privatization",
								children: "Privatizim EKB"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "expropriation",
								children: "Shpronesim"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "property_registration",
								children: "Regjistrim prone biznesi"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: setStatus,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full text-sm md:w-[150px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Te gjitha statuset"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "draft",
								children: "Draft"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "in_progress",
								children: "Ne proces"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "blocked",
								children: "Bllokuar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "awaiting_external",
								children: "Pritje institucionale"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "completed",
								children: "Mbyllur"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: priority,
						onValueChange: setPriority,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-9 w-full text-sm md:w-[140px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Cdo prioritet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "high",
								children: "I larte"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "normal",
								children: "Normal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "low",
								children: "I ulet"
							})
						] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DossierBrowser, {
				items: listQ.data?.items ?? [],
				total: listQ.data?.total,
				loading: listQ.isLoading,
				title: "Lista dhe kategorizimi i dosjeve",
				description: "Ndrysho pamjen, grupo radhen dhe hap direkt dosjen qe kerkon vemendje.",
				initialView: "board",
				initialGroupBy: "phase"
			})
		]
	}) });
}
function absoluteTrackingUrl(code) {
	const path = `/track/${encodeURIComponent(code)}`;
	return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}
function NewDossierDialog({ onCreated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [process, setProcess] = (0, import_react.useState)("ekb_privatization");
	const [title, setTitle] = (0, import_react.useState)("");
	const [applicantName, setApplicant] = (0, import_react.useState)("");
	const [applicantNipt, setApplicantNipt] = (0, import_react.useState)("");
	const [zone, setZone] = (0, import_react.useState)("");
	const [propertyDescription, setProp] = (0, import_react.useState)("");
	const [created, setCreated] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const create = useServerFn(createDossier);
	const qc = useQueryClient();
	const createdUrl = created ? absoluteTrackingUrl(created.trackingCode) : "";
	async function copyCreatedLink() {
		if (!createdUrl) return;
		try {
			await navigator.clipboard.writeText(createdUrl);
			setCopied(true);
			toast.success("Linku u kopjua");
			setTimeout(() => setCopied(false), 1600);
		} catch {
			toast.error("Linku nuk u kopjua");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) {
				setCreated(null);
				setCopied(false);
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "w-full sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 size-3.5" }), " Aplikim qytetari"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Regjistro aplikim qytetari" }) }),
				created ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-success/25 bg-success/5 p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 size-4 shrink-0 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Aplikimi u regjistrua"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Kodi dhe linku publik u gjeneruan per qytetarin."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 rounded-md border bg-background px-2 py-1.5 font-mono text-xs",
									children: created.trackingCode
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] break-all text-muted-foreground",
									children: createdUrl
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										onClick: copyCreatedLink,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 size-3.5" }), copied ? "Kopjuar" : "Kopjo linkun"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										type: "button",
										size: "sm",
										variant: "outline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: createdUrl,
											target: "_blank",
											rel: "noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1.5 size-3.5" }), "Hap portalin"]
										})
									})]
								})
							]
						})]
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Procesi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: process,
								onValueChange: (value) => setProcess(value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 text-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "ekb_privatization",
										children: "Privatizim EKB"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "expropriation",
										children: "Shpronesim"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "property_registration",
										children: "Regjistrim prone biznesi"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Titulli",
							value: title,
							setValue: setTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: process === "property_registration" ? "Biznesi / Subjekti" : "Qytetari / Pronari",
							value: applicantName,
							setValue: setApplicant
						}),
						process === "property_registration" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "NIPT",
							value: applicantNipt,
							setValue: setApplicantNipt
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Zona",
							value: zone,
							setValue: setZone
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Pershkrim i pasurise",
							value: propertyDescription,
							setValue: setProp
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setOpen(false),
					children: "Anulo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: async () => {
						try {
							const r = await create({ data: {
								process,
								title,
								applicantName,
								applicantNipt: applicantNipt || void 0,
								zone,
								propertyDescription
							} });
							setCreated({
								id: r.id,
								trackingCode: r.trackingCode
							});
							setCopied(false);
							toast.success(`Aplikimi u regjistrua dhe linku u gjenerua: ${r.trackingCode}`);
							setTitle("");
							setApplicant("");
							setApplicantNipt("");
							setZone("");
							setProp("");
							qc.invalidateQueries({ queryKey: ["dossiers"] });
							qc.invalidateQueries({ queryKey: ["dashboard"] });
							onCreated();
						} catch (e) {
							toast.error(e instanceof Error ? e.message : "Gabim");
						}
					},
					children: "Regjistro"
				})] })
			]
		})]
	});
}
function Field({ label, value, setValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (event) => setValue(event.target.value),
			className: "h-9 text-sm"
		})]
	});
}
//#endregion
export { DosjetPage as component };
