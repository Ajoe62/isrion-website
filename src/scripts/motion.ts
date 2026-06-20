// ---------------------------------------------------------------------------
// Motion layer — Lenis smooth scroll + GSAP/ScrollTrigger choreography.
// Imported once from BaseLayout; the listeners below re-run setup on every
// page (works with Astro's View Transitions / ClientRouter).
// ---------------------------------------------------------------------------
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;          // created once, persists across pages
let cleanups: Array<() => void> = [];    // per-page listeners/animations to tear down
let booted = false;

function initLenis() {
  if (reduced() || lenis) return;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function smoothAnchors() {
  const handler = (e: Event) => {
    const a = (e.currentTarget as HTMLAnchorElement);
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (target && lenis) { e.preventDefault(); lenis.scrollTo(target as HTMLElement, { offset: -10 }); }
  };
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
  links.forEach((l) => l.addEventListener("click", handler));
  cleanups.push(() => links.forEach((l) => l.removeEventListener("click", handler)));
}

function counters() {
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const end = Number(el.dataset.count || 0);
    if (reduced()) { el.textContent = String(end); return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) });
  });
}

function heroVideo() {
  const vids = Array.from(document.querySelectorAll<HTMLVideoElement>(".hero-vid"));
  if (!vids.length) return;
  if (reduced()) { vids.forEach((v) => (v.style.display = "none")); return; }

  gsap.set(vids[0], { opacity: 1 });
  let current = 0;

  // Each clip cross-fades to the next when it ends, wrapping back to the first.
  // Videos use preload="none" (except the first), so we kick off a load just
  // before a clip is needed to keep the rotation seamless without loading all
  // of them up front.
  const advance = (from: number) => {
    const to = (from + 1) % vids.length;
    vids[to].play();
    gsap.to(vids[to], { opacity: 1, duration: 1.5, ease: "power2.inOut" });
    gsap.to(vids[from], {
      opacity: 0, duration: 1.5, ease: "power2.inOut",
      onComplete: () => { vids[from].pause(); vids[from].currentTime = 0; },
    });
    current = to;
    vids[(to + 1) % vids.length].load(); // warm up the clip after next
  };

  const handlers = vids.map((v, i) => {
    const onEnded = () => { if (i === current) advance(i); };
    v.addEventListener("ended", onEnded);
    return { v, onEnded };
  });
  vids[1 % vids.length]?.load(); // warm up the second clip

  cleanups.push(() => handlers.forEach(({ v, onEnded }) => v.removeEventListener("ended", onEnded)));
}

function heroSequence() {
  if (reduced()) return; // reduced-motion CSS already reveals everything
  if (!document.querySelector(".hero [data-mask]")) return; // home-only video hero
  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
  tl.to(".hero [data-mask] > *", { y: 0, duration: 1.05, stagger: 0.12 })
    .from(".hero .eyebrow", { opacity: 0, y: 14, duration: 0.6 }, 0)
    .to(".hero [data-reveal]", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, onStart: counters }, "-=.7");
}

function reveals() {
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    if (el.closest(".hero")) return; // hero handled by its own timeline
    if (reduced()) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%" } });
  });
}

// Background-image parallax. data-parallax="0.18" → element drifts at that
// fraction of scroll distance. Elements are oversized in CSS so edges never show.
function parallax() {
  if (reduced()) return;
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const amt = Number(el.dataset.parallax || 0.2);
    gsap.fromTo(el, { yPercent: -amt * 50 }, {
      yPercent: amt * 50, ease: "none",
      scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });
}

// Count-up for [data-count] outside the home hero (e.g. the About stats band),
// triggered when each number scrolls into view.
function scrollCounters() {
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    if (el.closest(".hero")) return; // home hero handled by heroSequence
    const end = Number(el.dataset.count || 0);
    if (reduced()) { el.textContent = String(end); return; }
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(o.v))) });
      },
    });
  });
}

