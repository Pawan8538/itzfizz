"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatCard from "./StatCard";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZFIZZ".split("");

const STATS = [
    { id: "s1", value: "58%", label: "Increase in pick up point use", bg: "#def54f", textColor: "#111", style: { top: "5%", right: "30%" } },
    { id: "s2", value: "23%", label: "Decreased in customer phone calls", bg: "#6ac9ff", textColor: "#111", style: { bottom: "5%", right: "38%" } },
    { id: "s3", value: "27%", label: "Increase in pick up point use", bg: "#333", textColor: "#fff", style: { top: "5%", right: "5%" } },
    { id: "s4", value: "40%", label: "Decreased in customer phone calls", bg: "#fa7328", textColor: "#111", style: { bottom: "5%", right: "8%" } },
];

const STAT_THRESHOLDS = [0.25, 0.45, 0.65, 0.85];

export default function HeroSection() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const roadRef = useRef(null);
    const carRef = useRef(null);
    const trailRef = useRef(null);
    const lettersRef = useRef([]);

    useEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        const road = roadRef.current;
        const car = carRef.current;
        const trail = trailRef.current;

        // Load: stagger headline letters
        gsap.timeline({ defaults: { ease: "power3.out" } }).fromTo(
            lettersRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.04, duration: 0.5 }
        );

        let ctx;
        const raf = requestAnimationFrame(() => {
            ctx = gsap.context(() => {
                const roadWidth = road.offsetWidth;
                const carWidth = car.offsetWidth;
                // Car travels from 0 to 70% past the right edge
                const travelDist = roadWidth - carWidth * 0.2;

                const letterEls = lettersRef.current;
                const roadLeft = road.getBoundingClientRect().left;
                const letterOffsets = letterEls.map((el) => {
                    const r = el.getBoundingClientRect();
                    return r.left - roadLeft + r.width / 2;
                });

                ScrollTrigger.create({
                    trigger: section,
                    start: "top top",
                    end: "bottom top",
                    pin: track,
                    scrub: 1.5,
                    onUpdate(self) {
                        const p = self.progress;

                        const carX = p * travelDist;
                        gsap.set(car, { x: carX });

                        const carCenter = carX + carWidth / 2;
                        const trailScale = Math.min(1, carCenter / roadWidth);
                        gsap.set(trail, { scaleX: trailScale, transformOrigin: "left center" });

                        letterEls.forEach((el, i) => {
                            el.style.opacity = carCenter >= letterOffsets[i] ? "1" : "0";
                        });

                        STATS.forEach((stat, i) => {
                            const fade = (p - STAT_THRESHOLDS[i]) / 0.1;
                            const opacity = Math.min(1, Math.max(0, fade));
                            const el = document.getElementById(stat.id);
                            if (!el) return;
                            el.style.opacity = String(opacity);
                            // Slide up + scale as they appear
                            const t = Math.min(1, Math.max(0, fade));
                            el.style.transform = `translateY(${(1 - t) * 30}px) scale(${0.9 + t * 0.1})`;
                        });
                    },
                });

                window.addEventListener("resize", () => ScrollTrigger.refresh());
            }, sectionRef);
        });

        return () => {
            cancelAnimationFrame(raf);
            ctx?.revert();
        };
    }, []);

    return (
        <>
            <div ref={sectionRef} className="relative" style={{ height: "200vh", background: "#121212" }}>
                <div
                    ref={trackRef}
                    className="sticky top-0 h-screen w-full flex items-center justify-center"
                    style={{ background: "#d1d1d1" }}
                >
                    {/* Road */}
                    <div
                        ref={roadRef}
                        className="relative w-full overflow-hidden"
                        style={{ height: 200, background: "#1e1e1e" }}
                    >
                        {/* Trail */}
                        <div
                            ref={trailRef}
                            className="absolute inset-y-0 left-0 w-full z-[1]"
                            style={{ background: "#45db7d", transformOrigin: "left center", transform: "scaleX(0)" }}
                        />

                        {/* Car */}
                        <img
                            ref={carRef}
                            src="/car.png"
                            alt="car"
                            className="absolute top-0 left-0 z-10"
                            style={{ height: 200, willChange: "transform" }}
                        />

                        {/* Headline — centered vertically inside road, spread across width */}
                        <div
                            className="absolute inset-0 flex items-center justify-center z-[5]"
                            style={{ gap: "1.8vw", paddingLeft: "3%", paddingRight: "3%" }}
                        >
                            {HEADLINE.map((char, i) => (
                                <span
                                    key={i}
                                    ref={(el) => { if (el) lettersRef.current[i] = el; }}
                                    style={{
                                        fontFamily: "Bebas Neue, sans-serif",
                                        fontSize: "clamp(3rem, 8vw, 9rem)",
                                        fontWeight: "bold",
                                        color: "#111",
                                        opacity: 0,
                                        lineHeight: 1,
                                        flexShrink: 0,
                                    }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stat cards */}
                    {STATS.map((s) => (
                        <StatCard key={s.id} {...s} />
                    ))}
                </div>
            </div>

            {/* Below hero */}
            <div
                className="flex items-center justify-center"
                style={{ height: "100vh", background: "#121212" }}
            >
                <p
                    className="text-2xl tracking-widest uppercase"
                    style={{ fontFamily: "Bebas Neue, sans-serif", color: "#333" }}
                >
                    ITZFIZZ
                </p>
            </div>
        </>
    );
}
