import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn, n as Card, o as useDemoRole, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { $ as FileUp, C as Scale, K as Landmark, Ot as Building2, Pt as ArrowLeft, m as Trash2, o as UserRound, rt as FileCheckCorner, vt as CircleCheck } from "../_libs/lucide-react.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Badge, t as AppShell } from "./app-shell-zR2LMms-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aplikim.dokumentacion-CnPI4Ft9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOC_GROUPS = [
	{
		id: "ekb",
		kind: "ekb_privatization",
		applicantType: "citizen",
		title: "Privatizim banese EKB",
		subtitle: "Dokumente bazë për verifikimin e përfituesit dhe banesës.",
		profile: "Qytetar",
		icon: UserRound,
		docs: [
			{
				type: "id_card_copy",
				label: "Kopje ID",
				helper: "Dokumenti identifikues i qytetarit përfitues.",
				required: true
			},
			{
				type: "family_certificate",
				label: "Certifikatë familjare",
				helper: "Përdoret për përbërjen familjare dhe normat e banimit.",
				required: true
			},
			{
				type: "income_proof",
				label: "Vërtetim të ardhurash",
				helper: "Përdoret për llogaritjen e vlerës sipas fashave të të ardhurave.",
				required: true
			},
			{
				type: "rent_contract_history",
				label: "Historik kontrate / qiraje",
				helper: "Provon lidhjen me banesën objekt privatizimi."
			},
			{
				type: "ashk_certificate_copy",
				label: "Kopje certifikate ASHK",
				helper: "Kopje e certifikatës ose kartelës së pasurisë kur disponohet."
			},
			{
				type: "marriage_certificate",
				label: "Certifikatë martese",
				helper: "Kërkohet kur statusi familjar ndikon në dosje."
			}
		]
	},
	{
		id: "shpronesim",
		kind: "expropriation",
		applicantType: "citizen",
		title: "Shpronësim / kompensim",
		subtitle: "Dokumente pronësie, akti i shpronësimit dhe të dhënat e pagesës.",
		profile: "Qytetar",
		icon: Landmark,
		docs: [
			{
				type: "id_card_copy",
				label: "Kopje ID",
				helper: "Dokumenti identifikues i pronarit ose përfaqësuesit.",
				required: true
			},
			{
				type: "ownership_extract",
				label: "Ekstrakt pronësie",
				helper: "Dokument që vërteton lidhjen me pasurinë.",
				required: true
			},
			{
				type: "civil_status_extract",
				label: "Ekstrakt gjendje civile",
				helper: "Për verifikim trashëgimie ose përputhje identiteti."
			},
			{
				type: "expropriation_notice",
				label: "Njoftim / akt shpronësimi",
				helper: "Akti që lidhet me projektin publik."
			},
			{
				type: "compensation_claim_request",
				label: "Kërkesë kompensimi",
				helper: "Kërkesa e nënshkruar për pagesën."
			},
			{
				type: "bank_account_certificate",
				label: "Vërtetim bankar / IBAN",
				helper: "Të dhënat ku kryhet disbursimi pas miratimit."
			}
		]
	},
	{
		id: "biznes",
		kind: "property_registration",
		applicantType: "business",
		title: "Regjistrim prone biznesi",
		subtitle: "Dokumente për identifikimin e subjektit dhe pasurinë që regjistrohet.",
		profile: "Biznes",
		icon: Building2,
		docs: [
			{
				type: "business_nipt_extract",
				label: "Ekstrakt QKB / NIPT",
				helper: "Identifikon subjektin dhe administratorin.",
				required: true
			},
			{
				type: "legal_representative_id",
				label: "ID e administratorit / përfaqësuesit",
				helper: "Kartë identiteti ose autorizim për përfaqësues ligjor.",
				required: true
			},
			{
				type: "property_registration_request",
				label: "Kërkesë për regjistrim prone",
				helper: "Formular kërkese me objektin e regjistrimit."
			},
			{
				type: "ownership_origin_document",
				label: "Akt origjine pronësie",
				helper: "Kontratë, vendim, akt dhurimi ose dokument tjetër i origjinës."
			},
			{
				type: "property_plan",
				label: "Plan rilevimi / genplan",
				helper: "Plan me kufij, sipërfaqe dhe të dhëna teknike të pasurisë."
			}
		]
	},
	{
		id: "shpronesim-biznes",
		kind: "expropriation",
		applicantType: "business",
		title: "Shpronësim / kompensim biznesi",
		subtitle: "Dokumente të subjektit, pronësisë, aktit të shpronësimit dhe llogarisë bankare.",
		profile: "Biznes",
		icon: Landmark,
		docs: [
			{
				type: "business_nipt_extract",
				label: "Ekstrakt QKB / NIPT",
				helper: "Identifikon subjektin dhe administratorin.",
				required: true
			},
			{
				type: "legal_representative_id",
				label: "ID administrator / përfaqësues",
				helper: "ID ose autorizim i personit që aplikon në emër të subjektit.",
				required: true
			},
			{
				type: "ownership_extract",
				label: "Ekstrakt pronësie",
				helper: "Dokument që lidh biznesin me pasurinë.",
				required: true
			},
			{
				type: "expropriation_notice",
				label: "Njoftim / akt shpronësimi",
				helper: "Akti i shpronësimit ose njoftimi për projektin publik."
			},
			{
				type: "compensation_claim_request",
				label: "Kërkesë kompensimi",
				helper: "Kërkesë e subjektit për disbursimin e kompensimit."
			},
			{
				type: "bank_account_certificate",
				label: "Vërtetim bankar / IBAN",
				helper: "Llogaria e subjektit për pagesën nga Ministria e Ekonomisë."
			}
		]
	}
];
var APPLICATION_DOCS_STORAGE_PREFIX = "smart-dossier-application-docs";
function applicationDocsStorageKey(kind, type) {
	return `${APPLICATION_DOCS_STORAGE_PREFIX}:${kind}:${type}`;
}
function defaultDocs(kind, type) {
	if (kind === "ekb_privatization") return {
		id_card_copy: "ID-qytetari.pdf",
		family_certificate: "Certifikate-familjare.pdf",
		income_proof: "Vertetim-te-ardhurash.pdf",
		rent_contract_history: "Historik-kontrate-qiraje.pdf",
		ashk_certificate_copy: "Kopje-certifikate-ASHK.pdf",
		marriage_certificate: "Certifikate-martese.pdf"
	};
	if (kind === "property_registration") return {
		business_nipt_extract: "Ekstrakt-QKB.pdf",
		legal_representative_id: "ID-administrator.pdf",
		property_registration_request: "Kerkese-regjistrimi.pdf",
		ownership_origin_document: "Akt-origjine-pronesie.pdf",
		property_plan: "Plan-rilevimi.pdf"
	};
	return type === "business" ? {
		business_nipt_extract: "Ekstrakt-QKB.pdf",
		legal_representative_id: "ID-administrator.pdf",
		ownership_extract: "Ekstrakt-pronesie.pdf",
		expropriation_notice: "Njoftim-shpronesimi.pdf",
		compensation_claim_request: "Kerkese-kompensimi-biznes.pdf",
		bank_account_certificate: "Vertetim-IBAN-biznes.pdf"
	} : {
		id_card_copy: "ID-pronari.pdf",
		ownership_extract: "Ekstrakt-pronesie.pdf",
		civil_status_extract: "Ekstrakt-gjendje-civile.pdf",
		expropriation_notice: "Njoftim-shpronesimi.pdf",
		compensation_claim_request: "Kerkese-kompensimi.pdf",
		bank_account_certificate: "Vertetim-IBAN.pdf"
	};
}
function readSavedDocumentNames(kind, type) {
	const defaults = defaultDocs(kind, type);
	if (typeof window === "undefined") return defaults;
	try {
		const raw = window.localStorage.getItem(applicationDocsStorageKey(kind, type));
		if (!raw) return defaults;
		return {
			...defaults,
			...JSON.parse(raw)
		};
	} catch {
		return defaults;
	}
}
function saveDocumentNames(kind, type, documentNames) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(applicationDocsStorageKey(kind, type), JSON.stringify(documentNames));
}
function OperatorDocumentationPage() {
	const { role } = useDemoRole();
	const defaultGroupId = role === "business" ? "biznes" : "ekb";
	const visibleGroups = (0, import_react.useMemo)(() => DOC_GROUPS.filter((group) => role === "business" ? group.applicantType === "business" : group.applicantType === "citizen"), [role]);
	const roleLabel = role === "business" ? "Biznes" : "Qytetar";
	const [documentNamesByGroup, setDocumentNamesByGroup] = (0, import_react.useState)(() => Object.fromEntries(DOC_GROUPS.map((group) => [group.id, readSavedDocumentNames(group.kind, group.applicantType)])));
	const selectedTotal = (0, import_react.useMemo)(() => visibleGroups.reduce((total, group) => total + group.docs.filter((doc) => documentNamesByGroup[group.id]?.[doc.type]?.trim()).length, 0), [documentNamesByGroup, visibleGroups]);
	function updateDocumentName(group, docType, fileName) {
		setDocumentNamesByGroup((current) => {
			const nextForGroup = {
				...current[group.id] ?? {},
				[docType]: fileName
			};
			saveDocumentNames(group.kind, group.applicantType, nextForGroup);
			return {
				...current,
				[group.id]: nextForGroup
			};
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1120px] space-y-3 px-3 py-4 sm:space-y-4 sm:px-4 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-primary/15 bg-white p-3 shadow-soft sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-3.5" }), "Dokumentet e aplikimit"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-xl font-semibold tracking-tight",
								children: "Ngarkoni dokumentet për dosjen tuaj"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground",
								children: [
									"Shfaqen vetëm dokumentet që duhen për profilin aktiv ",
									roleLabel.toLowerCase(),
									". Zgjidhni PDF ose imazhe, kontrolloni statusin dhe kthehuni te aplikimi për ta dërguar dosjen."
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid w-full shrink-0 gap-2 sm:flex sm:w-auto sm:flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							className: "h-9 justify-center rounded-md px-3 text-xs sm:justify-start",
							children: [
								roleLabel,
								" · ",
								selectedTotal,
								" dokumente"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							className: "h-9 w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/aplikim",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Kthehu te aplikimi"]
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuidanceStep, {
							number: "1",
							title: "Zgjidh procesin",
							body: "Privatizim, shpronësim ose regjistrim prone sipas profilit."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuidanceStep, {
							number: "2",
							title: "Ngarko dokumentet",
							body: "Çdo dokument ka shpjegim të shkurtër dhe status të dukshëm."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuidanceStep, {
							number: "3",
							title: "Dërgo aplikimin",
							body: "Dokumentet ruhen dhe bashkëngjiten automatikisht në dosje."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-sky-200 bg-sky-50/80 px-3 py-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-3" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold leading-tight",
								children: "Ruajtje automatike"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs leading-relaxed text-muted-foreground",
								children: "Emrat e dokumenteve ruhen menjëherë. Kur klikoni `Dërgo aplikimin`, dokumentet e zgjedhura kalojnë bashkë me dosjen."
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "w-fit shrink-0",
						children: [selectedTotal, " të zgjedhura"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 lg:grid-cols-2",
				children: visibleGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentationCard, {
					group,
					active: group.id === defaultGroupId,
					documentNames: documentNamesByGroup[group.id] ?? {},
					onDocumentNameChange: (docType, fileName) => updateDocumentName(group, docType, fileName)
				}, group.id))
			})
		]
	}) });
}
function GuidanceStep({ number, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2.5 rounded-lg border bg-muted/20 p-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground",
			children: number
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[11px] leading-relaxed text-muted-foreground",
				children: body
			})]
		})]
	});
}
function DocumentationCard({ group, active, documentNames, onDocumentNameChange }) {
	const Icon = group.icon;
	const selectedCount = group.docs.filter((doc) => documentNames[doc.type]?.trim()).length;
	const progress = Math.round(selectedCount / group.docs.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("overflow-hidden border-slate-200 bg-white p-0 shadow-sm", active && "border-primary/35"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("border-b bg-slate-50/75 p-3", active && "border-primary/15 bg-primary/[0.04]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground", active && "bg-primary text-primary-foreground"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold leading-snug",
								children: group.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted-foreground",
								children: group.subtitle
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "w-fit shrink-0 text-[11px]",
						children: [
							selectedCount,
							"/",
							group.docs.length
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-1 overflow-hidden rounded-full bg-white",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all",
						style: { width: `${progress}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-slate-100",
				children: group.docs.map((doc) => {
					const selectedName = documentNames[doc.type]?.trim();
					const inputId = `${group.id}-${doc.type}`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cn("bg-card px-3 py-2 transition-colors", selectedName ? "bg-success/[0.035]" : "hover:bg-muted/25"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", selectedName ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"),
									children: selectedName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "size-3" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[13px] font-semibold leading-tight",
												children: doc.label
											}),
											selectedName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success",
												children: "Gati"
											}) : null,
											doc.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-destructive/10 px-1.5 py-0.5 text-[9px] font-semibold text-destructive",
												children: "i detyrueshëm"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground",
												children: "opsional"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] leading-snug text-muted-foreground",
										children: doc.helper
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid min-w-0 gap-1.5 sm:flex sm:w-auto sm:max-w-[240px] sm:shrink-0 sm:items-center",
								children: [
									selectedName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 flex-1 items-center gap-1 rounded-md bg-muted/60 px-2 py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-mono text-[11px] text-foreground",
											children: selectedName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "icon",
											variant: "ghost",
											className: "size-5 shrink-0",
											onClick: () => onDocumentNameChange(doc.type, ""),
											"aria-label": "Hiq dokumentin",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: inputId,
										className: "flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/10 sm:py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-3" }), selectedName ? "Ndrysho" : "Ngarko"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: inputId,
										type: "file",
										accept: "application/pdf,image/*",
										className: "sr-only",
										onChange: (event) => {
											const file = event.target.files?.[0];
											if (!file) return;
											onDocumentNameChange(doc.type, file.name);
										}
									})
								]
							})]
						})
					}, doc.type);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-t bg-slate-50/70 px-3 py-2 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-success" }), "Do të ruhet me aplikimin për këtë proces."]
			})
		]
	});
}
//#endregion
export { OperatorDocumentationPage as component };
