"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BRANCHES, brl, type BranchId, type Part } from "@/lib/data";
import { PartArt } from "./PrinterArt";
import { PartImage } from "./PartImage";

export type QuoteItem = { key: string; part: string; name: string; price: number };

export function PartSection({
  part,
  index,
  branch,
  onBranch,
  quote,
  onToggle,
}: {
  part: Part;
  index: number;
  branch: BranchId | null;
  onBranch: (b: BranchId | null) => void;
  quote: QuoteItem[];
  onToggle: (item: QuoteItem) => void;
}) {
  const carbon = index % 2 === 1;
  return (
    <section
      id={part.slug}
      className={`section-theme ${carbon ? "carbon" : ""} px-5 py-24 md:px-10 md:py-36`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 text-xl font-semibold text-[var(--fg)]">
              {String(index + 1).padStart(2, "0")} · {part.name}
            </p>
            <h2 className="text-balance display text-5xl md:text-7xl">
              {part.tagline}
            </h2>
            <p className="mt-5 max-w-lg text-lg text-muted md:text-xl">{part.intro}</p>

            <p className="mb-3 mt-8 text-sm font-medium text-muted">O que está acontecendo?</p>
            <div className="flex flex-wrap gap-2">
              {part.symptoms.map((s) => (
                <button
                  key={s.label}
                  onClick={() => onBranch(s.branch)}
                  className="rounded-full border border-[#6e6e73] px-4 py-2 text-sm text-[var(--fg)] transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex aspect-[4/3] items-center justify-center tile overflow-hidden rounded-[28px] p-8 md:p-12 has-[img]:bg-white has-[img]:p-0"
          >
            <PartImage slug={part.slug} alt={part.name} fallback={<PartArt slug={part.slug} className="h-full w-full" />} />
          </motion.div>
        </div>

        <div className="mt-16 grid gap-3 md:mt-24 md:grid-cols-3" role="tablist" aria-label={`Serviços de ${part.name}`}>
          {BRANCHES.map((b) => {
            const on = branch === b.id;
            return (
              <button
                key={b.id}
                role="tab"
                aria-selected={on}
                aria-controls={`${part.slug}-${b.id}`}
                onClick={() => onBranch(on ? null : b.id)}
                className={`tile rounded-[28px] border p-7 text-left transition focus-visible:outline-2 focus-visible:outline-accent ${
                  on ? "border-accent" : "border-line hover:border-muted"
                }`}
              >
                <span className="flex items-center justify-between text-xl font-semibold">
                  {b.label}
                  <span className={`text-2xl leading-none transition ${on ? "rotate-45 text-accent" : "text-muted"}`}>+</span>
                </span>
                <span className="mt-1 block text-sm text-muted">{b.sub}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence initial={false} mode="wait">
          {branch && (
            <motion.div
              key={branch}
              id={`${part.slug}-${branch}`}
              role="tabpanel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {part.branches[branch].map((item) => {
                  const key = `${part.slug}:${branch}:${item.name}`;
                  const picked = quote.some((q) => q.key === key);
                  return (
                    <li key={key} className="tile flex flex-col justify-between rounded-[28px] border border-line p-6">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="mt-1 text-sm text-muted">{item.desc}</p>
                      </div>
                      <div className="mt-6 flex items-center justify-between gap-3">
                        <span className="text-sm text-muted">
                          a partir de <strong className="text-base text-[var(--fg)]">{brl(item.price)}</strong>
                        </span>
                        <button
                          onClick={() => onToggle({ key, part: part.name, name: item.name, price: item.price })}
                          aria-pressed={picked}
                          className={`rounded-full px-4 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                            picked ? "bg-[#1d1d1f] text-accent ring-1 ring-accent" : "bg-[#0071e3] text-white hover:bg-[#0077ed]"
                          }`}
                        >
                          {picked ? "Adicionado ✓" : "Adicionar"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
