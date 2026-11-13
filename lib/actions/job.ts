import { TJobData, TJobActionResult } from "@/types/types";
import { API_BASE_URL } from "@/lib/api-client";

export const createJob = async (data: TJobData): Promise<TJobActionResult> => {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: TJobActionResult = await res.json();

  return result;
};

export const deleteJob = async (jobId: string): Promise<TJobActionResult> => {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  });
  const result: TJobActionResult = await res.json();

  return result;
};

export const updateJob = async (
  jobId: string,
  data: TJobData,
): Promise<TJobActionResult> => {
  const res = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: TJobActionResult = await res.json();

  return result;
};
