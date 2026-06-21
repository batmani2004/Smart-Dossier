import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn, i as Input, n as Card, o as useDemoRole, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { $ as FileUp, C as Scale, K as Landmark, Ot as Building2, Y as House, _ as ShieldCheck, lt as CreditCard, o as UserRound, ot as ExternalLink, ut as Copy, vt as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-CgYZPzcy.mjs";
import { _ as Link, p as Outlet, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { f as createBusinessPropertyApplication, m as createExpropriationCompensationApplication, p as createDossier } from "./dossiers.functions-D8xRMefQ.mjs";
import { t as AppShell } from "./app-shell-zR2LMms-.mjs";
import { t as Textarea } from "./textarea-DCzrjZMV.mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aplikim-B90PkJ72.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOCS = {
	ekb_privatization: {
		citizen: [
			{
				type: "id_card_copy",
				label: "Kopje ID",
				helper: "Dokumenti identifikues i qytetarit perfitues."
			},
			{
				type: "family_certificate",
				label: "Certifikate familjare",
				helper: "Per verifikimin e perberjes familjare dhe normave te banimit."
			},
			{
				type: "income_proof",
				label: "Vertetim te ardhurash",
				helper: "Per llogaritjen e vleres sipas fashave te te ardhurave."
			},
			{
				type: "rent_contract_history",
				label: "Historik kontrate / qiraje",
				helper: "Dokumentacion qe provon lidhjen me banesen objekt privatizimi."
			},
			{
				type: "ashk_certificate_copy",
				label: "Kopje certifikate ASHK",
				helper: "Kopje e certifikates / karteles se pasurise kur disponohet."
			},
			{
				type: "marriage_certificate",
				label: "Certifikate martese",
				helper: "Kerkohet kur statusi familjar ndikon ne dosje."
			}
		],
		business: []
	},
	expropriation: {
		citizen: [
			{
				type: "id_card_copy",
				label: "Kopje ID",
				helper: "Dokumenti identifikues i pronarit ose perfaqesuesit."
			},
			{
				type: "ownership_extract",
				label: "Ekstrakt pronesie",
				helper: "Dokument qe verteton lidhjen me pasurine ne kadaster."
			},
			{
				type: "civil_status_extract",
				label: "Ekstrakt gjendje civile",
				helper: "Per verifikim trashegimie ose perputhje identiteti."
			},
			{
				type: "expropriation_notice",
				label: "Njoftim / akt shpronesimi",
				helper: "Njoftimi i marre ose akti qe lidhet me projektin publik."
			},
			{
				type: "compensation_claim_request",
				label: "Kerkese kompensimi",
				helper: "Kerkesa e nenshkruar per pagesen e shpronesimit."
			},
			{
				type: "bank_account_certificate",
				label: "Vertetim bankar / IBAN",
				helper: "Llogaria ku Ministria e Ekonomise do te dergoje pagesen."
			}
		],
		business: [
			{
				type: "business_nipt_extract",
				label: "Ekstrakt QKB / NIPT",
				helper: "Identifikon subjektin dhe administratorin."
			},
			{
				type: "legal_representative_id",
				label: "ID administrator / perfaqesues",
				helper: "ID ose autorizim i personit qe aplikon."
			},
			{
				type: "ownership_extract",
				label: "Ekstrakt pronesie",
				helper: "Dokument qe lidh biznesin me pasurine."
			},
			{
				type: "expropriation_notice",
				label: "Njoftim / akt shpronesimi",
				helper: "Akti i shpronesimit ose njoftimi per projektin publik."
			},
			{
				type: "compensation_claim_request",
				label: "Kerkese kompensimi",
				helper: "Kerkese e subjektit per disbursimin e kompensimit."
			},
			{
				type: "bank_account_certificate",
				label: "Vertetim bankar / IBAN",
				helper: "Llogaria e subjektit per pagesen nga Ministria e Ekonomise."
			}
		]
	},
	property_registration: {
		citizen: [],
		business: [
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
		]
	}
};
function absoluteTrackingUrl(code) {
	const path = `/track/${encodeURIComponent(code)}`;
	return typeof window === "undefined" ? path : `${window.location.origin}${path}`;
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
var APPLICATION_DOCS_STORAGE_PREFIX = "smart-dossier-application-docs";
function applicationDocsStorageKey(kind, type) {
	return `${APPLICATION_DOCS_STORAGE_PREFIX}:${kind}:${type}`;
}
function readSavedDocumentNames(kind, type) {
	const defaults = defaultDocs(kind, type);
	if (typeof window === "undefined") return defaults;
	try {
		const raw = window.localStorage.getItem(applicationDocsStorageKey(kind, type));
		if (!raw) return defaults;
		const saved = JSON.parse(raw);
		return {
			...defaults,
			...saved
		};
	} catch {
		return defaults;
	}
}
function saveDocumentNames(kind, type, documentNames) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(applicationDocsStorageKey(kind, type), JSON.stringify(documentNames));
}
function applicationTitle(kind) {
	if (kind === "ekb_privatization") return "Privatizim banese EKB";
	if (kind === "property_registration") return "Regjistrim prone biznesi";
	return "Shpronesim / kompensim";
}
function applicationDescription(kind, type) {
	if (kind === "ekb_privatization") return "Qytetari ngarkon dosjen per privatizimin e baneses; operatori verifikon, gjeneron faturen dhe ndjek kontraten.";
	if (kind === "property_registration") return "Biznesi regjistrohet me NIPT, ngarkon dokumentet e prones dhe dosja shqyrtohet nga operatori.";
	return type === "business" ? "Biznesi ngarkon dokumentet e prones; operatori ndjek vleresimin dhe pagesen nga Ministria e Ekonomise." : "Qytetari ngarkon dokumentet e prones; operatori ndjek vleresimin dhe pagesen nga Ministria e Ekonomise.";
}
function defaultApplicationForRole(role) {
	return role === "business" ? "property_registration" : "ekb_privatization";
}
function applicantTypeForRole(role) {
	return role === "business" ? "business" : "citizen";
}
function ApplicationPortal() {
	if (useRouterState({ select: (state) => state.location.pathname.startsWith("/aplikim/dokumentacion") })) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationPortalHome, {});
}
function ApplicationPortalHome() {
	const { role, profile } = useDemoRole();
	const createGeneric = useServerFn(createDossier);
	const createBusinessProperty = useServerFn(createBusinessPropertyApplication);
	const createExpropriation = useServerFn(createExpropriationCompensationApplication);
	const qc = useQueryClient();
	const [applicationKind, setApplicationKind] = (0, import_react.useState)(defaultApplicationForRole(role));
	const [applicantName, setApplicantName] = (0, import_react.useState)(role === "business" ? "AlbaTech sh.p.k." : "Elira Kola");
	const [nipt, setNipt] = (0, import_react.useState)("L22334455B");
	const [representativeName, setRepresentativeName] = (0, import_react.useState)(role === "business" ? "Arben Dervishi" : "");
	const [zone, setZone] = (0, import_react.useState)("Tirane");
	const [propertyDescription, setPropertyDescription] = (0, import_react.useState)("Apartament banimi objekt privatizimi EKB");
	const [cadastralNo, setCadastralNo] = (0, import_react.useState)("7/24");
	const [areaSqm, setAreaSqm] = (0, import_react.useState)("78");
	const [projectName, setProjectName] = (0, import_react.useState)("Projekt publik - zgjerimi i aksit rrugor");
	const [amountAll, setAmountAll] = (0, import_react.useState)("12500");
	const [bankAccountLabel, setBankAccountLabel] = (0, import_react.useState)("AL47212110090000000235698741");
	const [notes, setNotes] = (0, import_react.useState)("Kerkohet hapja e dosjes dhe shqyrtimi nga operatori perkates.");
	const [documentNames, setDocumentNames] = (0, import_react.useState)(readSavedDocumentNames(defaultApplicationForRole(role), applicantTypeForRole(role)));
	const [created, setCreated] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		chooseApplication(defaultApplicationForRole(role));
	}, [role]);
	const effectiveApplicantType = role === "business" || applicationKind === "property_registration" ? "business" : "citizen";
	const docs = DOCS[applicationKind][effectiveApplicantType];
	const createdUrl = created ? absoluteTrackingUrl(created.trackingCode) : "";
	const ApplicantIcon = effectiveApplicantType === "business" ? Building2 : UserRound;
	const isBusinessFlow = effectiveApplicantType === "business";
	const isEkb = applicationKind === "ekb_privatization";
	const isExpropriation = applicationKind === "expropriation";
	const isPropertyRegistration = applicationKind === "property_registration";
	const showCitizenProcesses = role !== "business";
	const showBusinessProcesses = role === "business";
	const selectedDocs = (0, import_react.useMemo)(() => docs.flatMap((doc) => {
		const name = documentNames[doc.type]?.trim();
		return name ? [{
			type: doc.type,
			name
		}] : [];
	}), [docs, documentNames]);
	(0, import_react.useEffect)(() => {
		saveDocumentNames(applicationKind, effectiveApplicantType, documentNames);
	}, [
		applicationKind,
		documentNames,
		effectiveApplicantType
	]);
	function chooseApplication(kind) {
		const nextType = role === "business" || kind === "property_registration" ? "business" : "citizen";
		setApplicationKind(kind);
		setDocumentNames(readSavedDocumentNames(kind, nextType));
		setCreated(null);
		setCopied(false);
		if (kind === "ekb_privatization") {
			setApplicantName("Elira Kola");
			setRepresentativeName("");
			setZone("Tirane");
			setPropertyDescription("Apartament banimi objekt privatizimi EKB");
			setCadastralNo("7/24");
			setAreaSqm("78");
			setAmountAll("12500");
			setNotes("Kerkohet privatizimi i baneses EKB dhe gjenerimi i fatures sipas vleresimit.");
		} else if (kind === "property_registration") {
			setApplicantName("AlbaTech sh.p.k.");
			setRepresentativeName("Arben Dervishi");
			setZone("Tirane");
			setPropertyDescription("Njesi sherbimi dhe magazine logjistike");
			setCadastralNo("7/188");
			setAreaSqm("320");
			setNotes("Kerkohet regjistrimi i pasurise ne emer te subjektit sipas dokumentacionit.");
		} else {
			setApplicantName(nextType === "business" ? "AlbaTech sh.p.k." : "Elira Kola");
			setRepresentativeName(nextType === "business" ? "Arben Dervishi" : "");
			setZone("Fier");
			setPropertyDescription("Toke bujqesore e prekur nga zgjerimi i aksit rrugor");
			setCadastralNo("11/24");
			setAreaSqm("1850");
			setAmountAll("6200000");
			setNotes("Kerkohet shqyrtimi i dosjes se kompensimit dhe kalimi i pageses.");
		}
	}
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
			const numericArea = areaSqm ? Number(areaSqm) : void 0;
			const numericAmount = amountAll ? Number(amountAll) : void 0;
			let result;
			if (applicationKind === "ekb_privatization") result = await createGeneric({ data: {
				process: "ekb_privatization",
				title: `Privatizim banese EKB - ${applicantName}`,
				applicantName,
				zone,
				propertyDescription,
				areaSqm: numericArea,
				familyIncomeAll: numericAmount,
				notes,
				documents: selectedDocs
			} });
			else if (applicationKind === "property_registration") result = await createBusinessProperty({ data: {
				businessName: applicantName,
				nipt,
				representativeName: representativeName || "Administrator",
				zone,
				propertyDescription,
				cadastralNo: cadastralNo || void 0,
				areaSqm: numericArea,
				notes,
				documents: selectedDocs
			} });
			else result = await createExpropriation({ data: {
				applicantType: effectiveApplicantType,
				applicantName,
				nipt: effectiveApplicantType === "business" ? nipt : void 0,
				representativeName: representativeName || void 0,
				zone,
				propertyDescription,
				cadastralNo: cadastralNo || void 0,
				areaSqm: numericArea,
				projectName,
				compensationAmountAll: numericAmount,
				bankAccountLabel,
				notes,
				documents: selectedDocs
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }), "Aplikim i ri"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-2xl font-semibold tracking-tight",
								children: applicationTitle(applicationKind)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-2xl text-sm text-muted-foreground",
								children: applicationDescription(applicationKind, effectiveApplicantType)
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
									children: "U gjenerua linku i gjurmimit per aplikuesin. Qytetari ose biznesi mund ta hape nga kjo faqe ose nga opsioni \"Gjurmim aplikimi\" duke vendosur kodin."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid gap-2 md:grid-cols-[160px_minmax(0,1fr)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md border bg-background px-2 py-1.5 font-mono text-xs",
										children: created.trackingCode
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-md border bg-background px-2 py-1.5 font-mono text-[11px] break-all text-muted-foreground",
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Zgjidh llojin e aplikimit"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 md:grid-cols-2",
						children: [
							showCitizenProcesses ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProcessButton, {
								active: applicationKind === "ekb_privatization",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-4" }),
								title: "Privatizim banese",
								body: "Aplikim EKB, fature dhe kontrate.",
								onClick: () => chooseApplication("ekb_privatization")
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProcessButton, {
								active: applicationKind === "expropriation",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }),
								title: "Shpronesim",
								body: "Kompensim dhe pagesa nga Ministria.",
								onClick: () => chooseApplication("expropriation")
							}),
							showBusinessProcesses ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProcessButton, {
								active: applicationKind === "property_registration",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" }),
								title: "Regjistrim prone",
								body: "Aplikim biznesi me NIPT.",
								onClick: () => chooseApplication("property_registration")
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicantIcon, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Profili i aplikuesit"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: role === "business" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "default",
							className: "w-full justify-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "mr-1.5 size-4" }), "Biznes"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "default",
							className: "w-full justify-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "mr-1.5 size-4" }), "Qytetar"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3 sm:p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Te dhenat e aplikimit"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isBusinessFlow ? "Emri i biznesit" : "Emri i qytetarit",
								value: applicantName,
								setValue: setApplicantName
							}),
							isBusinessFlow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "NIPT",
								value: nipt,
								setValue: setNipt
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Perfaqesues ligjor (opsional)",
								value: representativeName,
								setValue: setRepresentativeName
							}),
							isBusinessFlow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Administrator / perfaqesues",
								value: representativeName,
								setValue: setRepresentativeName
							}) : null,
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
							!isPropertyRegistration ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isEkb ? "Te ardhura familjare mujore ALL" : "Vlera e pritshme ALL",
								value: amountAll,
								setValue: setAmountAll,
								type: "number"
							}) : null,
							isExpropriation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Projekti publik",
									value: projectName,
									setValue: setProjectName
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: isEkb ? "Pershkrimi i baneses" : "Pershkrimi i pasurise",
									value: propertyDescription,
									setValue: setPropertyDescription
								})
							}),
							isExpropriation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Llogari bankare / IBAN",
									value: bankAccountLabel,
									setValue: setBankAccountLabel
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Shenime"
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
					className: "border-primary/25 bg-primary/5 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-sm font-semibold",
										children: "Dokumentet e aplikimit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs leading-relaxed text-muted-foreground",
										children: "Ngarkoni dokumentet që duhen për aplikimin. Ato ruhen dhe dërgohen bashkë me dosjen."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 text-[11px] font-semibold text-primary",
										children: [
											selectedDocs.length,
											"/",
											docs.length,
											" dokumente të zgjedhura"
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/aplikim/dokumentacion",
								children: ["Hap dokumentet", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap justify-end gap-2 border-t pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setCreated(null),
							children: "Pastro njoftimin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							onClick: submitApplication,
							disabled: submitting,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1.5 size-4" }), submitting ? "Duke derguar..." : "Dergo aplikimin"]
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-primary",
					children: "Cfare ndodh pas dergimit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 space-y-3 text-sm",
					children: isEkb ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "1",
							title: "Aplikimi qytetarit",
							body: "Operatori kontrollon dosjen EKB dhe dokumentet baze."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "2",
							title: "Verifikim ligjor",
							body: "Kryhen verifikime me EKB, ASHK dhe institucionet perkatese."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "3",
							title: "Fatura",
							body: "Gjenerohet fatura/mandati dhe ruhet ne dosje."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "4",
							title: "Kontrata dhe ASHK",
							body: "Pas pageses kalon kontrata dhe certifikata perfundimtare."
						})
					] }) : isPropertyRegistration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "1",
							title: "NIPT",
							body: "Subjekti dhe administratori verifikohen."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "2",
							title: "Dokumente prone",
							body: "Kontrollohen aktet e origjines dhe plani i pasurise."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "3",
							title: "Kontroll AI GIS",
							body: "Operatori verifikon kufijte, siperfaqen dhe sinjalin AI GIS."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "4",
							title: "Vendim",
							body: "Miratim, plotesim dokumentesh ose refuzim i arsyetuar."
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "1",
							title: "Verifikim pronesie",
							body: "Operatori kontrollon pronesine, NIPT/ID dhe dokumentet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "2",
							title: "Vleresim kompensimi",
							body: "Vlera lidhet me raportin e vleresimit dhe aktin e shpronesimit."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "3",
							title: "Afat ankimi",
							body: "Pronari mund te ndjeke afatin dhe te beje ankese nga portali."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Step, {
							number: "4",
							title: "Pagesa",
							body: "Ministria e Ekonomise kryen disbursimin; operatori monitoron statusin."
						})
					] })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-warning/30 bg-warning/5 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mt-0.5 size-4 shrink-0 text-warning-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Smart Dossier"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: "Aplikimi krijohet si dosje, i caktohet operatorit dhe ndiqet me kod gjurmimi publik."
					})] })]
				})
			})]
		})]
	}) });
}
function ProcessButton({ active, icon, title, body, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("rounded-md border p-3 text-left transition-colors", active ? "border-primary bg-primary/10 text-foreground" : "bg-background hover:bg-muted/40"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm font-semibold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("text-primary", active && "text-primary"),
				children: icon
			}), title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs leading-relaxed text-muted-foreground",
			children: body
		})]
	});
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
export { ApplicationPortal as component };
