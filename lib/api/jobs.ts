import { TJobListing } from "@/types/types";
import { API_BASE_URL } from "@/lib/api-client";

export const getJobs = async (): Promise<TJobListing[]> => {
  const res = await fetch(`${API_BASE_URL}/jobs`);
  const jobs: TJobListing[] = await res.json();

  return jobs;
};
