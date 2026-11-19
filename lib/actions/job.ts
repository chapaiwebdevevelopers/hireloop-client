import {
  TJobData,
  TJobActionResult,
  TApplyJob,
  TApplication,
  TApplicationStatus,
  TRawApplication,
} from "@/types/types"
import { API_BASE_URL } from "@/lib/api-client"

export const createJob = async (data: TJobData): Promise<TJobActionResult> => {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const result: TJobActionResult = await res.json()

  return result
}

export const deleteJob = async (jobId: string): Promise<TJobActionResult> => {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })
  const result: TJobActionResult = await res.json()

  return result
}

export const updateJob = async (
  jobId: string,
  data: TJobData
): Promise<TJobActionResult> => {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const result: TJobActionResult = await res.json()

  return result
}

export const ApplyToJob = async (data: TApplyJob) => {
  const res = await fetch(`${API_BASE_URL}/application`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

const APPLICATION_STATUSES: TApplicationStatus[] = [
  "Applied",
  "Review",
  "Shortlisted",
  "Rejected",
  "Offered",
]

/**
 * Older applications stored the job posting status (`Active`, `Draft`…)
 * instead of the application status. Fall back to "Applied" for those.
 */
const normalizeStatus = (status?: string): TApplicationStatus => {
  const value = status?.trim().toLowerCase()
  return (
    APPLICATION_STATUSES.find((s) => s.toLowerCase() === value) ?? "Applied"
  )
}

const normalizeWorkMode = (mode?: string): string => {
  const value = mode?.trim().toLowerCase()
  if (value === "remote") return "Remote"
  if (value === "hybrid") return "Hybrid"
  if (value === "on-site" || value === "onsite") return "On-site"
  return mode?.trim() || "—"
}

/** Reads the creation date stored in a MongoDB ObjectId (`_id`) */
const dateFromObjectId = (id?: string): Date | null => {
  if (!id || !/^[0-9a-f]{24}$/i.test(id)) return null
  const seconds = Number.parseInt(id.slice(0, 8), 16)
  const date = new Date(seconds * 1000)
  return Number.isNaN(date.getTime()) ? null : date
}

const timeAgo = (date: Date): string => {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`
  }

  if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months} month${months === 1 ? "" : "s"} ago`
  }

  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

/**
 * Newer applications are saved with `jobTitle`/`companyName`/`appliedAt`
 * and may not have `archived`; the seeded records use `title`/`company`/
 * `appliedAgo`/`archived`. Normalize both into one display shape.
 */
const normalizeApplication = (app: TRawApplication): TApplication => {
  const appliedAt = app.appliedAt ? new Date(app.appliedAt) : null
  const appliedDate =
    appliedAt && !Number.isNaN(appliedAt.getTime())
      ? appliedAt
      : dateFromObjectId(app._id)

  return {
    _id: app._id,
    id: app.id,
    userId: app.userId,
    email: app.email,
    title: app.title?.trim() || app.jobTitle?.trim() || "Untitled job",
    company:
      app.company?.trim() || app.companyName?.trim() || "Unknown company",
    jobType: app.jobType?.trim() || "—",
    workMode: normalizeWorkMode(app.workMode),
    appliedAgo:
      app.appliedAgo ?? (appliedDate ? timeAgo(appliedDate) : "Just now"),
    status: normalizeStatus(app.status),
    archived: app.archived ?? false,
  }
}

// show all applyjob According to User

export const getApplication = async (userapp = ""): Promise<TApplication[]> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/application${userapp ? `?${userapp}` : ""}`,
      { cache: "no-store" }
    )
    if (!res.ok) return []

    const data = await res.json()
    if (!Array.isArray(data)) return []

    return data.map((app: TRawApplication) => normalizeApplication(app))
  } catch {
    return []
  }
}
