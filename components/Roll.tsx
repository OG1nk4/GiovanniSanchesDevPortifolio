/**
 * Text that rolls up to a copy of itself when its closest `.group` parent is
 * hovered. The copy is hidden from assistive tech.
 */
export function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="transition-transform duration-700 ease-out-expo group-hover:-translate-y-full">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-full transition-transform duration-700 ease-out-expo group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
