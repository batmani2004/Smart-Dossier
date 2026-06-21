import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn, i as Input, n as Card, o as useDemoRole, r as DEMO_ROLES, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { F as Mail, L as LockKeyhole, Nt as ArrowRight, Ot as Building2, P as MapPin, at as EyeOff, c as UserCog, it as Eye, k as Phone, o as UserRound } from "../_libs/lucide-react.mjs";
import { t as Checkbox } from "./checkbox-CjIFYTlP.mjs";
import { n as InputOTPGroup, r as InputOTPSlot, t as InputOTP } from "./input-otp-C1G6NuXb.mjs";
import { t as Label } from "./label-CgYZPzcy.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CqbhDoAh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LOGIN_ROLES = [
	{
		role: "citizen",
		title: "Qytetar",
		hint: "Aplikim dhe gjurmim dosjeje",
		idLabel: "Numri personal (NID)",
		idPlaceholder: "H90803041W",
		icon: UserRound,
		demoId: "H90803041W",
		destination: "Hapet faqja e aplikimit per qytetar",
		actionLabel: "Hyr si qytetar"
	},
	{
		role: "business",
		title: "Biznes",
		hint: "Regjistrim prone me NIPT",
		idLabel: "NIPT i subjektit",
		idPlaceholder: "L22334455B",
		icon: Building2,
		demoId: "L22334455B",
		destination: "Hapet portali i biznesit",
		actionLabel: "Hyr si biznes"
	},
	{
		role: "operator",
		title: "Operator",
		hint: "Dosje, AI dhe raporte pune",
		idLabel: "ID e operatorit",
		idPlaceholder: "OP-1024",
		icon: UserCog,
		demoId: "OP-1024",
		destination: "Hapet lista e dosjeve",
		actionLabel: "Hyr si operator"
	}
];
var REGISTER_ROLES = LOGIN_ROLES.filter((item) => item.role === "citizen" || item.role === "business");
var DEMO_OTP = "246810";
function LoginPage() {
	const navigate = useNavigate();
	const { setRole } = useDemoRole();
	const [selectedRole, setSelectedRole] = (0, import_react.useState)("citizen");
	const [authMode, setAuthMode] = (0, import_react.useState)("login");
	const [loginStep, setLoginStep] = (0, import_react.useState)("credentials");
	const [fullName, setFullName] = (0, import_react.useState)("Elira Kola");
	const [representativeName, setRepresentativeName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("elira.kola@email.al");
	const [phone, setPhone] = (0, import_react.useState)("+355 69 123 4567");
	const [address, setAddress] = (0, import_react.useState)("Tirane");
	const [identifier, setIdentifier] = (0, import_react.useState)(LOGIN_ROLES[0].demoId);
	const [password, setPassword] = (0, import_react.useState)("demo2026");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [acceptTerms, setAcceptTerms] = (0, import_react.useState)(true);
	const selected = (0, import_react.useMemo)(() => LOGIN_ROLES.find((item) => item.role === selectedRole) ?? LOGIN_ROLES[0], [selectedRole]);
	const visibleRoles = authMode === "register" ? REGISTER_ROLES : LOGIN_ROLES;
	const SelectedIcon = selected.icon;
	const isBusinessRegistration = authMode === "register" && selectedRole === "business";
	const isOtpStep = authMode === "login" && loginStep === "otp";
	function applyDefaults(role) {
		const next = LOGIN_ROLES.find((item) => item.role === role) ?? LOGIN_ROLES[0];
		setSelectedRole(next.role);
		setFullName(DEMO_ROLES[next.role].displayName);
		setRepresentativeName(next.role === "business" ? "Arben Dervishi" : "");
		setEmail(next.role === "business" ? "info@albatech.al" : "elira.kola@email.al");
		setPhone(next.role === "business" ? "+355 69 555 0101" : "+355 69 123 4567");
		setAddress(next.role === "business" ? "Rruga e Durresit, Tirane" : "Tirane");
		setIdentifier(next.demoId);
		setPassword("demo2026");
		setOtp("");
		setLoginStep("credentials");
	}
	function chooseRole(role) {
		if (authMode === "register" && role === "operator") return;
		applyDefaults(role);
	}
	function startRegister() {
		setAuthMode("register");
		setLoginStep("credentials");
		applyDefaults(selectedRole === "business" ? "business" : "citizen");
		setAcceptTerms(true);
	}
	function startLogin() {
		setAuthMode("login");
		setLoginStep("credentials");
		applyDefaults(selectedRole);
	}
	function validateLoginCredentials() {
		if (!identifier.trim() || !password.trim()) {
			toast.error("Plotesoni ID/NIPT dhe fjalekalimin.");
			return false;
		}
		if (password.trim().length < 6) {
			toast.error("Fjalekalimi duhet te kete te pakten 6 karaktere.");
			return false;
		}
		return true;
	}
	function validateLoginOtp() {
		if (otp.trim().length !== 6) {
			toast.error("Plotesoni kodin OTP me 6 shifra.");
			return false;
		}
		if (otp.trim() !== DEMO_OTP) {
			toast.error(`Kodi OTP nuk eshte i sakte. Per demo perdorni ${DEMO_OTP}.`);
			return false;
		}
		return true;
	}
	function validateRegistration() {
		if (selectedRole === "operator") {
			toast.error("Regjistrimi eshte vetem per qytetare dhe biznese.");
			return false;
		}
		if (!fullName.trim()) {
			toast.error(isBusinessRegistration ? "Plotesoni emrin ligjor te biznesit." : "Plotesoni emrin e plote.");
			return false;
		}
		if (!identifier.trim()) {
			toast.error(isBusinessRegistration ? "Plotesoni NIPT-in." : "Plotesoni NID-in.");
			return false;
		}
		if (isBusinessRegistration && !representativeName.trim()) {
			toast.error("Plotesoni emrin e perfaqesuesit ligjor.");
			return false;
		}
		if (!email.trim() || !email.includes("@")) {
			toast.error("Plotesoni nje email te vlefshem.");
			return false;
		}
		if (!phone.trim() || !address.trim()) {
			toast.error("Plotesoni telefonin dhe adresen.");
			return false;
		}
		if (!password.trim() || password.trim().length < 6) {
			toast.error("Fjalekalimi duhet te kete te pakten 6 karaktere.");
			return false;
		}
		if (!acceptTerms) {
			toast.error("Konfirmoni te dhenat per te krijuar profilin.");
			return false;
		}
		return true;
	}
	async function submitAccess() {
		if (authMode === "register") {
			if (!validateRegistration()) return;
		} else if (loginStep === "credentials") {
			if (!validateLoginCredentials()) return;
			setOtp("");
			setLoginStep("otp");
			toast.success(`Kodi OTP demo u dergua: ${DEMO_OTP}`);
			return;
		} else {
			if (!validateLoginOtp()) return;
			setLoginStep("done");
		}
		setRole(selectedRole);
		toast.success(authMode === "register" ? `Profili u krijua si ${DEMO_ROLES[selectedRole].label}.` : `Hyrja u krye si ${DEMO_ROLES[selectedRole].label}.`);
		await navigate({ to: DEMO_ROLES[selectedRole].defaultRoute });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/brand/smart-dossier-logo.svg",
						alt: "Smart Dossier",
						className: "h-10 w-auto max-w-[170px] shrink-0 object-contain sm:h-14 sm:max-w-[270px]"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-1.5 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/brand/albanian-flag.svg",
							alt: "Gjuha shqip",
							title: "Gjuha shqip",
							className: "hidden h-[18px] w-[26px] shrink-0 object-cover sm:block"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							className: "h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-primary sm:h-9 sm:px-3 sm:text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin-login",
								children: "Hyrje admin"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: authMode === "register" ? "default" : "outline",
							className: "h-8 px-2.5 text-xs font-semibold sm:h-9 sm:px-3 sm:text-sm",
							onClick: startRegister,
							children: "Regjistrohu"
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid min-h-[calc(100vh-4.25rem)] max-w-6xl gap-4 px-3 py-4 sm:px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-md border bg-white p-5 shadow-soft md:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-[360px] flex-col items-center justify-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/brand/smart-dossier-logo-mark-blue.svg",
							alt: "Smart Dossier",
							className: "h-24 w-24 object-contain sm:h-28 sm:w-28"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary",
							children: "Smart Dossier"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl",
							children: "Menaxhim inteligjent i dosjeve të pronës."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-xl text-base leading-7 text-muted-foreground",
							children: "Në ndihmë të ASHSH, ASHK, AKPT dhe Ministrisë së Ekonomisë dhe Inovacionit."
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border bg-white p-4 shadow-lift md:p-5",
				children: [
					!isOtpStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 rounded-md bg-muted p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: startLogin,
							className: cn("h-10 rounded-md text-sm font-semibold transition-colors", authMode === "login" ? "bg-white text-primary shadow-soft" : "text-muted-foreground"),
							children: "Hyr"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: startRegister,
							className: cn("h-10 rounded-md text-sm font-semibold transition-colors", authMode === "register" ? "bg-white text-primary shadow-soft" : "text-muted-foreground"),
							children: "Regjistrohu"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 border-b pb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wide text-primary",
								children: authMode === "register" ? "Krijo profil" : isOtpStep ? "Verifikim i dyte" : "Hyr ne portal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1.5 text-xl font-semibold tracking-tight",
								children: authMode === "register" ? isBusinessRegistration ? "Regjistrim biznesi" : "Regjistrim qytetari" : isOtpStep ? "Verifikimi me OTP" : "Identifikimi elektronik"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm leading-5 text-muted-foreground",
								children: authMode === "register" ? "Regjistrimi eshte i hapur vetem per qytetare dhe biznese." : isOtpStep ? `Vendosni kodin demo per te perfunduar hyrjen si ${DEMO_ROLES[selectedRole].label}.` : `${selected.destination}. Te dhenat demo jane te plotesuara.`
							})
						]
					}),
					!isOtpStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-sm font-semibold text-muted-foreground",
							children: authMode === "register" ? "Zgjidh llojin e profilit" : "Zgjidh si do te hysh"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("grid grid-cols-1 gap-2", authMode === "register" ? "sm:grid-cols-2" : "sm:grid-cols-3"),
							children: visibleRoles.map((item) => {
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => chooseRole(item.role),
									className: cn("flex min-h-20 flex-col items-start justify-between rounded-md border p-3 text-left transition-colors", item.role === selectedRole ? "border-primary bg-[var(--brand-blue-soft)] text-primary" : "border-border bg-white text-foreground hover:border-primary/50"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm font-semibold",
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-muted-foreground",
										children: item.hint
									})] })]
								}, item.role);
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-4",
						children: isOtpStep ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border bg-muted px-4 py-3 text-sm text-muted-foreground",
									children: [
										"Kodi OTP demo per ",
										selected.title,
										" eshte",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: DEMO_OTP
										}),
										"."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTP, {
									maxLength: 6,
									value: otp,
									onChange: setOtp,
									containerClassName: "justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPGroup, { children: Array.from({ length: 6 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputOTPSlot, {
										index,
										className: "h-12 w-12 bg-white text-lg"
									}, index)) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										onClick: submitAccess,
										className: "h-12 w-full text-base font-semibold",
										children: "Konfirmo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										className: "h-11 w-full",
										onClick: () => {
											setOtp("");
											setLoginStep("credentials");
										},
										children: "Kthehu te identifikimi"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							authMode === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-sm font-semibold text-foreground",
									children: [
										isBusinessRegistration ? "Emri ligjor i biznesit" : "Emri i plote",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "*"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldShell, {
									icon: isBusinessRegistration ? Building2 : UserRound,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fullName,
										onChange: (event) => setFullName(event.target.value),
										placeholder: isBusinessRegistration ? "AlbaTech sh.p.k." : "Elira Kola",
										className: "h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
									})
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-sm font-semibold text-foreground",
									children: [
										selected.idLabel,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary",
											children: "*"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldShell, {
									icon: SelectedIcon,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: identifier,
										onChange: (event) => {
											setIdentifier(event.target.value);
											if (loginStep === "otp") setLoginStep("credentials");
										},
										placeholder: selected.idPlaceholder,
										className: "h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
									})
								})]
							}),
							isBusinessRegistration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-sm font-semibold text-foreground",
									children: ["Perfaqesuesi ligjor ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldShell, {
									icon: UserRound,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: representativeName,
										onChange: (event) => setRepresentativeName(event.target.value),
										placeholder: "Arben Dervishi",
										className: "h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
									})
								})]
							}) : null,
							authMode === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "text-sm font-semibold text-foreground",
											children: ["Email ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldShell, {
											icon: Mail,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: email,
												onChange: (event) => setEmail(event.target.value),
												type: "email",
												placeholder: isBusinessRegistration ? "info@biznes.al" : "emri@email.al",
												className: "h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "text-sm font-semibold text-foreground",
											children: ["Telefon ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldShell, {
											icon: Phone,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: phone,
												onChange: (event) => setPhone(event.target.value),
												placeholder: "+355 69 000 0000",
												className: "h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "text-sm font-semibold text-foreground",
											children: ["Adresa ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-primary",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldShell, {
											icon: MapPin,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: address,
												onChange: (event) => setAddress(event.target.value),
												placeholder: "Qyteti, rruga ose njesia administrative",
												className: "h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
											})
										})]
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-sm font-semibold text-foreground",
									children: ["Fjalekalimi ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-md border bg-card px-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "size-5 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: password,
											onChange: (event) => {
												setPassword(event.target.value);
												if (loginStep === "otp") setLoginStep("credentials");
											},
											type: showPassword ? "text" : "password",
											className: "h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowPassword((current) => !current),
											className: "grid size-9 place-items-center text-muted-foreground",
											"aria-label": showPassword ? "Fshih fjalekalimin" : "Shfaq fjalekalimin",
											children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
										})
									]
								})]
							}),
							authMode === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start gap-2 text-sm leading-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: acceptTerms,
									onCheckedChange: (value) => setAcceptTerms(Boolean(value)),
									className: "mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Konfirmoj qe te dhenat jane te sakta dhe dua te krijoj profilin." })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: remember,
									onCheckedChange: (value) => setRemember(Boolean(value))
								}), "Me mbaj mend"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									onClick: submitAccess,
									className: "h-11 w-full text-base font-semibold",
									children: [authMode === "register" ? isBusinessRegistration ? "Krijo profil biznesi" : "Krijo profil qytetari" : selected.actionLabel, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 size-4" })]
								}), authMode === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									className: "h-10 w-full text-primary",
									onClick: startLogin,
									children: "Kam llogari, dua te hyj"
								}) : selectedRole === "operator" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-md border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground",
									children: "Operatoret krijohen dhe menaxhohen nga administratori. Per hyrje admin perdorni linkun lart."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									className: "h-11 w-full border-primary text-base font-semibold text-primary hover:bg-primary/10",
									onClick: startRegister,
									children: "Nuk kam llogari, regjistrohu"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-muted p-2.5 text-xs leading-5 text-muted-foreground",
								children: [
									"Per demo: fjalekalimi eshte `demo2026`; pas tij vendoset OTP `",
									DEMO_OTP,
									"` per te hapur faqen e rolit te zgjedhur."
								]
							})
						] })
					})
				]
			})]
		})]
	});
}
function FieldShell({ icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-md border bg-card px-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 shrink-0 text-primary" }), children]
	});
}
//#endregion
export { LoginPage as component };
