"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import {
  getBreakpoint,
  getDotRadius,
  getDotSpacing,
  getJourneyColor,
  JOURNEY_COLORS,
  JOURNEY_WAYPOINTS,
  samplePathPoints,
  waypointsToSmoothPath,
} from "@/lib/journeyTrail";

const INACTIVE_OPACITY = 0.55;
const VIEWPORT_BUFFER = 120;

export function JourneyTrail() {
  const trailRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotsGroupRef = useRef<SVGGElement>(null);
  const scrollProgressRef = useRef(0);
  const dotMetaRef = useRef<{ x: number; y: number }[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const rafIdRef = useRef(0);
  const pulsePhaseRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  });

  const buildTrail = useCallback(() => {
    const trail = trailRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    const group = dotsGroupRef.current;
    const main = trail?.parentElement;

    if (!trail || !svg || !path || !group || !main) return;

    const width = main.clientWidth;
    const height = main.scrollHeight;
    const breakpoint = getBreakpoint(width);
    const spacing = getDotSpacing(width);
    const radius = getDotRadius(width);

    dimensionsRef.current = { width, height };
    trail.style.height = `${height}px`;

    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));

    const pathD = waypointsToSmoothPath(
      JOURNEY_WAYPOINTS[breakpoint],
      width,
      height
    );
    path.setAttribute("d", pathD);

    const points = samplePathPoints(path, spacing);
    dotMetaRef.current = points;

    group.replaceChildren();

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < points.length; i++) {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", String(points[i].x));
      circle.setAttribute("cy", String(points[i].y));
      circle.setAttribute("r", String(radius));
      circle.setAttribute("fill", JOURNEY_COLORS.green);
      circle.setAttribute("opacity", String(INACTIVE_OPACITY));
      fragment.appendChild(circle);
    }
    group.appendChild(fragment);
  }, []);

  const updateDots = useCallback((timestamp: number) => {
    const group = dotsGroupRef.current;
    const dots = dotMetaRef.current;
    if (!group || dots.length === 0) return;

    pulsePhaseRef.current = timestamp * 0.004;
    const progress = scrollProgressRef.current;
    const totalDots = dots.length;
    const travelled = progress * totalDots;
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;
    const minY = scrollY - VIEWPORT_BUFFER;
    const maxY = scrollY + viewportH + VIEWPORT_BUFFER;

    const circles = group.children;

    for (let i = 0; i < dots.length; i++) {
      const circle = circles[i] as SVGCircleElement | undefined;
      if (!circle) continue;

      const { y } = dots[i];
      const inView = y >= minY && y <= maxY;

      if (!inView && !reducedMotionRef.current) {
        circle.style.display = "none";
        continue;
      }

      circle.style.display = "";

      if (reducedMotionRef.current) {
        circle.setAttribute("fill", JOURNEY_COLORS.green);
        circle.setAttribute("opacity", String(INACTIVE_OPACITY));
        circle.removeAttribute("filter");
        circle.removeAttribute("transform");
        continue;
      }

      const localRaw = travelled - i;
      const localProgress = Math.max(0, Math.min(1, localRaw));
      const isTravelled = localRaw > 0;
      const isActive =
        localRaw >= 0 && localRaw < 1.05 && progress > 0 && progress < 1;

      const opacity = isTravelled
        ? INACTIVE_OPACITY + (1 - INACTIVE_OPACITY) * localProgress
        : INACTIVE_OPACITY;

      circle.setAttribute("fill", getJourneyColor(localProgress));
      circle.setAttribute("opacity", opacity.toFixed(3));

      if (isActive) {
        const pulse = 1 + Math.sin(pulsePhaseRef.current) * 0.22;
        const { x } = dots[i];
        circle.setAttribute(
          "transform",
          `translate(${x} ${y}) scale(${pulse}) translate(${-x} ${-y})`
        );
        circle.setAttribute("filter", "url(#journey-dot-glow)");
      } else {
        circle.removeAttribute("transform");
        circle.removeAttribute("filter");
      }
    }
  }, []);

  const tick = useCallback(
    (timestamp: number) => {
      updateDots(timestamp);
      rafIdRef.current = requestAnimationFrame(tick);
    },
    [updateDots]
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    scrollProgressRef.current = value;
  });

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const main = trailRef.current?.parentElement;
    if (!main) return;

    buildTrail();

    const onResize = () => buildTrail();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(main);
    window.addEventListener("resize", onResize);

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [buildTrail, tick]);

  return (
    <div
      ref={trailRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <svg
        ref={svgRef}
        className="block w-full"
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <filter
            id="journey-dot-glow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path ref={pathRef} d="" fill="none" stroke="none" />
        <g ref={dotsGroupRef} />
      </svg>
    </div>
  );
}
