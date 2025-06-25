"use client"

import { Button } from "@/components/ui/button"

export default function Banner() {
  return (
    <section className="relative w-full bg-[url('https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center bg-no-repeat lg:h-[100vh]">
      <div className="container flex flex-col-reverse items-center bg-primary/60 bg-opacity-80 lg:flex-row lg:justify-between lg:items-center px-[5%] py-10 space-y-8 lg:space-y-0 h-[100%]">
        {/* Texto */}
        <div className="lg:text-center space-y-6 px-[5%] text-center lg:pl-[10%]">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Impulsione sua presença online com estilo
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto ">
            Crie experiências incríveis com componentes reutilizáveis e acessíveis.
            Perfeito para startups, freelancers e equipes ágeis.
          </p>
          <Button className="mt-4 text-base px-6 py-2">
            Começar agora
          </Button>
        </div>
      </div>
    </section>
  )
}
