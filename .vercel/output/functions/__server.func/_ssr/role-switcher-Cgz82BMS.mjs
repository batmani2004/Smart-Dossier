import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as UsersRound } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/role-switcher-Cgz82BMS.js
var import_jsx_runtime = require_jsx_runtime();
function AccessNotice({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-warning/30 bg-warning/10 p-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 font-medium text-warning-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { className: "size-4" }), title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { AccessNotice as t };
