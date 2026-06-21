import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Slot, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-access-SJl8-tLA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90",
			outline: "border border-input bg-card shadow-soft hover:bg-[var(--brand-blue-soft)] hover:text-primary",
			secondary: "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80",
			ghost: "hover:bg-[var(--brand-blue-soft)] hover:text-primary",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-md border bg-card text-card-foreground shadow-soft", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var STORAGE_KEY = "smart-dossier-demo-role";
var ROLE_EVENT = "smart-dossier-role-change";
var DEFAULT_ROLE = "citizen";
var adminPermissions = {
	viewDashboard: true,
	viewDossiers: true,
	createDossier: true,
	advanceDossier: true,
	uploadDocument: true,
	runAi: true,
	generateDocuments: true,
	viewAudit: true,
	resetDemo: true,
	manageUsers: true,
	viewCitizenPortal: true
};
var DEMO_ROLES = {
	admin: {
		label: "Admin",
		shortLabel: "Admin",
		displayName: "Ina Marku",
		credentialLabel: "Admin",
		description: "Konfigurim, auditim dhe kontroll i plote mbi platformen.",
		defaultRoute: "/",
		permissions: adminPermissions
	},
	operator: {
		label: "Operator",
		shortLabel: "Operator",
		displayName: "Arben Dervishi",
		credentialLabel: "Operator",
		description: "Punon me dosjet, dokumentet, verifikimet dhe hapat e procesit.",
		defaultRoute: "/dosjet",
		permissions: {
			...adminPermissions,
			resetDemo: false,
			manageUsers: false
		}
	},
	citizen: {
		label: "Qytetar",
		shortLabel: "Qytetar",
		displayName: "Elira Kola",
		credentialLabel: "Qytetar",
		description: "Aplikon per privatizim banese ose shpronesim/kompensim dhe ndjek gjurmimin publik te dosjes.",
		defaultRoute: "/aplikim",
		permissions: {
			viewDashboard: false,
			viewDossiers: false,
			createDossier: false,
			advanceDossier: false,
			uploadDocument: false,
			runAi: false,
			generateDocuments: false,
			viewAudit: false,
			resetDemo: false,
			manageUsers: false,
			viewCitizenPortal: true
		}
	},
	business: {
		label: "Biznes",
		shortLabel: "Biznes",
		displayName: "AlbaTech sh.p.k.",
		credentialLabel: "Biznes",
		description: "Subjekt me NIPT qe aplikon per regjistrim prone ose kompensim shpronesimi dhe ndjek shqyrtimin nga operatori.",
		defaultRoute: "/biznes",
		permissions: {
			viewDashboard: false,
			viewDossiers: false,
			createDossier: false,
			advanceDossier: false,
			uploadDocument: false,
			runAi: false,
			generateDocuments: false,
			viewAudit: false,
			resetDemo: false,
			manageUsers: false,
			viewCitizenPortal: true
		}
	}
};
function isDemoRole(value) {
	return value === "admin" || value === "operator" || value === "citizen" || value === "business";
}
function roleCan(role, permission) {
	return DEMO_ROLES[role].permissions[permission];
}
function readStoredRole() {
	if (typeof window === "undefined") return DEFAULT_ROLE;
	const stored = window.localStorage.getItem(STORAGE_KEY);
	return isDemoRole(stored) ? stored : DEFAULT_ROLE;
}
function useDemoRole() {
	const [role, setRoleState] = (0, import_react.useState)(() => readStoredRole());
	(0, import_react.useEffect)(() => {
		setRoleState(readStoredRole());
		const onRoleChange = (event) => {
			const next = event.detail;
			if (isDemoRole(next)) setRoleState(next);
		};
		const onStorage = (event) => {
			if (event.key === STORAGE_KEY) setRoleState(isDemoRole(event.newValue) ? event.newValue : DEFAULT_ROLE);
		};
		window.addEventListener(ROLE_EVENT, onRoleChange);
		window.addEventListener("storage", onStorage);
		return () => {
			window.removeEventListener(ROLE_EVENT, onRoleChange);
			window.removeEventListener("storage", onStorage);
		};
	}, []);
	const setRole = (next) => {
		setRoleState(next);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(STORAGE_KEY, next);
			window.dispatchEvent(new CustomEvent(ROLE_EVENT, { detail: next }));
		}
	};
	const logout = () => {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(STORAGE_KEY);
			window.dispatchEvent(new CustomEvent(ROLE_EVENT, { detail: null }));
		}
	};
	return (0, import_react.useMemo)(() => ({
		role,
		setRole,
		logout,
		profile: DEMO_ROLES[role],
		can: (permission) => roleCan(role, permission)
	}), [role]);
}
//#endregion
export { cn as a, Input as i, Card as n, useDemoRole as o, DEMO_ROLES as r, Button as t };
