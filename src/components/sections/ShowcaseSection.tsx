"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/shared/SectionReveal";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { ProductModel3D } from "@/components/shared/ProductModel3D";
import { CitrusSplash } from "@/components/shared/CitrusSplash";
import { MintAccent } from "@/components/shared/MintAccent";
import { Input } from "@/components/ui/input";

export function ShowcaseSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-lemon via-[#f5c842] to-[#e8b830]">
      {/* Background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-leaf blur-3xl" />
      </div>

      <div className="section-padding relative z-10 mx-auto max-w-7xl">
        <SectionReveal direction="scale">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
              {/* Left — marketing copy */}
              <div className="relative text-center lg:text-left">
                <MintAccent
                  seed="showcase-copy"
                  className="right-0 top-0 hidden md:block lg:-right-8"
                />
                <h2 className="font-heading text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-white drop-shadow-sm">
                  Choose Natural.
                  <br />
                  Choose Refreshment.
                  <br />
                  Choose Arora Lemon.
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  Join thousands who&apos;ve made the switch to pure, natural refreshment.
                </p>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <MagneticButton variant="white">See Assortment</MagneticButton>
                </div>
              </div>

              {/* Center — product burst */}
              <div className="relative flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: [-8, 8, -8] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CitrusSplash color="white" size={350} className="absolute -inset-8 opacity-60" />
                </motion.div>

                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <ProductModel3D size="lg" tilt={-12} autoRotate />
                </motion.div>
              </div>

              {/* Right — lead form */}
              <div className="glass rounded-[2rem] p-8 shadow-xl">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <span className="text-5xl">🍋</span>
                    <h3 className="font-heading mt-4 text-2xl font-bold">Thank You!</h3>
                    <p className="mt-2 text-muted-foreground">
                      We&apos;ll be in touch with exclusive offers.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-heading text-xl font-bold text-[#1a1a1a]">
                      Get In Touch
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Be the first to know about new flavours and offers.
                    </p>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12 rounded-xl border-black/10 bg-white/80 text-base"
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 rounded-xl border-black/10 bg-white/80 text-base"
                    />
                    <textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-base outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20 resize-none"
                    />
                    <MagneticButton type="submit" variant="green" className="w-full !text-base">
                      Send Message
                    </MagneticButton>
                  </form>
                )}
              </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
