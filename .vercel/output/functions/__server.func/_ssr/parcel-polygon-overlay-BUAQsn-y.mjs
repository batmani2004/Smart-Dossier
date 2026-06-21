import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as cn } from "./demo-access-SJl8-tLA.mjs";
import { A as Minus, O as Plus, R as LocateFixed } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parcel-polygon-overlay-BUAQsn-y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TILE_SIZE = 256;
var MIN_ZOOM = 12;
var MAX_ZOOM = 19;
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value));
}
function wrap(value, max) {
	return (value % max + max) % max;
}
function project(lat, lon, zoom) {
	const scale = TILE_SIZE * 2 ** zoom;
	const safeLat = clamp(lat, -85.05112878, 85.05112878);
	const sinLat = Math.sin(safeLat * Math.PI / 180);
	return {
		x: (lon + 180) / 360 * scale,
		y: (.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
	};
}
function unproject(x, y, zoom) {
	const scale = TILE_SIZE * 2 ** zoom;
	const lon = x / scale * 360 - 180;
	const n = Math.PI - 2 * Math.PI * y / scale;
	return {
		lat: clamp(180 / Math.PI * Math.atan(.5 * (Math.exp(n) - Math.exp(-n))), -85.05112878, 85.05112878),
		lon
	};
}
function ParcelMap({ center, parcelPolygon, label = "PARCELA", className }) {
	const containerRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)(null);
	const initialZoom = clamp(Math.round(center.zoom ?? 17), MIN_ZOOM, MAX_ZOOM);
	const [view, setView] = (0, import_react.useState)({
		lat: center.lat,
		lon: center.lon,
		zoom: initialZoom
	});
	const [size, setSize] = (0, import_react.useState)({
		width: 0,
		height: 0
	});
	const [dragging, setDragging] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setView({
			lat: center.lat,
			lon: center.lon,
			zoom: clamp(Math.round(center.zoom ?? 17), MIN_ZOOM, MAX_ZOOM)
		});
	}, [
		center.lat,
		center.lon,
		center.zoom
	]);
	(0, import_react.useEffect)(() => {
		const element = containerRef.current;
		if (!element) return;
		const updateSize = () => {
			setSize({
				width: element.clientWidth,
				height: element.clientHeight
			});
		};
		updateSize();
		const observer = new ResizeObserver(updateSize);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);
	const mapData = (0, import_react.useMemo)(() => {
		if (!size.width || !size.height) return {
			tiles: [],
			polygon: "",
			labelPoint: {
				x: 50,
				y: 50
			}
		};
		const centerWorld = project(view.lat, view.lon, view.zoom);
		const tileCount = 2 ** view.zoom;
		const startTileX = Math.floor((centerWorld.x - size.width / 2) / TILE_SIZE);
		const endTileX = Math.floor((centerWorld.x + size.width / 2) / TILE_SIZE);
		const startTileY = Math.floor((centerWorld.y - size.height / 2) / TILE_SIZE);
		const endTileY = Math.floor((centerWorld.y + size.height / 2) / TILE_SIZE);
		const tiles = [];
		for (let x = startTileX; x <= endTileX; x += 1) for (let y = startTileY; y <= endTileY; y += 1) {
			if (y < 0 || y >= tileCount) continue;
			const tileX = wrap(x, tileCount);
			tiles.push({
				key: `${view.zoom}-${x}-${y}`,
				src: `https://tile.openstreetmap.org/${view.zoom}/${tileX}/${y}.png`,
				left: x * TILE_SIZE - centerWorld.x + size.width / 2,
				top: y * TILE_SIZE - centerWorld.y + size.height / 2
			});
		}
		const polygonPoints = parcelPolygon?.map((point) => {
			const world = project(point.lat, point.lon, view.zoom);
			return {
				x: world.x - centerWorld.x + size.width / 2,
				y: world.y - centerWorld.y + size.height / 2
			};
		}) ?? [];
		return {
			tiles,
			polygon: polygonPoints.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "),
			labelPoint: polygonPoints.length ? polygonPoints.reduce((acc, point) => ({
				x: acc.x + point.x / polygonPoints.length,
				y: acc.y + point.y / polygonPoints.length
			}), {
				x: 0,
				y: 0
			}) : {
				x: size.width / 2,
				y: size.height / 2
			}
		};
	}, [
		parcelPolygon,
		size.height,
		size.width,
		view.lat,
		view.lon,
		view.zoom
	]);
	function zoomTo(nextZoom, anchor) {
		setView((current) => {
			const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
			if (zoom === current.zoom) return current;
			const centerWorld = project(current.lat, current.lon, current.zoom);
			const anchorX = anchor?.x ?? size.width / 2;
			const anchorY = anchor?.y ?? size.height / 2;
			const anchorWorld = {
				x: centerWorld.x + anchorX - size.width / 2,
				y: centerWorld.y + anchorY - size.height / 2
			};
			const anchorLatLon = unproject(anchorWorld.x, anchorWorld.y, current.zoom);
			const anchorWorldAtZoom = project(anchorLatLon.lat, anchorLatLon.lon, zoom);
			const nextCenterWorld = {
				x: anchorWorldAtZoom.x - (anchorX - size.width / 2),
				y: anchorWorldAtZoom.y - (anchorY - size.height / 2)
			};
			return {
				...unproject(nextCenterWorld.x, nextCenterWorld.y, zoom),
				zoom
			};
		});
	}
	function resetView() {
		setView({
			lat: center.lat,
			lon: center.lon,
			zoom: clamp(Math.round(center.zoom ?? 17), MIN_ZOOM, MAX_ZOOM)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: cn("relative h-full w-full overflow-hidden bg-slate-100", dragging ? "cursor-grabbing" : "cursor-grab", className),
		onPointerDown: (event) => {
			if (event.target instanceof Element && event.target.closest("button,a")) return;
			event.currentTarget.setPointerCapture(event.pointerId);
			dragRef.current = {
				pointerId: event.pointerId,
				startX: event.clientX,
				startY: event.clientY,
				centerWorld: project(view.lat, view.lon, view.zoom),
				zoom: view.zoom
			};
			setDragging(true);
		},
		onPointerMove: (event) => {
			const drag = dragRef.current;
			if (!drag || drag.pointerId !== event.pointerId) return;
			const nextCenterWorld = {
				x: drag.centerWorld.x - (event.clientX - drag.startX),
				y: drag.centerWorld.y - (event.clientY - drag.startY)
			};
			setView({
				...unproject(nextCenterWorld.x, nextCenterWorld.y, drag.zoom),
				zoom: drag.zoom
			});
		},
		onPointerUp: (event) => {
			if (dragRef.current?.pointerId === event.pointerId) {
				dragRef.current = null;
				setDragging(false);
			}
		},
		onPointerCancel: () => {
			dragRef.current = null;
			setDragging(false);
		},
		onWheel: (event) => {
			event.preventDefault();
			if (!size.width || !size.height) return;
			const rect = event.currentTarget.getBoundingClientRect();
			zoomTo(view.zoom + (event.deltaY < 0 ? 1 : -1), {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			});
		},
		style: { touchAction: "none" },
		children: [
			mapData.tiles.map((tile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: tile.src,
				alt: "",
				draggable: false,
				className: "absolute h-64 w-64 select-none",
				style: {
					left: tile.left,
					top: tile.top
				},
				loading: "lazy",
				referrerPolicy: "no-referrer"
			}, tile.key)),
			mapData.polygon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "pointer-events-none absolute inset-0 z-10 h-full w-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					points: mapData.polygon,
					fill: "rgba(239, 51, 64, 0.3)",
					stroke: "#ef3340",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeWidth: "3",
					vectorEffect: "non-scaling-stroke"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: mapData.labelPoint.x,
					cy: mapData.labelPoint.y,
					r: "5",
					fill: "#ef3340",
					stroke: "#fff",
					strokeWidth: "2"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute z-20 rounded-full border border-red-400/50 bg-white/95 px-2 py-1 text-[10px] font-bold text-[#06365f] shadow-sm",
				style: {
					left: mapData.labelPoint.x,
					top: Math.max(10, mapData.labelPoint.y - 12),
					transform: "translate(-50%, -100%)"
				},
				children: label
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 top-3 z-30 grid overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Zmadho harten",
						className: "grid size-8 place-items-center text-slate-700 hover:bg-slate-50 disabled:opacity-40",
						disabled: view.zoom >= MAX_ZOOM,
						onClick: () => zoomTo(view.zoom + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Zvogelo harten",
						className: "grid size-8 place-items-center border-t border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40",
						disabled: view.zoom <= MIN_ZOOM,
						onClick: () => zoomTo(view.zoom - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Kthe te parcela",
						className: "grid size-8 place-items-center border-t border-slate-200 text-slate-700 hover:bg-slate-50",
						onClick: resetView,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-1 right-1 z-30 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-slate-600",
				children: [
					"©",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.openstreetmap.org/copyright",
						target: "_blank",
						rel: "noreferrer",
						className: "underline",
						children: "OpenStreetMap"
					})
				]
			})
		]
	});
}
//#endregion
export { ParcelMap as t };
