import { TJobData, TJobStatus, TJobWorkMode } from "@/types/types";

/**
 * Shared option lists & defaults for the Job feature.
 * Single source of truth — form selects/radios and any future
 * filters should import from here instead of redefining values.
 */

export const JOB_CATEGORIES: string[] = [
  "HireLoop Network",
  "Engineering & Tech",
  "Design & Creative",
  "Marketing & Sales",
  "Customer Support",
  "Finance & Accounting",
  "Healthcare",
  "Education & Training",
];

export const JOB_TYPES: string[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const SALARY_FREQUENCIES: string[] = [
  "per hour",
  "per day",
  "per month",
  "per year",
];

export const WORK_MODES: TJobWorkMode[] = ["Remote", "Hybrid", "On-site"];

export const JOB_STATUSES: TJobStatus[] = ["Active", "Expired", "Draft"];

/** Default state used to initialise & reset job forms */
export const INITIAL_JOB_DATA: TJobData = {
  title: "",
  companyName: "",
  jobCategory: "",
  jobType: "Full-time",
  status: "Active",
  workMode: "Remote",
  location: "",
  deadline: "",
  salaryFrequency: "per hour",
  minSalary: 0,
  maxSalary: 0,
  applicants: 0, // not collected in the form — new posts always start with 0
  responsibilities: "",
  requirements: "",
};
