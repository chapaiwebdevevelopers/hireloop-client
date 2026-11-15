/**
 * Shared domain types for the Job feature.
 * Framework-agnostic — imported by client forms, server pages and API helpers.
 */

/** Posting status of a job */
export type TJobStatus = "Active" | "Expired" | "Draft";

/** Where / how the job is performed */
export type TJobWorkMode = "Remote" | "Hybrid" | "On-site";

/**
 * Core job entity — the shape shared by the create/edit form,
 * the API layer and the listings table.
 */
export type TJobData = {
  companyName: string;
  deadline: string;
  jobCategory: string;
  jobType: string;
  location: string;
  maxSalary: number;
  minSalary: number;
  requirements: string;
  responsibilities: string;
  salaryFrequency: string;
  title: string;
  status: TJobStatus;
  workMode: TJobWorkMode;
  applicants: number;
};

/**
 * A job record as returned by the API — adds the MongoDB `_id`
 * plus display-only fields computed for the listings table.
 */
export type TJobListing = TJobData & {
  _id: string;
  postedAgo: string;
  isClosed?: boolean;
};

/** Loose shape of the job create/delete API responses */
export type TJobActionResult = {
  insertedId?: string;
  deletedCount?: number;
};
