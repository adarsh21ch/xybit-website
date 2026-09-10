// Animates a stat's digits up to its value when it scrolls into view.
//
// Purely additive: the element already renders its correct final text
// server-side, and the animation always lands back on that exact string.
// If this never runs (JS blocked, reduced motion, observer quirk), the
// right number is already on screen — nothing here is load-bearing.

const PARTS = /^([^0-9]*)([\d,]+(?:\.\d+)?)(.*)$/;

function animate(el: HTMLElement, prefix: string, target: number, suffix: string, decimals: number, grouped: boolean) {
  const duration = 1100;
  const start = performance.now();
  const format = (n: number) => {
    const fixed = n.toFixed(decimals);
    const withGroups = grouped
      ? Number(fixed).toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : fixed;
    return `${prefix}${withGroups}${suffix}`;
  };

  const frame = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    // easeOutExpo — fast start, soft landing
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = format(target * eased);
    if (t < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function initCountUp(selector = "[data-countup]") {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!els.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);

        const match = el.textContent?.trim().match(PARTS);
        if (!match) continue;
        const [, prefix, rawNumber, suffix] = match;
        const grouped = rawNumber.includes(",");
        const decimals = rawNumber.includes(".") ? rawNumber.split(".")[1].length : 0;
        const target = parseFloat(rawNumber.replace(/,/g, ""));
        if (!Number.isFinite(target)) continue;

        animate(el, prefix, target, suffix, decimals, grouped);
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}
