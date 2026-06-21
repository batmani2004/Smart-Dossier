import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn, i as Input, n as Card, o as useDemoRole, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { $ as FileUp, K as Landmark, Ot as Building2, _ as ShieldCheck, ot as ExternalLink, rt as FileCheckCorner, ut as Copy, vt as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-CgYZPzcy.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { f as createBusinessPropertyApplication } from "./dossiers.functions-D8xRMefQ.mjs";
import { t as AppShell } from "./app-shell-zR2LMms-.mjs";
import { t as Textarea } from "./textarea-DCzrjZMV.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as AccessNotice } from "./role-switcher-Cgz82BMS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/biznes-CiVC35Yt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REQUIRED_DOCUMENTS = [
	{
		type: "business_nipt_extract",
		label: "Ekstrakt QKB / NIPT",
		helper: "Dokument qe identifikon subjektin dhe administratorin."
	},
	{
		type: "legal_representative_id",
		label: "ID e administratorit / perfaqesuesit",
		helper: "Karte identiteti ose autorizim per perfaqesues ligjor."
	},
	{
		type: "property_registration_request",
		label: "Kerkese per regjistrim prone",
		helper: "Formular kerkese me objektin e regjistrimit."
	},
	{
		type: "ownership_origin_document",
		label: "Akt origjine pronesie",
		helper: "Kontrate, vendim, akt dhurimi ose dokument tjeter i origjines."
	},
	{
		type: "property_plan",
		label: "Plan rilevimi / genplan",
		helper: "Plan me kufij, siperfaqe dhe te dhena teknike te pasurise."
	}
];
function absoluteTrackingUrl(code) {
	const path = `/track/${encodeURIComponent(code)}`;
	return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
}
function BusinessPortal() {
	const { role, profile } = useDemoRole();
	const create = useServerFn(createBusinessPropertyApplication);
	const qc = useQueryClient();
	const [businessName, setBusinessName] = (0, import_react.useState)("AlbaTech sh.p.k.");
	const [nipt, setNipt] = (0, import_react.useState)("L12345678A");
	const [representativeName, setRepresentativeName] = (0, import_react.useState)("Arben Dervishi");
	const [zone, setZone] = (0, import_react.useState)("Tirane");
	const [propertyDescription, setPropertyDescription] = (0, import_react.useState)("Njesi sherbimi dhe magazine logjistike");
	const [cadastralNo, setCadastralNo] = (0, import_react.useState)("7/188");
	const [areaSqm, setAreaSqm] = (0, import_react.useState)("320");
	const [notes, setNotes] = (0, import_react.useState)("Kerkohet regjistrimi i pasurise ne emer te subjektit sipas dokumentacionit te bashkengjitur.");
	const [documentNames, setDocumentNames] = (0, import_react.useState)({
		business_nipt_extract: "Ekstrakt-QKB-AlbaTech.pdf",
		legal_representative_id: "ID-administrator.pdf",
		property_registration_request: "Kerkese-regjistrimi.pdf",
		ownership_origin_document: "Kontrate-shitblerje.pdf"
	});
	const [created, setCreated] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const createdUrl = created ? absoluteTrackingUrl(created.trackingCode) : "";
	async function copyLink() {
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
	async function submitApplication() {
		setSubmitting(true);
		try {
			const documents = REQUIRED_DOCUMENTS.flatMap((doc) => {
				const name = documentNames[doc.type]?.trim();
				return name ? [{
					type: doc.type,
					name
				}] : [];
			});
			const result = await create({ data: {
				businessName,
				nipt,
				representativeName,
				zone,
				propertyDescription,
				cadastralNo: cadastralNo || void 0,
				areaSqm: areaSqm ? Number(areaSqm) : void 0,
				notes: notes || void 0,
				documents
			} });
			setCreated({
				id: result.id,
				trackingCode: result.trackingCode
			});
			setCopied(false);
			await Promise.all([qc.invalidateQueries({ queryKey: ["dossiers"] }), qc.invalidateQueries({ queryKey: ["dashboard"] })]);
			toast.success(`Aplikimi u regjistrua: ${result.trackingCode}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Aplikimi deshtoi");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-[1300px] grid-cols-1 gap-3 px-3 py-4 sm:gap-4 sm:px-4 md:px-6 xl:grid-cols-[minmax(0,1fr)_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				role !== "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessNotice, {
					title: "Pamje demo biznesi",
					body: "Kjo faqe simulon vetesherbimin e subjektit privat. Profili aktiv ndryshohet nga faqja e hyrjes."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" }), "Portali i biznesit"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-2xl font-semibold tracking-tight",
								children: "Aplikim per regjistrim prone me NIPT"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-2xl text-sm text-muted-foreground",
								children: "Subjekti identifikohet me NIPT, ngarkon dokumentacionin dhe dosja kalon te operatori i kadastres per shqyrtim."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full rounded-md border bg-card px-3 py-2 text-sm md:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Perdoruesi"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold",
								children: profile.displayName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: profile.credentialLabel
							})
						]
					})]
				}),
				created ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-success/25 bg-success/5 p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 size-5 shrink-0 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: "Aplikimi u regjistrua"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "U gjenerua linku i gjurmimit per biznesin. Subjekti mund ta hape nga kjo faqe ose nga opsioni \"Gjurmim aplikimi\" duke vendosur kodin BIZ."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid gap-2 md:grid-cols-[160px_minmax(0,1fr)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md border bg-background px-2 py-1.5 font-mono text-xs",
										children: created.trackingCode
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] text-muted-foreground break-all",
										children: createdUrl
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid gap-2 sm:flex sm:flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										className: "w-full sm:w-auto",
										onClick: copyLink,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 size-3.5" }), copied ? "Kopjuar" : "Kopjo linkun"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										type: "button",
										size: "sm",
										variant: "outline",
										className: "w-full sm:w-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: createdUrl,
											target: "_blank",
											rel: "noreferrer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1.5 size-3.5" }), "Hap linkun e gjurmimit"]
										})
									})]
								})
							]
						})]
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Te dhenat e subjektit dhe prones"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Emri i biznesit",
								value: businessName,
								setValue: setBusinessName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "NIPT",
								value: nipt,
								setValue: setNipt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Administrator / perfaqesues",
								value: representativeName,
								setValue: setRepresentativeName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Zona / Bashkia",
								value: zone,
								setValue: setZone
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Nr. kadastral",
								value: cadastralNo,
								setValue: setCadastralNo
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Siperfaqe m2",
								value: areaSqm,
								setValue: setAreaSqm,
								type: "number"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Pershkrimi i pasurise",
									value: propertyDescription,
									setValue: setPropertyDescription
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Shenime / arsyeja e aplikimit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: notes,
									onChange: (event) => setNotes(event.target.value),
									rows: 3,
									className: "text-sm"
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Dokumentacioni i aplikimit"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: REQUIRED_DOCUMENTS.map((doc) => {
								const uploaded = !!documentNames[doc.type]?.trim();
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("grid gap-2 rounded-md border p-3 md:grid-cols-[minmax(0,1fr)_240px]", uploaded ? "border-success/25 bg-success/5" : "bg-muted/20"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: cn("size-4", uploaded ? "text-success" : "text-muted-foreground") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-medium",
													children: doc.label
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted-foreground",
												children: doc.helper
											}),
											uploaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 rounded-md border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground",
												children: documentNames[doc.type]
											}) : null
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "file",
										accept: "application/pdf,image/*",
										className: "h-9 text-sm",
										onChange: (event) => {
											const file = event.target.files?.[0];
											if (!file) return;
											setDocumentNames((current) => ({
												...current,
												[doc.type]: file.name
											}));
										}
									})]
								}, doc.type);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-2 sm:flex sm:flex-wrap sm:justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								className: "w-full sm:w-auto",
								onClick: () => setCreated(null),
								children: "Pastro njoftimin"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								className: "w-full sm:w-auto",
								onClick: submitApplication,
								disabled: submitting,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1.5 size-4" }), submitting ? "Duke derguar..." : "Dergo aplikimin"]
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "Si shqyrtohet"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								number: "1",
								title: "Identifikim me NIPT",
								body: "Subjekti dhe administratori verifikohen nga dokumentet e QKB."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								number: "2",
								title: "Dokumente prone",
								body: "Operatori kontrollon aktin e origjines, planin dhe nr. kadastral."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								number: "3",
								title: "Kontroll AI GIS",
								body: "Verifikohet zona, siperfaqja, mbivendosjet e mundshme dhe sinjali AI GIS."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
								number: "4",
								title: "Vendim",
								body: "Miratim, kerkese per plotesim ose refuzim i arsyetuar."
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "Statusi pas dergimit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Aplikimi krijohet si dosje `BIZ`, shfaqet te radha e adminit per caktim operatori dhe gjurmohet publikisht me linkun e gjeneruar."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-wider text-primary",
							children: "Shpronesim biznesi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Nese pasuria e subjektit preket nga projekt publik, biznesi mund te aplikoje per kompensim dhe ta ndjeke pagesen nga Ministria e Ekonomise."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "mt-3 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/aplikim",
								children: "Apliko per kompensim"
							})
						})
					]
				})
			]
		})]
	}) });
}
function Field({ label, value, setValue, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type,
			value,
			onChange: (event) => setValue(event.target.value),
			className: "h-9 text-sm"
		})]
	});
}
function Step({ number, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground",
			children: number
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs leading-relaxed text-muted-foreground",
				children: body
			})]
		})]
	});
}
//#endregion
export { BusinessPortal as component };
