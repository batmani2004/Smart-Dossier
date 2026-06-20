import { LocateFixed, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TILE_SIZE = 256;
const MIN_ZOOM = 12;
const MAX_ZOOM = 19;

export type ParcelPoint = {
  lat: number;
  lon: number;
};

type ParcelMapProps = {
  center: { lat: number; lon: number; zoom?: number };
  parcelPolygon?: ParcelPoint[] | null;
  label?: string;
  className?: string;
};

type ViewState = {
  lat: number;
  lon: number;
  zoom: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrap(value: number, max: number) {
  return ((value % max) + max) % max;
}

function project(lat: number, lon: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const safeLat = clamp(lat, -85.05112878, 85.05112878);
  const sinLat = Math.sin((safeLat * Math.PI) / 180);
  return {
    x: ((lon + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function unproject(x: number, y: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lon = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat: clamp(lat, -85.05112878, 85.05112878), lon };
}

export function ParcelMap({ center, parcelPolygon, label = "PARCELA", className }: ParcelMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    centerWorld: { x: number; y: number };
    zoom: number;
  } | null>(null);
  const initialZoom = clamp(Math.round(center.zoom ?? 17), MIN_ZOOM, MAX_ZOOM);
  const [view, setView] = useState<ViewState>({
    lat: center.lat,
    lon: center.lon,
    zoom: initialZoom,
  });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setView({
      lat: center.lat,
      lon: center.lon,
      zoom: clamp(Math.round(center.zoom ?? 17), MIN_ZOOM, MAX_ZOOM),
    });
  }, [center.lat, center.lon, center.zoom]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const mapData = useMemo(() => {
    if (!size.width || !size.height) {
      return { tiles: [], polygon: "", labelPoint: { x: 50, y: 50 } };
    }

    const centerWorld = project(view.lat, view.lon, view.zoom);
    const tileCount = 2 ** view.zoom;
    const startTileX = Math.floor((centerWorld.x - size.width / 2) / TILE_SIZE);
    const endTileX = Math.floor((centerWorld.x + size.width / 2) / TILE_SIZE);
    const startTileY = Math.floor((centerWorld.y - size.height / 2) / TILE_SIZE);
    const endTileY = Math.floor((centerWorld.y + size.height / 2) / TILE_SIZE);
    const tiles: Array<{ key: string; src: string; left: number; top: number }> = [];

    for (let x = startTileX; x <= endTileX; x += 1) {
      for (let y = startTileY; y <= endTileY; y += 1) {
        if (y < 0 || y >= tileCount) continue;
        const tileX = wrap(x, tileCount);
        tiles.push({
          key: `${view.zoom}-${x}-${y}`,
          src: `https://tile.openstreetmap.org/${view.zoom}/${tileX}/${y}.png`,
          left: x * TILE_SIZE - centerWorld.x + size.width / 2,
          top: y * TILE_SIZE - centerWorld.y + size.height / 2,
        });
      }
    }

    const polygonPoints =
      parcelPolygon?.map((point) => {
        const world = project(point.lat, point.lon, view.zoom);
        return {
          x: world.x - centerWorld.x + size.width / 2,
          y: world.y - centerWorld.y + size.height / 2,
        };
      }) ?? [];
    const polygon = polygonPoints
      .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(" ");
    const labelPoint = polygonPoints.length
      ? polygonPoints.reduce(
          (acc, point) => ({
            x: acc.x + point.x / polygonPoints.length,
            y: acc.y + point.y / polygonPoints.length,
          }),
          { x: 0, y: 0 },
        )
      : { x: size.width / 2, y: size.height / 2 };

    return { tiles, polygon, labelPoint };
  }, [parcelPolygon, size.height, size.width, view.lat, view.lon, view.zoom]);

  function zoomTo(nextZoom: number, anchor?: { x: number; y: number }) {
    setView((current) => {
      const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      if (zoom === current.zoom) return current;

      const centerWorld = project(current.lat, current.lon, current.zoom);
      const anchorX = anchor?.x ?? size.width / 2;
      const anchorY = anchor?.y ?? size.height / 2;
      const anchorWorld = {
        x: centerWorld.x + anchorX - size.width / 2,
        y: centerWorld.y + anchorY - size.height / 2,
      };
      const anchorLatLon = unproject(anchorWorld.x, anchorWorld.y, current.zoom);
      const anchorWorldAtZoom = project(anchorLatLon.lat, anchorLatLon.lon, zoom);
      const nextCenterWorld = {
        x: anchorWorldAtZoom.x - (anchorX - size.width / 2),
        y: anchorWorldAtZoom.y - (anchorY - size.height / 2),
      };
      const nextCenter = unproject(nextCenterWorld.x, nextCenterWorld.y, zoom);
      return { ...nextCenter, zoom };
    });
  }

  function resetView() {
    setView({
      lat: center.lat,
      lon: center.lon,
      zoom: clamp(Math.round(center.zoom ?? 17), MIN_ZOOM, MAX_ZOOM),
    });
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-slate-100",
        dragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      onPointerDown={(event) => {
        if (event.target instanceof Element && event.target.closest("button,a")) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          centerWorld: project(view.lat, view.lon, view.zoom),
          zoom: view.zoom,
        };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        const nextCenterWorld = {
          x: drag.centerWorld.x - (event.clientX - drag.startX),
          y: drag.centerWorld.y - (event.clientY - drag.startY),
        };
        const nextCenter = unproject(nextCenterWorld.x, nextCenterWorld.y, drag.zoom);
        setView({ ...nextCenter, zoom: drag.zoom });
      }}
      onPointerUp={(event) => {
        if (dragRef.current?.pointerId === event.pointerId) {
          dragRef.current = null;
          setDragging(false);
        }
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        setDragging(false);
      }}
      onWheel={(event) => {
        event.preventDefault();
        if (!size.width || !size.height) return;
        const rect = event.currentTarget.getBoundingClientRect();
        zoomTo(view.zoom + (event.deltaY < 0 ? 1 : -1), {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
      style={{ touchAction: "none" }}
    >
      {mapData.tiles.map((tile) => (
        <img
          key={tile.key}
          src={tile.src}
          alt=""
          draggable={false}
          className="absolute h-64 w-64 select-none"
          style={{ left: tile.left, top: tile.top }}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ))}

      {mapData.polygon ? (
        <>
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full">
            <polygon
              points={mapData.polygon}
              fill="rgba(239, 51, 64, 0.3)"
              stroke="#ef3340"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <circle
              cx={mapData.labelPoint.x}
              cy={mapData.labelPoint.y}
              r="5"
              fill="#ef3340"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
          <div
            className="pointer-events-none absolute z-20 rounded-full border border-red-400/50 bg-white/95 px-2 py-1 text-[10px] font-bold text-[#06365f] shadow-sm"
            style={{
              left: mapData.labelPoint.x,
              top: Math.max(10, mapData.labelPoint.y - 12),
              transform: "translate(-50%, -100%)",
            }}
          >
            {label}
          </div>
        </>
      ) : null}

      <div className="absolute right-3 top-3 z-30 grid overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          aria-label="Zmadho harten"
          className="grid size-8 place-items-center text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          disabled={view.zoom >= MAX_ZOOM}
          onClick={() => zoomTo(view.zoom + 1)}
        >
          <Plus className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Zvogelo harten"
          className="grid size-8 place-items-center border-t border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          disabled={view.zoom <= MIN_ZOOM}
          onClick={() => zoomTo(view.zoom - 1)}
        >
          <Minus className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Kthe te parcela"
          className="grid size-8 place-items-center border-t border-slate-200 text-slate-700 hover:bg-slate-50"
          onClick={resetView}
        >
          <LocateFixed className="size-4" />
        </button>
      </div>

      <div className="absolute bottom-1 right-1 z-30 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-slate-600">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          OpenStreetMap
        </a>
      </div>
    </div>
  );
}
