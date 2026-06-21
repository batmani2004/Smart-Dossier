import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as Input, n as Card, o as useDemoRole, r as DEMO_ROLES, t as Button } from "./demo-access-SJl8-tLA.mjs";
import { L as LockKeyhole, Pt as ArrowLeft, _ as ShieldCheck, at as EyeOff, c as UserCog, it as Eye, vt as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Checkbox } from "./checkbox-CjIFYTlP.mjs";
import { n as InputOTPGroup, r as InputOTPSlot, t as InputOTP } from "./input-otp-C1G6NuXb.mjs";
import { t as Label } from "./label-CgYZPzcy.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-login-ctHyYDBS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEMO_OTP = "246810";
function AdminLoginPage() {
	const navigate = useNavigate();
	const { setRole } = useDemoRole();
	const [identifier, setIdentifier] = (0, import_react.useState)("ADM-001");
	const [password, setPassword] = (0, import_react.useState)("demo2026");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [step, setStep] = (0, import_react.useState)("credentials");
	const [otp, setOtp] = (0, import_react.useState)("");
	function continueToOtp() {
		if (!identifier.trim() || !password.trim()) {
			toast.error("Plotësoni të dhënat e administratorit për të vazhduar.");
			return;
		}
		setStep("otp");
		toast.success(`Kodi OTP demo u dërgua: ${DEMO_OTP}`);
	}
	async function verifyOtp() {
		if (otp !== DEMO_OTP) {
			toast.error("Kodi OTP nuk është i saktë. Për demo përdorni 246810.");
			return;
		}
		setStep("done");
		setRole("admin");
		toast.success(`Hyrja u krye si ${DEMO_ROLES.admin.label}`);
		await navigate({ to: DEMO_ROLES.admin.defaultRoute });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-5 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/login",
					className: "inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Kthehu te hyrja publike"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/brand/smart-dossier-logo-mark.svg",
						alt: "Smart Dossier",
						className: "h-10 w-12 object-contain"
					}), "Admin"]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid min-h-[calc(100vh-3.75rem)] max-w-6xl gap-4 px-3 py-4 sm:px-5 sm:py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 inline-flex rounded-md bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-soft",
						children: "Hyrje e veçantë"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl",
						children: "Paneli i administratorit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-base sm:leading-7",
						children: "Kjo hyrje përdoret vetëm për konfigurim, auditim, menaxhim përdoruesish dhe kontroll të plotë mbi platformën."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCapability, {
							title: "Auditim",
							body: "Shikim i historikut dhe veprimeve në dosje."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCapability, {
							title: "Konfigurim",
							body: "Menaxhim procesesh, përdoruesish dhe roleve."
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border bg-white p-4 shadow-lift sm:p-5 md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b pb-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), "Hyrje admin"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-2xl font-semibold tracking-tight",
								children: step === "otp" ? "Verifikimi me OTP" : "Identifikimi i administratorit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-6 text-muted-foreground",
								children: step === "otp" ? "Vendosni kodin demo për të përfunduar hyrjen si admin." : "Përdorni kredencialet demo të administratorit për këtë prototip."
							})
						]
					}),
					step === "credentials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-sm font-semibold text-foreground",
									children: ["ID e administratorit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-md border bg-card px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: identifier,
										onChange: (event) => setIdentifier(event.target.value),
										placeholder: "ADM-001",
										className: "h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-sm font-semibold text-foreground",
									children: ["Fjalëkalimi ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "*"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-md border bg-card px-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "size-5 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: password,
											onChange: (event) => setPassword(event.target.value),
											type: showPassword ? "text" : "password",
											className: "h-12 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowPassword((current) => !current),
											className: "grid size-9 place-items-center text-muted-foreground",
											"aria-label": showPassword ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin",
											children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: remember,
									onCheckedChange: (value) => setRemember(Boolean(value))
								}), "Më mbaj mend"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: continueToOtp,
								className: "h-12 w-full text-base font-semibold",
								children: "Hyr si admin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-muted p-3 text-xs leading-5 text-muted-foreground",
								children: [
									"Për demo: përdorni fjalëkalimin ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: "demo2026"
									}),
									" dhe kodin OTP ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: DEMO_OTP
									}),
									"."
								]
							})
						]
					}) : null,
					step === "otp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-6 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border bg-muted px-4 py-3 text-sm text-muted-foreground",
								children: [
									"Kodi OTP demo për admin është",
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
									className: "h-10 w-10 bg-white text-base sm:h-12 sm:w-12 sm:text-lg"
								}, index)) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: verifyOtp,
									className: "h-12 w-full text-base font-semibold",
									children: "Konfirmo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									className: "h-11 w-full",
									onClick: () => {
										setOtp("");
										setStep("credentials");
									},
									children: "Kthehu te identifikimi"
								})]
							})
						]
					}) : null,
					step === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-md border bg-muted p-4 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-8 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-sm font-semibold",
							children: "Hyrja u konfirmua"
						})]
					}) : null
				]
			})]
		})]
	});
}
function AdminCapability({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border bg-white p-4 shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs leading-5 text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { AdminLoginPage as component };
