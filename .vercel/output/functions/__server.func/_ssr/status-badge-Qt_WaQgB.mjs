import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn } from "./demo-access-SJl8-tLA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-Qt_WaQgB.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STYLES = {
	draft: {
		label: "Draft",
		cls: "bg-muted text-muted-foreground"
	},
	in_progress: {
		label: "Në proces",
		cls: "bg-info/15 text-info"
	},
	blocked: {
		label: "Bllokuar",
		cls: "bg-destructive/15 text-destructive"
	},
	awaiting_external: {
		label: "Pritje institucionale",
		cls: "bg-warning/15 text-warning"
	},
	completed: {
		label: "Mbyllur",
		cls: "bg-success/15 text-success"
	},
	rejected: {
		label: "Refuzuar",
		cls: "bg-destructive/15 text-destructive"
	}
};
function StatusBadge({ status }) {
	const s = STATUS_STYLES[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium", s.cls),
		children: s.label
	});
}
var SEV_STYLES = {
	info: "bg-info/15 text-info",
	warning: "bg-warning/15 text-warning",
	critical: "bg-destructive/15 text-destructive"
};
function SeverityBadge({ severity, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium", SEV_STYLES[severity]),
		children
	});
}
var PRIO_STYLES = {
	high: "bg-destructive/15 text-destructive",
	normal: "bg-warning/15 text-warning",
	low: "bg-muted text-muted-foreground"
};
function PriorityBadge({ priority }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium capitalize", PRIO_STYLES[priority]),
		children: priority === "high" ? "I lartë" : priority === "normal" ? "Normal" : "I ulët"
	});
}
//#endregion
export { SeverityBadge as n, StatusBadge as r, PriorityBadge as t };
