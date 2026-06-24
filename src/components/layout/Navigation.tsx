"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinkClass =
  "text-sm font-medium text-[#1a1a1a]/70 transition-colors hover:text-leaf";

const navLinks = [
  { label: "Buy Now", href: "#" },
  { label: "About", href: "#about" },
  { label: "Flavours", href: "#flavours" },
  { label: "Contact Us", href: "#contact" },
];

const leftLinks = navLinks.slice(0, 2);
const rightLinks = navLinks.slice(2);

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-700 ease-out",
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-black/5"
            : "bg-transparent"
        )}
      >
        <nav className="relative mx-auto flex max-w-7xl items-center justify-center px-6 py-5 md:px-12 md:py-6 lg:px-20">
          <div className="hidden items-center gap-8 md:flex lg:gap-12">
            {leftLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={navLinkClass}
              >
                {link.label}
              </a>
            ))}

            <a href="/" className="shrink-0" aria-label="Home">
              <Image
                src="/logo.png"
                alt="Arora Lemon"
                width={360}
                height={128}
                className="h-16 w-auto md:h-20 lg:h-24"
                priority
              />
            </a>

            {rightLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={navLinkClass}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex w-full items-center justify-between md:hidden">
            <a href="/" className="shrink-0" aria-label="Home">
              <Image
                src="/logo.png"
                alt="Arora Lemon"
                width={280}
                height={100}
                className="h-14 w-auto"
                priority
              />
            </a>

            <button
              className="p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-8 p-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-2xl font-semibold"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
