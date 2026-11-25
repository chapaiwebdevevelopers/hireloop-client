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
  _id?: string
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
  userId:string
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
  "Applied" | "Review" | "interviews"| "Shortlisted" | "Rejected" | "Offered"

/** Payload written to the API when a seeker applies for a job */
export type TApplyJob = {
  _id?: string
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
 * Unified application row used across the application and API
 */
export type TApplication = {
  _id: string
  id?: number
  jobId?: string
  userId: string
  email: string
  name?: string
  applicantName?: string
  title: string
  company: string
  jobType: string
  workMode: string
  status: TApplicationStatus
  archived: boolean
  appliedAt: string
  resumeUrl?: string
  Deadline?: string
  // Legacy aliases for backward compatibility with older database documents
  jobTitle?: string
  companyName?: string
}
