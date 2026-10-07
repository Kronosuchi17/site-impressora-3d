"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { BRAND, BRANCHES, brl, parts, whatsappLink, type BranchId } from "@/lib/data";
import { Hero } from "./Hero";
import { PartSection, type QuoteItem } from "./PartSection";

const isBranch = (v: string): v is BranchId => BRANCHES.some((b) => b.id === v);

export function Site() {
  const [open, setOpen] = useState<Record<string, BranchId | null>>({});
  const [quote, setQuote] = useState<QuoteItem[]>([]);

  const reveal = useCallback((slug: string, branch: BranchId | null) => {
    setOpen((o) => ({ ...o, [slug]: branch }));
    history.replaceState(null, "", branch ? `#${slug}/${branch}` : `#${slug}`);
    if (branch) {
      setTimeout(() => document.getElementById(`${slug}-${branch}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }
  }, []);

  const goTo = useCallback((slug: string) => {
    history.replaceState(null, "", `#${slug}`);
    document.getElementById(slug)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const [slug, b] = decodeURIComponent(location.hash.slice(1)).split("/");
    if (!parts.some((p) => p.slug === slug)) return;
    const t = setTimeout(() => {
      if (b && isBranch(b)) setOpen({ [slug]: b });
      setTimeout(() => document.getElementById(b && isBranch(b) ? `${slug}-${b}` : slug)?.scrollIntoView(), 150);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const toggle = (item: QuoteItem) =>
    setQuote((q) => (q.some((i) => i.key === item.key) ? q.filter((i) => i.key !== item.key) : [...q, item]));

  const total = quote.reduce((s, i) => s + i.price, 0);
  const message = quote.length
    ? `Olá! Quero um orçamento:\n${quote.map((i) => `• ${i.part}: ${i.name} (a partir de ${brl(i.price)})`).join("\n")}\n\nImpressora (marca/modelo): `
    : "Olá! Quero um orçamento para minha impressora 3D.";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-11 max-w-6xl items-center justify-between px-5 text-sm text-[#d2d2d7]">
          <a href="#inicio" className="font-semibold text-white">
            {BRAND}
          </a>
          <ul className="hidden items-center gap-6 lg:flex">
            {parts.map((p) => (
              <li key={p.slug}>
                <button onClick={() => goTo(p.slug)} className="transition hover:text-white">
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#0071e3] px-3.5 py-1 text-xs text-white transition hover:bg-[#0077ed]"
          >
            Orçamento
          </a>
        </nav>
      </header>

      <main>
        <Hero onSelect={goTo} />

        <section className="section-theme carbon px-5 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-balance display text-5xl md:text-7xl">
              Qual parte precisa de cuidado?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Escolha uma peça. Cada caminho leva ao serviço certo, sem rodeio.
            </p>
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {parts.map((p, i) => (
                <li key={p.slug}>
                  <button
                    onClick={() => goTo(p.slug)}
                    className="group h-full w-full tile rounded-[28px] border border-line p-6 text-left transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span className="text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-6 block text-xl font-semibold">{p.name}</span>
                    <span className="mt-1 block text-sm text-muted">{p.tagline}</span>
                    <span className="mt-6 block text-sm text-accent transition group-hover:translate-x-1">Ver serviços →</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {parts.map((p, i) => (
          <PartSection
            key={p.slug}
            part={p}
            index={i}
            branch={open[p.slug] ?? null}
            onBranch={(b) => reveal(p.slug, b)}
            quote={quote}
            onToggle={toggle}
          />
        ))}

        <section className="section-theme carbon px-5 py-24 md:px-10 md:py-36" id="como-funciona">
          <div className="mx-auto max-w-6xl">
            <h2 className="display text-5xl md:text-7xl">Simples assim.</h2>
            <ol className="mt-12 grid gap-4 md:grid-cols-3">
              {[
                ["Escolha", "Marque os serviços ou peças que precisa."],
                ["Envie", "Mandamos tudo pronto no WhatsApp para confirmar o orçamento."],
                ["Receba", "Diagnóstico, reparo e teste de impressão antes da entrega."],
              ].map(([t, d], i) => (
                <li key={t} className="tile rounded-[28px] border border-line p-8">
                  <span className="text-5xl font-semibold text-[var(--fg)]">{i + 1}</span>
                  <h3 className="mt-6 text-2xl font-semibold">{t}</h3>
                  <p className="mt-2 text-muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="section-theme border-t border-line px-5 py-10 pb-28 text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4">
          <span>© {new Date().getFullYear()} {BRAND}. Valores “a partir de” (peça + mão de obra), confirmados após diagnóstico.</span>
          <a href={whatsappLink("Olá!")} className="hover:text-[var(--fg)]">
            WhatsApp
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {quote.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border border-[#333336] bg-[rgba(66,66,69,0.72)] p-3 pl-5 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="text-sm">
              <strong>{quote.length}</strong> {quote.length === 1 ? "item" : "itens"} · a partir de <strong>{brl(total)}</strong>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setQuote([])} className="rounded-full px-3 py-2 text-sm text-[#d2d2d7] hover:text-white">
                Limpar
              </button>
              <a
                href={whatsappLink(message)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#0071e3] px-5 py-2 text-sm text-white hover:bg-[#0077ed]"
              >
                Enviar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
