"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { PartsExplode } from "./PartsExplode";
import { BRAND } from "@/lib/data";

export function Hero({ onSelect }: { onSelect: (slug: string) => void }) {
  // basta um toque de rolagem: a máquina abre sozinha e fecha ao voltar ao topo.
  // Lê o scroll atual já na montagem, então também funciona quando a página
  // recarrega no meio da rolagem (o navegador restaura a posição antes do React).
  const target = useMotionValue(0);
  const progress = useSpring(target, { stiffness: 38, damping: 15, restDelta: 0.001 });
  useEffect(() => {
    const update = () => target.set(window.scrollY > 24 ? 1 : 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [target]);

  const titleOpacity = useTransform(progress, [0, 0.35], [1, 0]);
  const titleY = useTransform(progress, [0, 0.35], [0, -40]);
  const hintOpacity = useTransform(progress, [0.7, 1], [0, 1]);

  return (
    <section className="relative h-[170vh] bg-black" id="inicio">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-x-0 top-[11vh] z-10 px-6 text-center md:top-[12vh]"
        >
          <p className="mb-3 text-lg font-semibold text-[#f5f5f7] md:text-2xl">{BRAND} · Assistência técnica 3D</p>
          <h1 className="display mx-auto max-w-4xl text-[#f5f5f7] text-balance text-[40px] sm:text-6xl md:text-[min(88px,10.5vh)]">
            Sua impressora 3D.
            <br />
            <span className="text-[#86868b]">Como nova.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6e6e73] md:text-[min(20px,2.6vh)]">
            Conserto, manutenção e troca de peças. Role para abrir a máquina.
          </p>
        </motion.div>

        <PartsExplode progress={progress} onSelect={onSelect} />

        <motion.p
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 hidden px-6 text-center text-sm text-[#6e6e73] md:block md:text-base"
        >
          Toque em uma peça para ver o que fazemos nela.
        </motion.p>

        <div className="pointer-events-none absolute bottom-6 flex flex-col items-center text-xs text-[#6e6e73]">
          <motion.span style={{ opacity: titleOpacity }} className="mb-1">
            Role
          </motion.span>
          <motion.div style={{ opacity: titleOpacity }} className="h-6 w-px bg-[#6e6e73]/60" />
        </div>
      </div>
    </section>
  );
}
