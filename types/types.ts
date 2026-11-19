/**
 * Shared domain types for the Job feature.
 * Framework-agnostic — imported by client forms, server pages and API helpers.
 */

/** Posting status of a job */
export type TJobStatus = "Active" | "Expired" | "Draft" | "Closed"

/** Where / how the job is performed */
export type TJobWorkMode = "Remote" | "Hybrid" | "On-site"

/**
 * Core job entity — the shape shared by the create/edit form,
 * the API layer and the listings table.
 */
export type TJobData = {
  _id: string
  companyName: string
  deadline: string
  jobCategory: string
  jobType: string
  location: string
  maxSalary: number
  minSalary: number
  requirements: string
  responsibilities: string
  /** Short overview paragraph shown at the top of the details page */
  description: string
  salaryFrequency: string
  title: string
  status: TJobStatus
  workMode: TJobWorkMode
  applicants: number
}

/**
 * A job record as returned by the API — adds the MongoDB `_id`
 * plus display-only fields computed for the listings table.
 */
export type TJobListing = TJobData & {
  postedAgo: string
  isClosed?: boolean
}

/** Loose shape of the job create/delete/update API responses */
export type TJobActionResult = {
  insertedId?: string
  deletedCount?: number
  modifiedCount?: number
  acknowledged?: boolean
}

/** Lifecycle of a job application */
export type TApplicationStatus =
  "Applied" | "Review" | "Shortlisted" | "Rejected" | "Offered"

/** Payload written to the API when a seeker applies for a job */
export type TApplyJob = {
  jobId: string
  userId: string
  email: string
  title: string
  company: string
  jobType: string
  workMode: string
  status: TApplicationStatus
  Deadline: string
  archived: boolean
  appliedAt: string
}

/**
 * Application row exactly as it comes back from the API.
 * Older records were saved with a different shape, so every display
 * field is optional here and normalized into `TApplication` on read.
 */
export type TRawApplication = {
  _id: string
  id?: number
  userId: string
  email: string
  title?: string
  company?: string
  jobTitle?: string
  companyName?: string
  jobType?: string
  workMode?: string
  appliedAgo?: string
  appliedAt?: string
  status?: string
  archived?: boolean
  Deadline?: string
  jobId?: string
}

/** Normalized application row used by the UI */
export type TApplication = {
  _id: string
  id?: number
  userId: string
  email: string
  title: string
  company: string
  jobType: string
  workMode: string
  appliedAgo: string
  status: TApplicationStatus
  archived: boolean
}
