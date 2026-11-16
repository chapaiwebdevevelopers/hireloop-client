"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { TJobListing } from "@/types/types";
import {
  JOB_CATEGORIES,
  JOB_STATUSES,
  JOB_TYPES,
  WORK_MODES,
} from "@/lib/constants";

/**
 * Filter sidebar for the jobs archive page.
 *
 * Filters: jobType, workMode, jobCategory, status.
 * Single-select per section: you can mark ONE item in each filter, and
 * the other options always stay visible + clickable to switch (or click
 * the marked one again to clear). Option lists come from
 * lib/constants.ts (shared source of truth) so nothing ever disappears.
 *
 * Frontend-only logic: counts are computed from the fetched jobs and the
 * selection is written into the URL (?jobType=Full-time) so the Server
 * Component page re-renders. No backend code is touched here.
 */

type TFilterSidebarProps = {
  /** All jobs returned by the API — used to compute the counts */
  jobs: TJobListing[];
};

/** Filter sections config — option lists from lib/constants.ts */
const FILTER_SECTIONS = [
  { key: "jobType", title: "Job Type", options: JOB_TYPES },
  { key: "workMode", title: "Work Mode", options: WORK_MODES },
  { key: "jobCategory", title: "Category", options: JOB_CATEGORIES },
  { key: "status", title: "Status", options: JOB_STATUSES },
] as const;

console.log("filtersidebar FILTER_SECTIONS",FILTER_SECTIONS)
/** "1234" → "1.2k", "432" → "432" — matches the reference design counts */
const formatCount = (count: number) =>
  count >= 1000
    ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
    : String(count);

export function FilterSidebar({ jobs }: TFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Selects ONE value per section (click again to deselect, or click
   *  another option to switch) and pushes the new URL */
  const toggleValue = (key: string, value: string, selected: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    // single-select: only keep the clicked value, and only if it's new
    if (!selected.includes(value)) params.append(key, value);
    // filters changed → go back to the first page
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="rounded-xl border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="space-y-6">
        {FILTER_SECTIONS.map((section) => {
          // Selected values come straight from the URL
          const selected = searchParams.getAll(section.key);
          // console.log("selected value come from ulr",selected)

          return (
            <fieldset key={section.key} className="space-y-2">
              <legend className="mb-1 text-sm font-medium">
                {section.title}
              </legend>
              {section.options.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted/50"
                >
                  <span className="flex items-center gap-2">
                    <Checkbox
                      checked={selected.includes(option)}
                      onCheckedChange={() =>
                        toggleValue(section.key, option, selected)
                      }
                    />
                    {option}
                  </span>
                  {/* Count computed from the fetched jobs — 0 stays visible */}
                  <span className="text-xs text-muted-foreground">
                    {formatCount(
                      jobs.filter((job) => job[section.key] === option).length,
                    )}
                  </span>
                </label>
              ))}
            </fieldset>
          );
        })}
      </div>
    </aside>
  );
}
