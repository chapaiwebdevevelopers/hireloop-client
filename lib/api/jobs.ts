import { TJobListing } from "@/types/types";
import { API_BASE_URL } from "@/lib/api-client";

export const getJobs = async (query = ''): Promise<TJobListing[]> => {
  const res = await fetch(`${API_BASE_URL}/jobs?${query}`);
  const jobs: TJobListing[] = await res.json();

  return jobs;
};
/** get all jobs by user */
// export const getAllJobsByUser = async (id: string): Promise<TJobListing> => {
//   const res = await fetch(`${API_BASE_URL}/jobs/users/${id}`);
 
//   return res.json();
// };

/** Returns a single job, or null when the id is unknown / the API fails */
export const getJobsById = async (id: string): Promise<TJobListing | null> => {
  const res = await fetch(`${API_BASE_URL}/jobs/${id}`);
  if (!res.ok) return null;
  return res.json();
};

// Count applied job by the user 
export const CountAppliedJob =  async (query = ''): Promise<{count:number}> => {
  const res = await fetch(`${API_BASE_URL}/application/count?${query}`);
 return res.json()
};