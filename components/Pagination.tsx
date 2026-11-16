"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "cn";

/**
 * Numbered pagination for the jobs archive page.
 *
 * Frontend-only logic: the current page lives in the URL (?page=2) so the
 * Server Component page re-slices the fetched jobs. No backend code here.
 */

type TPaginationProps = {
  currentPage: number;
  totalPages: number;
};

/** Builds the "1 2 3 … 42" page list with ellipsis gaps */
const buildPageList = (current: number, total: number): (number | "…")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [];
  const push = (value: number | "…") => {
    if (pages[pages.length - 1] !== value) pages.push(value);
  };

  push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) push("…");
  for (let page = start; page <= end; page++) push(page);
  if (end < total - 1) push("…");
  push(total);

  return pages;
};

export function Pagination({ currentPage, totalPages }: TPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    // STEP: write the target page into ?page= → server page re-slices
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav
      aria-label="Job pages"
      className="flex items-center justify-center gap-1 pt-2"
    >
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>

      {buildPageList(currentPage, totalPages).map((page, index) =>
        page === "…" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-8 items-center justify-center text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "flex size-8 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted",
              page === currentPage
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary"
                : "",
            )}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
