//#region node_modules/.nitro/vite/services/ssr/assets/processes-CMdovryr.js
var NO_E_ALBANIA = {
	id: "no-e-albania",
	label: "Pa e-Albania",
	description: "Procedura nuk është e integruar me e-Albania.",
	severity: "critical",
	tags: ["no-e-albania", "paper-only"]
};
var ekbPrivatizationProcess = {
	kind: "ekb_privatization",
	code: "EKB",
	title: "Privatizimi i banesave EKB",
	description: "Procedura e privatizimit të banesave të Entit Kombëtar të Banesave për qytetarët përfitues.",
	legalBasis: [{
		reference: "VKM 179/2020",
		title: "Për procedurat e privatizimit të banesave EKB"
	}, {
		reference: "VKM 898/2020",
		title: "Plotësues mbi vlerësimin e banesave dhe truallit"
	}],
	phases: [
		{
			id: "ekb-p1",
			order: 1,
			title: "Parakushti — certifikata e pronësisë",
			description: "ASHK lëshon certifikatën e pronësisë dhe pasuria regjistrohet në emër të EKB-së.",
			institutions: ["ASHK", "EKB"],
			steps: [{
				id: "ekb-s1",
				order: 1,
				title: "Lëshimi i certifikatës ASHK",
				description: "ASHK lëshon certifikatën e pronësisë; pasuria figuron e regjistruar nën EKB.",
				institution: "ASHK",
				requiredDocuments: ["ashk_certificate"],
				slaDays: 21,
				manual: true
			}]
		},
		{
			id: "ekb-p2",
			order: 2,
			title: "Njoftimi publik",
			description: "Afishim fizik në EKB dhe publikim në ekb.gov.al.",
			institutions: ["EKB"],
			steps: [{
				id: "ekb-s2",
				order: 1,
				title: "Afishimi fizik dhe online",
				description: "Njoftim fizik në zyrat e EKB-së + publikim në ekb.gov.al. Pa e-Albania.",
				institution: "EKB",
				slaDays: 15,
				manual: true,
				criticalPoints: [{
					id: "limited-reach",
					label: "Mbulim i kufizuar",
					description: "Njoftimi nuk arrin të gjithë qytetarët e interesuar; pa kanal e-Albania.",
					severity: "warning",
					tags: ["reach", "no-e-albania"]
				}, NO_E_ALBANIA]
			}]
		},
		{
			id: "ekb-p3",
			order: 3,
			title: "Aplikimi i qytetarit",
			description: "Aplikimi fizik pranë EKB-së me dosje letër (12–18 dokumente, përfshirë certifikatën familjare).",
			institutions: ["EKB", "Bashkia"],
			steps: [{
				id: "ekb-s3",
				order: 1,
				title: "Dorëzimi i dosjes fizike",
				description: "Qytetari dorëzon dosjen letër me 12–18 dokumente; zero digjital, pa e-Albania.",
				institution: "EKB",
				requiredDocuments: [
					"family_certificate",
					"id_card_copy",
					"income_proof",
					"rent_contract_history",
					"ashk_certificate_copy",
					"marriage_certificate"
				],
				slaDays: 30,
				manual: true,
				criticalPoints: [{
					id: "aplikim-fizik",
					label: "Aplikim fizik",
					description: "Aplikim fizik: 12–18 dokumente letre, rrezik mungesash.",
					severity: "critical",
					tags: [
						"paper-only",
						"no-e-albania",
						"missing-docs"
					]
				}, NO_E_ALBANIA]
			}]
		},
		{
			id: "ekb-p4",
			order: 4,
			title: "Verifikimi ligjor",
			description: "Verifikim manual nga EKB; kërkesa drejt ASHK/IPRO me email ose fizikisht. Mund të refuzohet me arsye nga dega.",
			institutions: [
				"EKB",
				"ASHK",
				"IPRO"
			],
			steps: [{
				id: "ekb-s4",
				order: 1,
				title: "Verifikim manual dhe shkëmbim me ASHK/IPRO",
				description: "Verifikimi është manual; komunikimi me ASHK/IPRO bëhet me email ose fizikisht. Pa API.",
				institution: "EKB",
				slaDays: 21,
				manual: true,
				criticalPoints: [{
					id: "no-api-ashk",
					label: "Pa API me ASHK",
					description: "Pa API me ASHK: verifikimi manual mund të shtojë 2–4 javë.",
					severity: "critical",
					tags: ["no-api", "delay-2-4w"],
					expectedDelayDays: 21
				}, {
					id: "branch-refusal",
					label: "Refuzim nga dega",
					description: "Dega mund të refuzojë me arsye; qytetari duhet të rifillojë rrugën fizike.",
					severity: "warning",
					tags: ["refusal", "paper-only"]
				}]
			}]
		},
		{
			id: "ekb-p5",
			order: 5,
			title: "Llogaritja e vlerës",
			description: "Llogaritja e vlerës sipas normave të banimit + çmimit të truallit. Excel / manual, pa gjurmë audituese.",
			institutions: ["EKB"],
			steps: [{
				id: "ekb-s5",
				order: 1,
				title: "Vlerësimi i banesës dhe truallit",
				description: "Aplikimi i normave të banimit dhe çmimit të truallit. Rregulli i të ardhurave: >14000 ALL = 100%, 9000–14000 = 50%, <9000 = pa pagesë / 0% trualli.",
				institution: "EKB",
				slaDays: 10,
				manual: true,
				criticalPoints: [{
					id: "no-audit-trail",
					label: "Llogaritje Excel/manual",
					description: "Llogaritje Excel/manual: rrezik gabimesh dhe zero audit trail.",
					severity: "critical",
					tags: ["excel", "no-audit"]
				}]
			}]
		},
		{
			id: "ekb-p5-invoice",
			order: 6,
			title: "Gjenerimi i faturës së qytetarit",
			description: "Pas llogaritjes së vlerës, sistemi gjeneron faturën/mandatin e pagesës për qytetarin dhe e regjistron në dosje.",
			institutions: ["EKB", "Financa"],
			steps: [{
				id: "ekb-s5-invoice",
				order: 1,
				title: "Gjenerimi i faturës për pagesë",
				description: "Nga vlera e miratuar krijohet fatura e qytetarit me afat pagese, numër reference dhe shumën për t'u arkëtuar.",
				institution: "Financa EKB",
				requiredDocuments: ["citizen_invoice"],
				slaDays: 3,
				manual: false,
				criticalPoints: [{
					id: "invoice-before-contract",
					label: "Faturë para kontratës",
					description: "Kontrata nuk duhet të kalojë për firmosje pa faturë/mandat pagese të gjeneruar dhe të audituar.",
					severity: "warning",
					tags: ["billing", "audit-trail"]
				}]
			}]
		},
		{
			id: "ekb-p6",
			order: 7,
			title: "Lidhja e kontratës",
			description: "Kontrata EKB–qytetar duhet të lidhet brenda 2 vjetëve nga njoftimi. Word/print, firmosje fizike.",
			institutions: ["EKB"],
			steps: [{
				id: "ekb-s6",
				order: 1,
				title: "Hartimi dhe firmosja e kontratës",
				description: "Kontrata përgatitet në Word, printohet dhe firmoset fizikisht në praninë e palëve.",
				institution: "EKB",
				slaDays: 730,
				manual: true,
				criticalPoints: [{
					id: "physical-presence",
					label: "Firmosje fizike e detyrueshme",
					description: "Kërkohet prania fizike e palëve për nënshkrim.",
					severity: "warning",
					tags: ["paper-only", "physical-presence"]
				}]
			}]
		},
		{
			id: "ekb-p7",
			order: 8,
			title: "Dërgimi i dosjes në ASHK",
			description: "Dorëzim fizik i dosjes në ASHK. Rrezik humbjeje, 4–8 javë vonesë.",
			institutions: ["EKB", "ASHK"],
			steps: [{
				id: "ekb-s7",
				order: 1,
				title: "Dorëzimi fizik i dosjes",
				description: "Dosja transportohet fizikisht nga EKB në ASHK. Pa API.",
				institution: "EKB",
				slaDays: 14,
				manual: true,
				criticalPoints: [{
					id: "loss-risk",
					label: "Dorëzim fizik në ASHK",
					description: "Dorëzim fizik në ASHK: rrezik humbjeje, 4–8 javë vonesë.",
					severity: "critical",
					tags: [
						"paper-only",
						"loss-risk",
						"delay-4-8w"
					],
					expectedDelayDays: 42
				}, {
					id: "no-api-handoff",
					label: "Pa API në dorëzim",
					description: "Pa API në dorëzimin EKB→ASHK; vonesa tipike 4–8 javë.",
					severity: "critical",
					tags: ["no-api", "delay-4-8w"],
					expectedDelayDays: 42
				}]
			}]
		},
		{
			id: "ekb-p8",
			order: 9,
			title: "Regjistrimi përfundimtar në ASHK",
			description: "ASHK lëshon certifikatën përfundimtare. Radhë institucionale, 4–8 javë.",
			institutions: ["ASHK"],
			steps: [{
				id: "ekb-s8",
				order: 1,
				title: "Lëshimi i certifikatës përfundimtare",
				description: "Pas regjistrimit, qytetari merr certifikatën përfundimtare.",
				institution: "ASHK",
				slaDays: 42,
				manual: true,
				criticalPoints: [{
					id: "ashk-queue",
					label: "Radhë në ASHK",
					description: "4–8 javë vonesë për shkak të radhës institucionale.",
					severity: "critical",
					tags: ["queue", "delay-4-8w"],
					expectedDelayDays: 42
				}]
			}]
		}
	]
};
var expropriationProcess = {
	kind: "expropriation",
	code: "EXP",
	title: "Shpronësimi për interes publik",
	description: "Procedura e shpronësimit me 6 faza, nga nisma me VKM deri te regjistrimi përfundimtar në ASHK.",
	legalBasis: [{
		reference: "Law 8561/1999",
		title: "Për shpronësimet për interes publik"
	}, { reference: "Aktet nënligjore përkatëse" }],
	phases: [
		{
			id: "exp-p1",
			order: 1,
			title: "Iniciimi",
			description: "Nismë nga ministria/bashkia dhe miratim me VKM.",
			institutions: [
				"Ministria",
				"Bashkia",
				"Këshilli i Ministrave"
			],
			steps: [{
				id: "exp-s1",
				order: 1,
				title: "Propozim dhe VKM",
				description: "Hartimi i propozimit dhe miratimi me Vendim të Këshillit të Ministrave.",
				institution: "Ministria",
				requiredDocuments: ["vkm_decision", "public_interest_justification"],
				slaDays: 60,
				manual: true
			}]
		},
		{
			id: "exp-p2",
			order: 2,
			title: "Identifikimi i pronës dhe pronarëve",
			description: "Identifikimi nëpërmjet ASHK dhe DPGJC. Mungon integrimi automatik.",
			institutions: ["ASHK", "DPGJC"],
			steps: [{
				id: "exp-s2",
				order: 1,
				title: "Kërkesat te ASHK dhe DPGJC",
				description: "Kërkesat dërgohen veçmas; pa integrim automatik me regjistrat.",
				institution: "ASHK",
				requiredDocuments: ["ownership_extract", "civil_status_extract"],
				slaDays: 30,
				manual: true,
				criticalPoints: [{
					id: "no-integration-ashk-dpgjc",
					label: "Pa integrim ASHK–DPGJC",
					description: "DPGJC dhe ASHK nuk janë të integruara automatikisht.",
					severity: "critical",
					tags: ["no-api", "manual-merge"],
					expectedDelayDays: 21
				}]
			}]
		},
		{
			id: "exp-p3",
			order: 3,
			title: "Vleresimi me AI GIS",
			description: "Vleresimi nga ASHSh / komisioni i rivleresimit; konsultim AI me AKPT / e-Harta (vetem lexim).",
			institutions: ["ASHSh", "AKPT"],
			steps: [{
				id: "exp-s3",
				order: 1,
				title: "Vleresim nga ASHSh me sinjal AI GIS",
				description: "ASHSh ose komisioni i rivleresimit nxjerr vleren e kompensimit duke perdorur sinjalin GIS si evidence pune.",
				institution: "ASHSh",
				requiredDocuments: ["valuation_report"],
				slaDays: 30,
				manual: true,
				criticalPoints: [{
					id: "eharta-read-only",
					label: "AKPT / e-Harta vetëm lexim",
					description: "Nuk mund të shkruhen të dhëna automatikisht.",
					severity: "warning",
					tags: ["read-only", "no-api"]
				}]
			}]
		},
		{
			id: "exp-p4",
			order: 4,
			title: "Njoftimi dhe ankimi",
			description: "Njoftim me letër; afat ankimi 30 ditë.",
			institutions: ["Ministria", "Bashkia"],
			steps: [{
				id: "exp-s4",
				order: 1,
				title: "Njoftimi i pronarëve",
				description: "Njoftimet dërgohen vetëm me letër (paper-only).",
				institution: "Ministria",
				requiredDocuments: ["notification_letter"],
				slaDays: 15,
				manual: true,
				criticalPoints: [{
					id: "paper-only-notice",
					label: "Njoftim vetëm me letër",
					description: "Njoftim vetëm me letër; afat ankimi 30 ditë.",
					severity: "critical",
					tags: [
						"paper-only",
						"no-e-albania",
						"appeal-30d"
					]
				}]
			}, {
				id: "exp-s4b",
				order: 2,
				title: "Periudha e ankimit (30 ditë)",
				description: "Pronari ka 30 ditë afat ligjor për të bërë ankim.",
				institution: "Gjykata",
				slaDays: 30
			}]
		},
		{
			id: "exp-p5",
			order: 5,
			title: "Disbursimi",
			description: "Pagesa nga Ministria e Ekonomisë; tërheqja nga qytetari nëpërmjet ASHK / e-Albania shërbimi 9482. Pa integrim ASHK–Ministri.",
			institutions: ["Ministria e Ekonomisë", "ASHK"],
			steps: [{
				id: "exp-s5",
				order: 1,
				title: "Urdhri i pagesës dhe tërheqja",
				description: "Ministria e Ekonomisë urdhëron pagesën; qytetari aplikon te ASHK / e-Albania (9482).",
				institution: "Ministria e Ekonomisë",
				requiredDocuments: ["payment_order"],
				slaDays: 45,
				manual: true,
				criticalPoints: [{
					id: "no-ashk-ministry-integration",
					label: "Pa integrim ASHK–Ministria e Ekonomisë",
					description: "Pa integrim ASHK–Ministria e Ekonomisë për disbursim/regjistrim.",
					severity: "critical",
					tags: ["no-api", "disbursement"],
					expectedDelayDays: 14
				}]
			}]
		},
		{
			id: "exp-p6",
			order: 6,
			title: "Dorëzimi fizik dhe regjistrimi përfundimtar",
			description: "Dorëzim fizik i pronës dhe regjistrim përfundimtar në ASHK.",
			institutions: ["ASHK"],
			steps: [{
				id: "exp-s6",
				order: 1,
				title: "Procesverbali i dorëzimit dhe regjistrimi",
				description: "Mbahet procesverbali i dorëzimit fizik dhe ASHK regjistron kalimin përfundimtar.",
				institution: "ASHK",
				requiredDocuments: ["handover_minutes"],
				slaDays: 30,
				manual: true
			}]
		}
	]
};
var BUSINESS_DOCUMENT_RISK = {
	id: "business-documents",
	label: "Dokumentacion biznesi",
	description: "Operatori duhet te verifikoje NIPT-in, tagrin e perfaqesimit dhe dokumentet e origjines se prones.",
	severity: "warning",
	tags: [
		"business",
		"nipt",
		"documents"
	]
};
var PROCESSES = {
	ekb_privatization: ekbPrivatizationProcess,
	expropriation: expropriationProcess,
	property_registration: {
		kind: "property_registration",
		code: "BIZ",
		title: "Regjistrim prone per biznes",
		description: "Aplikim nga subjekt biznesi i identifikuar me NIPT per regjistrimin ose perditesimin e nje prone ne kadaster.",
		legalBasis: [
			{
				reference: "Ligj 111/2018",
				title: "Per kadastren"
			},
			{
				reference: "Ligj 9723/2007",
				title: "Per Qendren Kombetare te Biznesit"
			},
			{
				reference: "VKM per sherbimet kadastrale",
				title: "Tarifa dhe dokumentacioni shoqerues"
			}
		],
		phases: [
			{
				id: "biz-p1",
				order: 1,
				title: "Aplikimi i biznesit",
				description: "Subjekti regjistrohet me NIPT, identifikon perfaqesuesin dhe ngarkon dokumentacionin baze.",
				institutions: [
					"Portali Smart Dossier",
					"QKB",
					"ASHK"
				],
				steps: [{
					id: "biz-s1",
					order: 1,
					title: "Regjistrimi elektronik i kerkeses",
					description: "Verifikohet NIPT-i, subjekti, perfaqesuesi ligjor dhe pranohen dokumentet e para.",
					institution: "Portali Smart Dossier",
					requiredDocuments: [
						"business_nipt_extract",
						"legal_representative_id",
						"property_registration_request",
						"ownership_origin_document",
						"property_plan"
					],
					slaDays: 2,
					criticalPoints: [BUSINESS_DOCUMENT_RISK]
				}]
			},
			{
				id: "biz-p2",
				order: 2,
				title: "Shqyrtimi nga operatori",
				description: "Operatori i kadastres kontrollon saktesine e dokumenteve dhe kerkon plotesime nese mungon dicka.",
				institutions: ["ASHK"],
				steps: [{
					id: "biz-s2",
					order: 1,
					title: "Verifikimi i dokumentacionit",
					description: "Kontrollohen aktet e pronesise, plani i rilevimit, autorizimi dhe perputhja me subjektin NIPT.",
					institution: "Operator kadastre",
					requiredDocuments: [
						"ownership_origin_document",
						"property_plan",
						"legal_representative_id"
					],
					slaDays: 7,
					criticalPoints: [BUSINESS_DOCUMENT_RISK]
				}]
			},
			{
				id: "biz-p3",
				order: 3,
				title: "Kontroll kadastral dhe AI GIS",
				description: "Kryhet kontrolli i parceles, mbivendosjeve, kufijve dhe te dhenave ne harte me sinjalizim AI.",
				institutions: ["ASHK", "ASIG"],
				steps: [{
					id: "biz-s3",
					order: 1,
					title: "Kontroll AI i prones dhe zones kadastrale",
					description: "Operatori verifikon koordinatat, planin dhe perputhjen me regjistrin kadastral duke perdorur sinjalin AI GIS.",
					institution: "ASHK",
					requiredDocuments: ["property_plan", "cadastral_map_extract"],
					slaDays: 10,
					criticalPoints: [{
						id: "gis-overlap-risk",
						label: "Rrezik mbivendosjeje",
						description: "Duhet kontrolluar nese parcela ka mbivendosje ose mospërputhje me hartat ekzistuese.",
						severity: "warning",
						tags: [
							"gis",
							"overlap",
							"ashk"
						]
					}]
				}]
			},
			{
				id: "biz-p4",
				order: 4,
				title: "Vendimi dhe regjistrimi",
				description: "Pas miratimit, operatori finalizon regjistrimin dhe gjeneron dokumentin e vulosur elektronikisht.",
				institutions: ["ASHK"],
				steps: [{
					id: "biz-s4",
					order: 1,
					title: "Miratim ose refuzim i arsyetuar",
					description: "Merret vendimi administrativ dhe njoftohet biznesi me dokumentin perfundimtar.",
					institution: "ASHK",
					requiredDocuments: ["operator_review_report"],
					slaDays: 5
				}]
			}
		]
	}
};
//#endregion
export { PROCESSES as t };
