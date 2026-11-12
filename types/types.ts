export type jobStatus = "Active" | "Expired" | "Draft"
export type JobWorkMode = 'Remote' | 'Hybrid' | 'On-site'

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
  workMode: JobWorkMode;
  applicants: number;
  status: jobStatus;
};