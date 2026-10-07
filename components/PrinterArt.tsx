"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { parts } from "@/lib/data";

const metal = "url(#metal)";
const dark = "url(#dark)";
const E = "var(--art-edge)";
const D = "var(--art-dim)";
const A = "var(--accent)";

type Geo = {
  bbox: [number, number, number, number];
  explode: [number, number];
  /** ponto da peça (coords locais) onde a linha de chamada encosta */
  anchor: [number, number];
  side: "l" | "r";
  labelY: number;
  art: ReactNode;
};

const OX = 330;
const OY = 70;

const Defs = () => (
  <defs>
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4a4a4f" />
      <stop offset="1" stopColor="#232326" />
    </linearGradient>
    <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2c2c30" />
      <stop offset="1" stopColor="#141416" />
    </linearGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#8a6a30" />
      <stop offset="0.5" stopColor="#e2bd72" />
      <stop offset="1" stopColor="#8a6a30" />
    </linearGradient>
  </defs>
);

const geo: Record<string, Geo> = {
  movimento: {
    bbox: [-10, 28, 460, 432],
    explode: [0, 0],
    anchor: [0, 130],
    side: "l",
    labelY: 170,
    art: (
      <g stroke={E} strokeWidth="1.2">
        <rect x="-10" y="400" width="460" height="56" rx="9" fill={dark} />
        <rect x="0" y="30" width="22" height="370" rx="3" fill={metal} />
        <rect x="418" y="30" width="22" height="370" rx="3" fill={metal} />
        <rect x="0" y="30" width="440" height="16" rx="3" fill={metal} />
        <g stroke={D} fill="none">
          <line x1="11" y1="50" x2="11" y2="396" strokeDasharray="2 5" />
          <line x1="429" y1="50" x2="429" y2="396" strokeDasharray="2 5" />
        </g>
        <rect x="22" y="168" width="396" height="20" rx="3" fill={metal} />
        <line x1="40" y1="178" x2="400" y2="178" stroke={D} strokeDasharray="3 3" />
        <circle cx="36" cy="178" r="6" fill={dark} />
        <circle cx="404" cy="178" r="6" fill={dark} />
        <line x1="52" y1="60" x2="52" y2="392" strokeWidth="5" strokeDasharray="1.5 3" />
        <rect x="35" y="376" width="34" height="26" rx="4" fill={dark} />
      </g>
    ),
  },
  extrusora: {
    bbox: [312, -22, 98, 118],
    explode: [170, -30],
    anchor: [408, 10],
    side: "r",
    labelY: 50,
    art: (
      <g stroke={E} strokeWidth="1.2">
        <rect x="350" y="-20" width="58" height="58" rx="6" fill={dark} />
        <rect x="357" y="-13" width="44" height="8" rx="2" fill={metal} />
        <circle cx="336" cy="20" r="15" fill={metal} />
        <circle cx="336" cy="20" r="5" fill={A} stroke="none" />
        <rect x="318" y="6" width="18" height="8" rx="2" fill={dark} />
        <path d="M336 36 C336 62 316 70 304 92" fill="none" stroke={D} strokeWidth="4" />
      </g>
    ),
  },
  hotend: {
    bbox: [183, 156, 127, 150],
    explode: [-330, 10],
    anchor: [185, 240],
    side: "l",
    labelY: 320,
    art: (
      <g stroke={E} strokeWidth="1.2">
        <rect x="185" y="158" width="80" height="62" rx="6" fill={metal} />
        <circle cx="202" cy="172" r="5" fill={dark} />
        <circle cx="248" cy="172" r="5" fill={dark} />
        <rect x="268" y="172" width="40" height="46" rx="6" fill={dark} />
        <circle cx="288" cy="195" r="16" fill="none" />
        <circle cx="288" cy="195" r="4" fill={A} stroke="none" />
        <rect x="205" y="220" width="40" height="34" fill={metal} />
        <g stroke={D}>
          <line x1="205" y1="228" x2="245" y2="228" />
          <line x1="205" y1="236" x2="245" y2="236" />
          <line x1="205" y1="244" x2="245" y2="244" />
        </g>
        <rect x="218" y="254" width="14" height="10" fill={dark} />
        <rect x="208" y="262" width="34" height="22" rx="3" fill={dark} />
        <circle cx="236" cy="273" r="3" fill={A} stroke="none" />
        <polygon points="218,284 238,284 232,304 224,304" fill="url(#brass)" />
      </g>
    ),
  },
  mesa: {
    bbox: [34, 306, 382, 50],
    explode: [0, 50],
    anchor: [410, 327],
    side: "r",
    labelY: 450,
    art: (
      <g stroke={E} strokeWidth="1.2">
        <rect x="40" y="322" width="370" height="10" rx="2" fill={metal} />
        <rect x="52" y="312" width="346" height="8" rx="2" fill="#3a5a78" fillOpacity="0.55" />
        <g stroke={D} fill="none">
          <line x1="70" y1="334" x2="70" y2="350" strokeDasharray="2 2" />
          <line x1="380" y1="334" x2="380" y2="350" strokeDasharray="2 2" />
        </g>
        <circle cx="70" cy="352" r="6" fill={dark} />
        <circle cx="380" cy="352" r="6" fill={dark} />
      </g>
    ),
  },
  placa: {
    bbox: [56, 410, 342, 52],
    explode: [0, 110],
    anchor: [60, 436],
    side: "l",
    labelY: 620,
    art: (
      <g stroke={E} strokeWidth="1.2">
        <rect x="60" y="414" width="330" height="44" rx="4" fill="#12202e" />
        <g fill={dark}>
          <rect x="80" y="424" width="40" height="24" rx="2" />
          <rect x="130" y="424" width="24" height="24" rx="2" />
          <rect x="160" y="424" width="24" height="24" rx="2" />
          <rect x="190" y="424" width="24" height="24" rx="2" />
        </g>
        <circle cx="260" cy="440" r="8" fill={metal} />
        <circle cx="282" cy="440" r="8" fill={metal} />
        <rect x="300" y="418" width="80" height="10" rx="1" fill="none" strokeDasharray="6 3" />
        <rect x="300" y="444" width="80" height="10" rx="1" fill="none" strokeDasharray="6 3" />
        <circle cx="67" cy="421" r="2" />
        <circle cx="383" cy="421" r="2" />
        <circle cx="67" cy="451" r="2" />
        <circle cx="383" cy="451" r="2" />
      </g>
    ),
  },
  fonte: {
    bbox: [450, 408, 76, 54],
    explode: [50, 120],
    anchor: [524, 435],
    side: "r",
    labelY: 640,
    art: (
      <g stroke={E} strokeWidth="1.2">
        <rect x="452" y="410" width="72" height="50" rx="5" fill={metal} />
        <g stroke={D}>
          <line x1="462" y1="420" x2="514" y2="420" />
          <line x1="462" y1="428" x2="514" y2="428" />
          <line x1="462" y1="436" x2="514" y2="436" />
        </g>
        <rect x="462" y="446" width="10" height="8" fill={dark} />
        <rect x="476" y="446" width="10" height="8" fill={dark} />
        <rect x="490" y="446" width="10" height="8" fill={dark} />
        <circle cx="514" cy="450" r="2.5" fill={A} stroke="none" />
      </g>
    ),
  },
  display: {
    bbox: [78, 466, 124, 44],
    explode: [-60, 170],
    anchor: [80, 488],
    side: "l",
    labelY: 728,
    art: (
      <g stroke={E} strokeWidth="1.2">
        <rect x="80" y="468" width="120" height="40" rx="6" fill={dark} />
        <rect x="90" y="474" width="70" height="28" rx="2" fill="#0a2a52" />
        <g stroke={A} strokeWidth="1.6">
          <line x1="96" y1="483" x2="140" y2="483" />
          <line x1="96" y1="491" x2="124" y2="491" />
        </g>
        <circle cx="178" cy="488" r="11" fill={metal} />
        <circle cx="178" cy="488" r="3" fill={A} stroke="none" />
      </g>
    ),
  },
};

