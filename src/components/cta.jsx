"use client"

import { Button } from "@/components/ui/button"

export default function Banner() {
  return (
    <section className="relative w-full h-[400px] overflow-hidden mt-[50]">
      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        {/* Sobreposição escura */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
        <div className="max-w-2xl text-white space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            A solução visual para o seu negócio
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Impacte seu público com uma presença moderna e responsiva. Ideal para landing pages e produtos.
          </p>
          <Button size="lg" className="text-base">
            Começar agora
          </Button>
        </div>
      </div>
    </section>
  )
}
