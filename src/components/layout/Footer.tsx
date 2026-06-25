"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin, Share2 } from "lucide-react";

const quickLinks = [
  { label: "Buy Now", href: "#" },
  { label: "About", href: "#about" },
  { label: "Flavours", href: "#flavours" },
  { label: "Contact Us", href: "#contact" },
];

const flavours = ["Lemon", "Zeera", "Rose"];

const socialLinks = [
  { icon: Share2, href: "#", label: "Instagram" },
  { icon: Mail, href: "mailto:hello@aroralemon.com", label: "Email" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#142014] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_10%_0%,rgba(247,213,71,0.14),transparent_55%),radial-gradient(ellipse_50%_40%_at_90%_100%,rgba(76,175,80,0.18),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lemon/50 to-transparent"
      />

      <div className="section-padding safe-bottom relative z-10 mx-auto max-w-7xl pb-6 pt-12 sm:pb-8 sm:pt-16 md:pt-20">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
          <div className="max-w-sm">
            <a href="/" aria-label="Home" className="inline-block">
              <Image
                src="/logo.png"
                alt="Arora Lemon"
                width={400}
                height={144}
                className="h-20 w-auto sm:h-24 md:h-32 lg:h-36"
              />
            </a>
            <p className="mt-5 text-base leading-relaxed text-white/70">
              Pure, natural refreshment crafted from real lemons and honest
              ingredients — bright flavour in every sip.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-lemon/60 hover:bg-lemon/15 hover:text-lemon"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-lemon">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-lemon">
              Flavours
            </h3>
            <ul className="mt-5 space-y-3">
              {flavours.map((name) => (
                <li key={name}>
                  <a
                    href="#flavours"
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-widest text-lemon">
              Get in Touch
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Mail size={16} className="mt-0.5 shrink-0 text-leaf" />
                <a
                  href="mailto:hello@aroralemon.com"
                  className="transition-colors hover:text-white"
                >
                  hello@aroralemon.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin size={16} className="mt-0.5 shrink-0 text-leaf" />
                <span>India</span>
              </li>
            </ul>
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white/60">
              Have a question or want to stock Arora Lemon? We&apos;d love to hear
              from you.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-sm text-white/50 md:text-left">
            &copy; {new Date().getFullYear()} Arora Lemon. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Use
            </a>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-lemon text-[#1a1a1a] shadow-[0_8px_30px_rgba(247,213,71,0.35)]"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
