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
  const v0 = document.getElementById("heroVid0") as HTMLVideoElement | null;
  const v1 = document.getElementById("heroVid1") as HTMLVideoElement | null;
  if (!v0 || !v1) return;
  if (reduced()) { v0.style.display = "none"; v1.style.display = "none"; return; }

  gsap.set(v0, { opacity: 1 });

  const crossfade = (from: HTMLVideoElement, to: HTMLVideoElement) => {
    to.play();
    gsap.to(to, { opacity: 1, duration: 1.5, ease: "power2.inOut" });
    gsap.to(from, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
  };

  const onV0Ended = () => crossfade(v0, v1);
  const onV1Ended = () => crossfade(v1, v0);
  v0.addEventListener("ended", onV0Ended);
  v1.addEventListener("ended", onV1Ended);
  cleanups.push(() => {
    v0.removeEventListener("ended", onV0Ended);
    v1.removeEventListener("ended", onV1Ended);
  });
}

function heroSequence() {
  if (reduced()) return; // reduced-motion CSS already reveals everything
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
