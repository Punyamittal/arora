"use client";

import Image from "next/image";

const products = ["Lemon", "Zeera", "Rose"];

export function CollectionSection() {
  return (
    <section id="flavours" className="relative overflow-hidden">
      <div className="relative min-h-[28rem] sm:min-h-[40rem] md:min-h-[56rem] lg:min-h-[60rem]">
        <Image
          src="/footer.png"
          alt="Arora Lemon, Zeera Soda, and Rose bottles on a wooden shelf"
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/15 to-transparent" />

        <div className="relative z-10 section-padding mx-auto max-w-7xl pt-8 pb-24 sm:pt-12 sm:pb-36 md:pb-44 lg:pb-48">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-leaf">
              Our Collection
            </span>
            <h2 className="font-heading mt-3 text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[#1a1a1a]">
              Choose Your Refreshment
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-[#1a1a1a]/80">
              Three distinctive flavours, one uncompromising standard of quality.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-6 md:grid-cols-3">
            {products.map((name) => (
              <div key={name} className="flex flex-col items-center text-center">
                <h3 className="font-heading text-lg font-bold text-[#1a1a1a] sm:text-[1.75rem]">
                  {name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