/** ordem de desenho: peças da frente por último */
const DRAW_ORDER = ["movimento", "mesa", "placa", "fonte", "display", "extrusora", "hotend"];

export function PartArt({ slug, className }: { slug: string; className?: string }) {
  const g = geo[slug];
  const [x, y, w, h] = g.bbox;
  const pad = 16;
  return (
    <svg viewBox={`${x - pad} ${y - pad} ${w + pad * 2} ${h + pad * 2}`} className={className} aria-hidden>
      <Defs />
      <g className="part-accent">{g.art}</g>
    </svg>
  );
}

function PartGroup({
  slug,
  progress,
  onSelect,
  active,
  onHover,
  name,
}: {
  slug: string;
  name: string;
  progress: MotionValue<number>;
  onSelect: (slug: string) => void;
  active: boolean;
  onHover: (slug: string | null) => void;
}) {
  const g = geo[slug];
  const x = useTransform(progress, [0, 1], [0, g.explode[0]]);
  const y = useTransform(progress, [0, 1], [0, g.explode[1]]);
  return (
    <motion.g
      style={{ x, y }}
      className={`part ${active ? "is-active" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`Ver serviços para ${name}`}
      onClick={() => onSelect(slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(slug);
        }
      }}
      onMouseEnter={() => onHover(slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(slug)}
      onBlur={() => onHover(null)}
    >
      {g.art}
    </motion.g>
  );
}

function Callout({
  slug,
  name,
  progress,
  onSelect,
  active,
  onHover,
}: {
  slug: string;
  name: string;
  progress: MotionValue<number>;
  onSelect: (slug: string) => void;
  active: boolean;
  onHover: (slug: string | null) => void;
}) {
  const g = geo[slug];
  const left = g.side === "l";
  const tx = left ? 30 : 1070;
  const lx = left ? 170 : 960;
  const ax = OX + g.anchor[0];
  const ay = OY + g.anchor[1];
  const x2 = useTransform(progress, [0, 1], [ax, ax + g.explode[0]]);
  const y2 = useTransform(progress, [0, 1], [ay, ay + g.explode[1]]);
  const opacity = useTransform(progress, [0.6, 0.95], [0, 1]);
  const ly = OY + g.labelY - OY; // já em coords absolutas
  return (
    <motion.g
      style={{ opacity }}
      className="hidden cursor-pointer md:inline"
      onClick={() => onSelect(slug)}
      onMouseEnter={() => onHover(slug)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.line
        x1={lx}
        y1={ly - 5}
        x2={x2}
        y2={y2}
        stroke={active ? "var(--accent)" : "#6e6e73"}
        strokeWidth="1"
      />
      <circle cx={lx} cy={ly - 5} r="2.5" fill={active ? "var(--accent)" : "#86868b"} />
      <text
        x={tx}
        y={ly}
        textAnchor={left ? "start" : "end"}
        fill={active ? "var(--accent)" : "var(--art-label)"}
        fontSize="17"
        fontWeight="600"
      >
        {name}
      </text>
    </motion.g>
  );
}

const subscribe = (cb: () => void) => {
  const m = window.matchMedia("(min-width: 768px)");
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
export const useIsDesktop = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia("(min-width: 768px)").matches, () => true);

export function PrinterArt({
  progress,
  onSelect,
}: {
  progress: MotionValue<number>;
  onSelect: (slug: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const desktop = useIsDesktop();
  const name = (s: string) => parts.find((p) => p.slug === s)?.name ?? s;
  return (
    <svg viewBox={desktop ? "0 0 1100 780" : "170 20 750 740"} className="printer-art h-full w-full" role="group" aria-label="Impressora 3D explodida">
      <Defs />
      <g transform={`translate(${OX} ${OY})`}>
        {DRAW_ORDER.map((s) => (
          <PartGroup
            key={s}
            slug={s}
            name={name(s)}
            progress={progress}
            onSelect={onSelect}
            active={hover === s}
            onHover={setHover}
          />
        ))}
      </g>
      {DRAW_ORDER.map((s) => (
        <Callout
          key={s}
          slug={s}
          name={name(s)}
          progress={progress}
          onSelect={onSelect}
          active={hover === s}
          onHover={setHover}
        />
      ))}
    </svg>
  );
}
