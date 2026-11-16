"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, isSortValue } from "@/lib/job-utils";

/**
 * "Sort by: Most Recent" dropdown for the jobs archive page.
 *
 * Frontend-only logic: the sort order lives in the URL (?sort=...).
 * Option labels come from lib/job-utils so the Server Component page
 * can interpret the same values.
 */

export function SortBy() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = isSortValue(searchParams.get("sort") ?? undefined);

  const handleChange = (sort: string | null) => {
    if (!sort) return;
    // STEP: write the sort order into ?sort= → server page re-sorts
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    // sort changed → go back to the first page
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-muted-foreground sm:block">
        Sort by:
      </span>
      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger className="w-[190px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
