import { TJobData, TJobListing } from "@/types/types";

/**
 * Display formatters for job listings — reusable across
 * tables, cards and detail pages.
 */

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "€25 – €40 / hr" or "€90k – €115k / yr" (yearly values rendered in k) */
export const formatCompensation = (job: Pick<TJobData, "minSalary" | "maxSalary" | "salaryFrequency">) => {
  const min = Number(job.minSalary);
  const max = Number(job.maxSalary);

  const formatValue = (value: number) => {
    if (job.salaryFrequency === "per year" && value >= 1000) {
      return `€${Math.round(value / 1000)}k`;
    }
    return `€${value}`;
  };

  const frequencyLabel =
    job.salaryFrequency === "per hour"
      ? "hr"
      : job.salaryFrequency === "per day"
        ? "day"
        : job.salaryFrequency === "per month"
          ? "mo"
          : "yr";

  return `${formatValue(min)} – ${formatValue(max)} / ${frequencyLabel}`;
};

/** "Remote (New York, USA)" / "London, UK (Hybrid)" / "Berlin, Germany" */
export const formatLocation = (
  job: Pick<TJobData, "location" | "workMode">,
) => {
  if (job.workMode === "Remote") return `Remote (${job.location})`;
  if (job.workMode === "Hybrid") return `${job.location} (Hybrid)`;
  return job.location;
};

/** "2025-05-30" → "May 30, 2025" (deterministic, avoids locale/hydration drift) */
export const formatDeadline = (deadline: string) => {
  const [year, month, day] = deadline.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${String(day).padStart(2, "0")}, ${year}`;
};

/**
 * Strip listing-only fields (_id, postedAgo, isClosed) down to the core
 * TJobData shape — used to prefill edit forms.
 */
export const toJobData = (job: TJobListing): TJobData => ({
  title: job.title,
  companyName: job.companyName,
  jobCategory: job.jobCategory,
  jobType: job.jobType,
  location: job.location,
  deadline: job.deadline,
  salaryFrequency: job.salaryFrequency,
  minSalary: job.minSalary,
  maxSalary: job.maxSalary,
  status: job.status,
  workMode: job.workMode,
  applicants: job.applicants,
  requirements: job.requirements,
  responsibilities: job.responsibilities,
});
