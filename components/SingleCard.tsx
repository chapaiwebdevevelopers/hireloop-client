"use client";

import Link from "next/link";
import { Bookmark, Banknote, Briefcase, Flame, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";
import { formatCompensation, formatLocation } from "@/lib/job-utils";
import { TJobListing } from "@/types/types";

/**
 * One job card for the jobs archive grid — matches the reference design:
 * [logo] Title            [bookmark]
 *        Company • Location
 * [salary chip] [type chip] [Easy Apply chip]
 *
 * All values come from the API job record; nothing is hardcoded.
 */

type TSingleCardProps = {
  job: TJobListing;
};

/** Small pill with an icon, reused for the meta row */
function Chip({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground",
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function SingleCard({ job }: TSingleCardProps) {
  console.log("job",job)
  // Frontend-only toggle state for the bookmark icon
  const [bookmarked, setBookmarked] = useState(false);

  // HINT: "Hot Job" is temporarily derived from applicant volume —
  // STEP: later swap this for a real `isHot` / `featured` field from the API
  const isHot = job.applicants >= 100;

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Top row: logo, title + company/location, bookmark */}
      <div className="flex items-start gap-3">
        {/* HINT: placeholder logo box with the company initial —
            STEP: swap for a real company logo image when the API has one */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted text-lg font-semibold text-muted-foreground">
          {job.companyName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">
            <Link href={`/jobs/${job._id}`} className="hover:underline">
              {job.title}
            </Link>
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {job.companyName} • {formatLocation(job)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setBookmarked((prev) => !prev)}
          aria-label={bookmarked ? "Remove bookmark" : "Save job"}
          aria-pressed={bookmarked}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bookmark
            className={cn("size-5", bookmarked && "fill-current text-primary")}
          />
        </button>
      </div>

      {/* Bottom row: meta chips */}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Chip icon={<Banknote className="size-3.5" />}>
          {formatCompensation(job)}
        </Chip>
        <Chip icon={<Briefcase className="size-3.5" />}>{job.jobType}</Chip>
        {/* Amber "Hot Job" chip, as in the reference design */}
        {isHot && (
          <Chip
            icon={<Flame className="size-3.5" />}
            className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            Hot Job
          </Chip>
        )}
        {/* HINT: static chip for now —
            STEP: drive it from a real "easy apply" field from the API */}
        <Chip
          icon={<Zap className="size-3.5" />}
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
          Easy Apply
        </Chip>
      </div>
    </div>
  );
}
