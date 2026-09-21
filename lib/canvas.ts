export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Sizes a canvas's backing store for the device pixel ratio (capped at 2). */
export function fitCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  return dpr;
}

/** Calls back with true/false as the element enters/leaves the viewport. */
export function watchVisibility(el: Element, cb: (visible: boolean) => void, rootMargin = '100px') {
  const io = new IntersectionObserver(([entry]) => cb(entry.isIntersecting), { rootMargin });
  io.observe(el);
  return () => io.disconnect();
}

/**
 * A requestAnimationFrame loop that can be started and stopped cheaply.
 * `frame` returns false when there is nothing left to animate, which parks
 * the loop until `wake()` is called again (e.g. on pointer movement).
 */
export function createLoop(frame: (time: number) => boolean) {
  let raf = 0;
  let running = false;
  let allowed = true;
  const tick = (t: number) => {
    if (!allowed) {
      running = false;
      return;
    }
    running = frame(t);
    if (running) raf = requestAnimationFrame(tick);
  };
  return {
    wake() {
      if (!running && allowed) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    },
    setAllowed(value: boolean) {
      allowed = value;
      if (value) this.wake();
      else cancelAnimationFrame(raf);
    },
    stop() {
      allowed = false;
      cancelAnimationFrame(raf);
    },
  };
}
