// ---------------------------------------------------------------------------
// Client behaviour for /news and /events: category filter, copy-link button
// and event countdowns. Everything degrades cleanly without JS: all cards
// show, share links still work, and countdown badges simply stay empty.
//
// A module script evaluates once per full page load, so the delegated click
// listeners below are bound once and outlive ClientRouter navigations. The
// countdown re-runs on every `astro:page-load` to pick up the new page.
// ---------------------------------------------------------------------------

// ---- Category filter (news grid) ----
document.addEventListener("click", (e) => {
  const chip = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-filter]");
  if (!chip) return;
  const bar = chip.closest("[data-filter-bar]");
  const grid = document.querySelector<HTMLElement>("[data-filter-grid]");
  if (!bar || !grid) return;

  const value = chip.dataset.filter!;
  bar.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((c) =>
    c.setAttribute("aria-pressed", String(c === chip)),
  );

  let shown = 0;
  grid.querySelectorAll<HTMLElement>(".post-card").forEach((card) => {
    const match = value === "all" || card.dataset.category === value;
    card.hidden = !match;
    if (match) {
      shown++;
      // Cards revealed by scroll may not have animated in yet; once the layout
      // shifts their triggers are stale, so show them directly.
      card.style.opacity = "1";
      card.style.transform = "none";
    }
  });

  const status = document.querySelector("[data-filter-status]");
  if (status) status.textContent = `Showing ${shown} article${shown === 1 ? "" : "s"}`;
});

// ---- Copy link ----
document.addEventListener("click", async (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy-link]");
  if (!btn) return;
  const status = btn.closest(".share")?.querySelector("[data-share-status]");
  try {
    await navigator.clipboard.writeText(btn.dataset.copyLink!);
    if (status) status.textContent = "Link copied to clipboard";
  } catch {
    if (status) status.textContent = "Copy failed: select the address bar instead";
  }
  window.setTimeout(() => { if (status) status.textContent = ""; }, 2600);
});

// ---- Event countdowns ----
// Computed against the visitor's own calendar day, so the badge stays right
// between site rebuilds even though upcoming/past is decided at build time.
const DAY = 86_400_000;
const localDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).valueOf();
};

function countdowns() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();

  document.querySelectorAll<HTMLElement>("[data-countdown]").forEach((el) => {
    const start = localDay(el.dataset.start!);
    const end = localDay(el.dataset.end ?? el.dataset.start!);
    const days = Math.round((start - today) / DAY);

    let state: "soon" | "live" | "past";
    let text: string;
    if (today > end) { state = "past"; text = "Event ended"; }
    else if (today >= start) { state = "live"; text = start === end ? "Happening today" : "Happening now"; }
    else { state = "soon"; text = days === 1 ? "Tomorrow" : `In ${days} days`; }

    el.textContent = text;
    el.dataset.state = state;
  });

  // On an event page, hide registration once the visitor's date is past the end.
  const page = document.querySelector<HTMLElement>("[data-event-end]");
  if (page && today > localDay(page.dataset.eventEnd!)) {
    page.querySelectorAll<HTMLElement>("[data-upcoming-only]").forEach((n) => (n.hidden = true));
  }
}

countdowns();
document.addEventListener("astro:page-load", countdowns);
