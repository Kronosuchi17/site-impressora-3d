"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useState, useSyncExternalStore } from "react";
import { parts } from "@/lib/data";
import { useIsDesktop } from "./PrinterArt";

type Slot = { slug: string; x: number; y: number; order: number };
type Layout = {
  W: number;
  H: number;
  printer: { x: number; y: number; size: number };
  card: { w: number; h: number };
  slots: Slot[];
  startScale: number;
  startY: string;
};

/** ponto de cada peça sobre a foto da impressora, em fração do quadrado da foto */
const origin: Record<string, [number, number]> = {
  hotend: [0.43, 0.45],
  extrusora: [0.536, 0.075],
  mesa: [0.35, 0.7],
  movimento: [0.775, 0.475],
  placa: [0.3, 0.825],
  fonte: [0.55, 0.86],
  display: [0.71, 0.84],
};

// ordem em que as peças saem da imagem: começa pelo bico (hotend)
const desktop: Layout = {
  W: 1000,
  H: 640,
  printer: { x: 300, y: 120, size: 400 },
  card: { w: 190, h: 150 },
  startScale: 0.62,
  startY: "18vh",
  slots: [
    { slug: "extrusora", x: 50, y: 95, order: 1 },
    { slug: "hotend", x: 50, y: 255, order: 0 },
    { slug: "mesa", x: 50, y: 415, order: 2 },
    { slug: "movimento", x: 760, y: 20, order: 3 },
    { slug: "placa", x: 760, y: 170, order: 4 },
    { slug: "fonte", x: 760, y: 320, order: 5 },
    { slug: "display", x: 760, y: 470, order: 6 },
  ],
};

const mobile: Layout = {
  W: 380,
  H: 745,
  printer: { x: 80, y: 6, size: 220 },
  card: { w: 175, h: 118 },
  startScale: 0.9,
  startY: "30vh",
  slots: [
    { slug: "hotend", x: 10, y: 245, order: 0 },
    { slug: "extrusora", x: 195, y: 245, order: 1 },
    { slug: "mesa", x: 10, y: 371, order: 2 },
    { slug: "movimento", x: 195, y: 371, order: 3 },
    { slug: "placa", x: 10, y: 497, order: 4 },
    { slug: "fonte", x: 195, y: 497, order: 5 },
    { slug: "display", x: 102, y: 623, order: 6 },
  ],
};

const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const useViewport = () => {
  const s = useSyncExternalStore(
    subscribe,
    () => `${window.innerWidth}x${window.innerHeight}`,
    () => "1280x800",
  );
  const [w, h] = s.split("x").map(Number);
  return { w, h };
};

function PartCard({
  slot,
  L,
  progress,
  onSelect,
  active,
  setActive,
  showLine,
}: {
  showLine: boolean;
  slot: Slot;
  L: Layout;
  progress: MotionValue<number>;
  onSelect: (slug: string) => void;
  active: boolean;
  setActive: (s: string | null) => void;
}) {
  const name = parts.find((p) => p.slug === slot.slug)?.name ?? slot.slug;
  const [fx, fy] = origin[slot.slug];
  const ox = L.printer.x + fx * L.printer.size; // onde a peça "mora" na foto
  const oy = L.printer.y + fy * L.printer.size;
  const cx = slot.x + L.card.w / 2;
  const cy = slot.y + L.card.h / 2;

  const start = 0.04 + slot.order * 0.085;
  const end = start + 0.36;
  const x = useTransform(progress, [start, end], [ox - cx, 0]);
  const y = useTransform(progress, [start, end], [oy - cy, 0]);
  const scale = useTransform(progress, [start, end], [0.12, 1]);
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1]);
  const lineLen = useTransform(progress, [start + 0.1, end], [0, 1]);
  const dotOpacity = useTransform(progress, [start - 0.02, start + 0.04, end], [0, 1, 1]);

  // linha da foto até a borda do cartão (lado mais próximo)
  const toLeft = cx < L.printer.x + L.printer.size / 2;
  const ex = toLeft ? slot.x + L.card.w : slot.x;
  const ey = cy;

  return (
    <>
      <svg className="pointer-events-none absolute left-0 top-0" width={L.W} height={L.H} aria-hidden>
        {showLine && (
        <motion.line
          x1={ox}
          y1={oy}
          x2={ex}
          y2={ey}
          stroke={active ? "#2997ff" : "#6e6e73"}
          strokeWidth="1.2"
          style={{ pathLength: lineLen, opacity }}
        />
        )}
        <motion.circle cx={ox} cy={oy} r="7" fill="#fff" stroke="#0071e3" strokeWidth="3" style={{ opacity: dotOpacity }} />
      </svg>
      <motion.button
        type="button"
        onClick={() => onSelect(slot.slug)}
        onMouseEnter={() => setActive(slot.slug)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(slot.slug)}
        onBlur={() => setActive(null)}
        aria-label={`Ver serviços para ${name}`}
        style={{ x, y, scale, opacity, left: slot.x, top: slot.y, width: L.card.w, height: L.card.h }}
        className={`absolute overflow-hidden rounded-[20px] bg-white text-left outline-none ring-2 transition-shadow focus-visible:ring-[#2997ff] ${
          active ? "ring-[#2997ff]" : "ring-transparent"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/pecas/${slot.slug}.jpg`}
          alt=""
          className="absolute inset-x-0 top-0 object-contain"
          style={{ height: L.card.h - 28, width: "100%" }}
        />
        <span
          className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-white text-[13px] font-semibold text-[#1d1d1f]"
          style={{ height: 28 }}
        >
          {name}
        </span>
      </motion.button>
    </>
  );
}

export function PartsExplode({
  progress,
  onSelect,
}: {
  progress: MotionValue<number>;
  onSelect: (slug: string) => void;
}) {
  const isDesktop = useIsDesktop();
  const L = isDesktop ? desktop : mobile;
  const { w, h } = useViewport();
  const s = Math.min(w / L.W, (h - 56) / L.H, isDesktop ? 1.4 : 1);
  const [active, setActive] = useState<string | null>(null);

  const tileScale = useTransform(progress, [0, 0.3], [L.startScale, 1]);
  const stageY = useTransform(progress, [0, 0.3], [L.startY, "0vh"]);
  const tileDim = useTransform(progress, [0.1, 0.6], [1, 0.9]);

  return (
    <motion.div style={{ y: stageY, width: L.W * s, height: L.H * s }} className="relative mt-11">
      <div
        className="absolute left-0 top-0"
        style={{ width: L.W, height: L.H, transform: `scale(${s})`, transformOrigin: "top left" }}
      >
        <motion.div
          style={{
            left: L.printer.x,
            top: L.printer.y,
            width: L.printer.size,
            height: L.printer.size,
            scale: tileScale,
            opacity: tileDim,
          }}
          className="absolute overflow-hidden rounded-[28px] bg-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pecas/impressora.jpg" alt="Impressora 3D" className="h-full w-full object-contain" />
        </motion.div>
        {L.slots.map((slot) => (
          <PartCard
            key={slot.slug}
            slot={slot}
            L={L}
            progress={progress}
            onSelect={onSelect}
            active={active === slot.slug}
            setActive={setActive}
            showLine={isDesktop}
          />
        ))}
      </div>
    </motion.div>
  );
}