function capabilities() {
  const track = document.getElementById("hTrack");
  const bar = document.getElementById("capBar");
  if (!track) return;

  if (window.innerWidth > 900 && !reduced()) {
    const dist = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: ".cap", start: "top top", end: () => "+=" + dist(),
        scrub: 0.8, pin: true, invalidateOnRefresh: true,
        onUpdate: (s) => { if (bar) bar.style.width = (12.5 + s.progress * 87.5) + "%"; },
      },
    });
  } else {
    // mobile / reduced: drag-to-scroll
    const outer = track.parentElement as HTMLElement;
    outer.style.overflowX = "auto";
    let down = false, sx = 0, sl = 0;
    const dn = (e: PointerEvent) => { down = true; sx = e.pageX; sl = outer.scrollLeft; };
    const up = () => (down = false);
    const mv = (e: PointerEvent) => { if (down) outer.scrollLeft = sl - (e.pageX - sx); };
    outer.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    outer.addEventListener("pointermove", mv);
    cleanups.push(() => { outer.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); outer.removeEventListener("pointermove", mv); });
  }
}

function navState() {
  const nav = document.getElementById("nav");
  const menu = document.getElementById("menu");
  if (!nav) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    nav.classList.toggle("hidden", y > 500 && y > last && !(menu?.classList.contains("open")));
    last = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener("scroll", onScroll));
}

function burger() {
  const b = document.getElementById("burger");
  const menu = document.getElementById("menu");
  if (!b || !menu) return;
  const toggle = () => { b.classList.toggle("x"); menu.classList.toggle("open"); };
  const close = () => { b.classList.remove("x"); menu.classList.remove("open"); };
  b.addEventListener("click", toggle);
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

function contour() {
  const cv = document.getElementById("contour") as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  let t = 0, raf = 0, active = true;
  const size = () => {
    const d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = window.innerWidth * d; cv.height = cv.offsetHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  const draw = () => {
    const H = cv.offsetHeight, lines = 18;
    ctx.clearRect(0, 0, window.innerWidth, H);
    for (let i = 0; i < lines; i++) {
      const p = i / lines, y0 = H * p;
      ctx.beginPath();
      for (let x = 0; x <= window.innerWidth; x += 14) {
        const y = y0 + Math.sin(x * 0.004 + t * 0.6 + i * 0.5) * 22 * (0.4 + p) + Math.cos(x * 0.0016 - t * 0.3) * 16;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      const a = 0.05 + 0.1 * Math.sin(i * 0.6 + t * 0.4);
      ctx.strokeStyle = i % 4 === 0 ? `rgba(62,203,124,${a + 0.05})` : `rgba(79,155,255,${a})`;
      ctx.lineWidth = 1; ctx.stroke();
    }
    t += 0.02;
  };
  const loop = () => { if (active) draw(); raf = requestAnimationFrame(loop); };
  size();
  window.addEventListener("resize", size);
  const io = new IntersectionObserver((e) => (active = e[0].isIntersecting), { threshold: 0 });
  io.observe(cv);
  if (reduced()) draw(); else loop();
  cleanups.push(() => { cancelAnimationFrame(raf); window.removeEventListener("resize", size); io.disconnect(); });
}

function setup() {
  document.querySelectorAll<HTMLElement>("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
  initLenis();
  smoothAnchors();
  burger();
  navState();
  contour();
  heroVideo();
  heroSequence();
  reveals();
  parallax();
  scrollCounters();
  capabilities();
  ScrollTrigger.refresh();
}

function teardown() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  ScrollTrigger.getAll().forEach((s) => s.kill());
}

function boot() { if (booted) return; booted = true; setup(); }

// Runs on first load (with or without View Transitions) and on every navigation.
document.addEventListener("DOMContentLoaded", boot);
document.addEventListener("astro:page-load", boot);
document.addEventListener("astro:before-swap", () => { teardown(); booted = false; });
