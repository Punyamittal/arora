"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { FruitImage } from "@/components/shared/FruitImage";

const ingredients = [
  {
    name: "Fresh Lemons",
    emoji: "🍋",
    description: "Sun-ripened, hand-picked citrus",
    position: { top: "10%", left: "15%" },
    parallax: 80,
    direction: -1,
  },
  {
    name: "Mint Leaves",
    emoji: "🌿",
    description: "Cool, aromatic garden mint",
    position: { top: "20%", right: "12%" },
    parallax: 120,
    direction: 1,
  },
  {
    name: "Natural Extracts",
    emoji: "✨",
    description: "Pure botanical essences",
    position: { bottom: "30%", left: "8%" },
    parallax: 60,
    direction: -1,
  },
  {
    name: "Sparkling Water",
    emoji: "💧",
    description: "Crisp, filtered spring water",
    position: { bottom: "15%", right: "18%" },
    parallax: 100,
    direction: 1,
  },
];

function IngredientCard({
  ingredient,
  index,
  scrollYProgress,
}: {
  ingredient: (typeof ingredients)[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [ingredient.parallax, -ingredient.parallax]
  );
  const x = useTransform(
    scrollYProgress,
    [0.2, 0.6],
    [0, ingredient.direction * 60]
  );
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0.2, 0.5, 0.7], [1.2, 0.8, 0.5]);

  return (
    <motion.div
      className="absolute z-20"
      style={{
        ...ingredient.position,
        y,
        x,
        opacity,
        scale,
      }}
    >
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-xl border border-white/60">
        <span className="text-4xl">{ingredient.emoji}</span>
        <p className="font-heading text-sm font-bold whitespace-nowrap">{ingredient.name}</p>
        <p className="text-xs text-muted-foreground whitespace-nowrap">{ingredient.description}</p>
      </div>
    </motion.div>
  );
}

export function IngredientsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const canScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.6, 1, 0.8]);
  const canOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0.5]);
  const blendProgress = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <section id="ingredients" ref={containerRef} className="relative min-h-[120vh] section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fafff5] to-white" />

      <div className="relative mx-auto max-w-7xl">
        <SectionReveal className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-widest text-leaf">
            The Experience
          </span>
          <h2 className="font-heading mt-4 text-[clamp(2.5rem,5vw,3.5rem)] font-bold text-[#1a1a1a]">
            From Nature to Bottle
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Watch as pure ingredients come together to create the perfect sip.
          </p>
        </SectionReveal>

        <div className="relative mx-auto h-[600px] max-w-4xl">
          {ingredients.map((ingredient, i) => (
            <IngredientCard
              key={ingredient.name}
              ingredient={ingredient}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ scale: canScale, opacity: canOpacity }}
          >
            <motion.div
              className="absolute inset-0 -m-16 rounded-full bg-gradient-to-br from-lemon/40 via-lime/30 to-leaf/20 blur-2xl"
              style={{ opacity: blendProgress }}
            />
            <div className="relative">
              <FruitImage type="lemonHalf" size={200} className="mx-auto" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: blendProgress }}
              >
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-lemon via-lime to-leaf opacity-80 blur-sm" />
              </motion.div>
            </div>
          </motion.div>

          <motion.svg
            className="absolute inset-0 w-full h-full z-0"
            style={{ opacity: blendProgress }}
          >
            <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#9ACD32" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="#F7D547" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1="15%" y1="70%" x2="50%" y2="50%" stroke="#4CAF50" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            <line x1="85%" y1="75%" x2="50%" y2="50%" stroke="#9ACD32" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          </motion.svg>
        </div>
      </div>
    </section>
  );
}
