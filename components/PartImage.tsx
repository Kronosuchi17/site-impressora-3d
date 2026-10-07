"use client";

import { useState, type ReactNode } from "react";

/** Foto da peça em /public/pecas/<slug>.jpg; se o arquivo não existir, mostra o desenho. */
export function PartImage({ slug, alt, fallback }: { slug: string; alt: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/pecas/${slug}.jpg`}
      alt={alt}
      ref={(el) => {
        // erro de carregamento que aconteceu antes da hidratação não dispara onError
        if (el && el.complete && el.naturalWidth === 0) setFailed(true);
      }}
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  );
}
