import { TJobData, TJobListing } from "@/types/types"

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
]

/** "€25 – €40 / hr" or "€90k – €115k / yr" (yearly values rendered in k) */
export const formatCompensation = (
  job: Pick<TJobData, "minSalary" | "maxSalary" | "salaryFrequency">
) => {
  const min = Number(job.minSalary)
  const max = Number(job.maxSalary)

  const formatValue = (value: number) => {
    if (job.salaryFrequency === "per year" && value >= 1000) {
      return `€${Math.round(value / 1000)}k`
    }
    return `€${value}`
  }

  const frequencyLabel =
    job.salaryFrequency === "per hour"
      ? "hr"
      : job.salaryFrequency === "per day"
        ? "day"
        : job.salaryFrequency === "per month"
          ? "mo"
          : "yr"

  return `${formatValue(min)} – ${formatValue(max)} / ${frequencyLabel}`
}

/** "Remote (New York, USA)" / "London, UK (Hybrid)" / "Berlin, Germany" */
export const formatLocation = (
  job: Pick<TJobData, "location" | "workMode">
) => {
  if (job.workMode === "Remote") return `Remote (${job.location})`
  if (job.workMode === "Hybrid") return `${job.location} (Hybrid)`
  return job.location
}

/** "2025-05-30" → "May 30, 2025" (deterministic, avoids locale/hydration drift) */
export const formatDeadline = (deadline: string) => {
  const [year, month, day] = deadline.split("-").map(Number)
  return `${MONTH_NAMES[month - 1]} ${String(day).padStart(2, "0")}, ${year}`
}

/**
 * Sort options for the jobs archive page.
 * Lives here (not in a "use client" file) so the Server Component page
 * can read the ?sort= param too.
 */
export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary-desc", label: "Salary: High to Low" },
  { value: "salary-asc", label: "Salary: Low to High" },
] as const

export type TSortValue = (typeof SORT_OPTIONS)[number]["value"]

/** Falls back to "recent" for any missing/unknown ?sort= value */
export const isSortValue = (value: string | undefined): TSortValue =>
  (SORT_OPTIONS.find((option) => option.value === value)?.value ??
    "recent") as TSortValue

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
  description: job.description ?? "",
  requirements: job.requirements,
  responsibilities: job.responsibilities,
})

export const timeAgo = (value?: string | Date | null): string => {
  if (!value) return "—"

  const date = value instanceof Date ? value : new Date(value)
  const time = date.getTime()
  if (Number.isNaN(time)) return "—"

  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000))
  const plural = (n: number, unit: string) =>
    `${n} ${unit}${n === 1 ? "" : "s"} ago`

  if (seconds < 60) return "Just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return plural(minutes, "minute")

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return plural(hours, "hour")

  const days = Math.floor(hours / 24)
  if (days < 7) return plural(days, "day")

  const weeks = Math.floor(days / 7)
  if (days < 30) return plural(weeks, "week")

  const months = Math.floor(days / 30)
  if (days < 365) return plural(months, "month")

  return plural(Math.floor(days / 365), "year")
}
