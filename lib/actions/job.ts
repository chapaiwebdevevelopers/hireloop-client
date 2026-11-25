import {
  TJobData,
  TJobActionResult,
  TApplyJob,
  TApplication,
  TApplicationStatus,
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

/**
 * Get all applicants for a specific jobId (applications submitted via ApplyToJob)
 */
export const getApplicantsByJobId = async (
  jobId: string
): Promise<TApplyJob[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/application?jobId=${jobId}`, {
      cache: "no-store",
    })
    if (!res.ok) return []

    const data = await res.json()
    if (!Array.isArray(data)) return []

    return data
  } catch (error) {
    console.error("Error fetching applicants by jobId:", error)
    return []
  }
}

/** Alias for getApplicantsByJobId */
export const getApplyJobByJobId = getApplicantsByJobId

/**
 * Update application status in the database
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: TApplicationStatus
) => {
  try {
    const res = await fetch(`${API_BASE_URL}/application/${applicationId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
    return res.json()
  } catch (error) {
    console.error("Error updating application status:", error)
    return null
  }
}

/**
 * Check if a specific user has already applied for a specific job
 */
export const checkUserApplied = async (
  userId: string,
  jobId: string
): Promise<boolean> => {
  if (!userId || !jobId) return false
  try {
    const res = await fetch(
      `${API_BASE_URL}/application?userId=${userId}&jobId=${jobId}`,
      { cache: "no-store" }
    )
    if (!res.ok) return false
    const data = await res.json()
    if (!Array.isArray(data)) return false
    return data.some((app: Partial<TApplyJob>) => app.jobId === jobId)
  } catch (error) {
    console.error("Error checking user application:", error)
    return false
  }
}

const APPLICATION_STATUSES: TApplicationStatus[] = [
  "Applied",
  "Review",
  "interviews",
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

/**
 * Resolves the moment the application was created. Newer records store
 * `appliedAt`; older ones only have the creation time inside the ObjectId.
 */
const resolveAppliedAt = (app: Partial<TApplication>): Date => {
  const parsed = app.appliedAt ? new Date(app.appliedAt) : null
  if (parsed && !Number.isNaN(parsed.getTime())) return parsed
  return dateFromObjectId(app._id) ?? new Date()
}

/**
 * Newer applications are saved with `jobTitle`/`companyName`/`appliedAt`
 * and may not have `archived`; the seeded records use `title`/`company`/
 * `appliedAgo`/`archived`. Normalize both into one display shape.
 */
const normalizeApplication = (app: Partial<TApplication>): TApplication => {
  return {
    _id: app._id || "",
    id: app.id,
    jobId: app.jobId,
    userId: app.userId || "",
    email: app.email || "",
    name: app.name || app.applicantName,
    applicantName: app.applicantName || app.name,
    title: app.title?.trim() || app.jobTitle?.trim() || "Untitled job",
    company:
      app.company?.trim() || app.companyName?.trim() || "Unknown company",
    jobType: app.jobType?.trim() || "—",
    workMode: normalizeWorkMode(app.workMode),
    status: normalizeStatus(app.status),
    archived: app.archived ?? false,
    appliedAt: resolveAppliedAt(app).toISOString(),
    resumeUrl: app.resumeUrl,
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

    return data.map((app: Partial<TApplication>) => normalizeApplication(app))
  } catch {
    return []
  }
}
