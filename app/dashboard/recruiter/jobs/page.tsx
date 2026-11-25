import Link from "next/link";
import { BriefcaseBusiness, Ellipsis, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteJobsDialog } from "@/app/components/DeleteDialogue";
import { JobStatusBadge } from "@/app/components/JobStatusBadge";
import { UpdateJobDialog } from "@/app/components/UpdateJobDialog";
import { TJobListing } from "@/types/types";
import {
  formatCompensation,
  formatDeadline,
  formatLocation,
} from "@/lib/job-utils";
import {
  pageContainerClass,
  tableHeaderClass,
  tableCellClass,
  colTypeClass,
  colCompensationClass,
  colApplicantsClass,
  colDeadlineClass,
} from "@/lib/styles";
import {  getJobs } from "@/lib/api/jobs";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api-client";


// Update (opens reusable JobForm in a dialog popup) → Delete (icon) → three-dot overflow menu
const JobRowActions = ({
  isClosed,
  job,
}: {
  isClosed?: boolean;
  job: TJobListing;
}) => (
  <div className="flex items-center gap-1">
    <UpdateJobDialog job={job} />
    <DeleteJobsDialog job={job} />
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="More options" />
        }
      >
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem>
          <Link href={`/dashboard/recruiter/jobs/${job._id}/applications`}>View applicants</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/jobs/${job._id}`}>Visit Job</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Mark as closed</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {isClosed && (
      <span className="ml-1 text-xs text-muted-foreground">Closed</span>
    )}
  </div>
);

const ManageJobsPage = async () => {
   const session = await auth.api.getSession({
        headers: await headers()
    })
    console.log("session:",session)
  // const jobListings = await getAllJobsByUser(session?.user.id);
  const userId = session?.user.id;
  const jobListings = userId ? await getJobs(`userId=${userId}`) : [];
  const jobs: TJobListing[] = Array.isArray(jobListings)
    ? jobListings
    : [jobListings];
  console.log("joblisting data",jobListings)

  // Fetch real applicant counts for each job from MongoDB
  const applicantCounts = await Promise.all(
    jobs.map(async (job) => {
      if (!job._id) return { jobId: "", count: 0 };
      try {
        const res = await fetch(`${API_BASE_URL}/application?jobId=${job._id}`, {
          cache: "no-store",
        });
        if (!res.ok) return { jobId: job._id, count: job.applicants || 0 };
        const data = await res.json();
        return {
          jobId: job._id,
          count: Array.isArray(data) ? data.length : (job.applicants || 0),
        };
      } catch {
        return { jobId: job._id, count: job.applicants || 0 };
      }
    })
  );

  const candidateCountMap = new Map(
    applicantCounts.map((item) => [item.jobId, item.count])
  );

  return (
    <div className={pageContainerClass}>
      {/* Page header */}
      <div className="space-y-2">
        <Badge variant="secondary" className="h-6 px-3">
          Job Listings &amp; Postings
        </Badge>
        <h2 className="text-2xl font-semibold">Manage Jobs</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Job Posts</CardTitle>
          <CardDescription>
            Review live listings, monitor applicants, and update job details
            across your organization.
          </CardDescription>
          <CardAction>
            <Button render={<Link href="/dashboard/recruiter/jobs/new" />}>
              + New Job Post
            </Button>
          </CardAction>
        </CardHeader>

        {/* Desktop table */}
        <CardContent className="p-0">
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className={tableHeaderClass}>Job Title &amp; Dept</th>
                  <th className={tableHeaderClass}>Company &amp; Location</th>
                  <th className={`${tableHeaderClass} ${colTypeClass}`}>
                    Type
                  </th>
                  <th className={`${tableHeaderClass} ${colCompensationClass}`}>
                    Compensation
                  </th>
                  <th className={`${tableHeaderClass} ${colApplicantsClass}`}>
                    Applicants
                  </th>
                  <th className={tableHeaderClass}>Status</th>
                  <th className={`${tableHeaderClass} ${colDeadlineClass}`}>
                    Deadline
                  </th>
                  <th className={tableHeaderClass}>Actions</th>
                </tr>
              </thead>

             
<tbody className="divide-y">
  {jobs.length === 0 ? (
    <tr>
      <td colSpan={8} className="h-64 text-center align-middle">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <BriefcaseBusiness className="h-7 w-7 text-muted-foreground" />
          </div>

          <div>
            <p className="font-semibold text-base">
              No jobs found yet!
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              You havenot posted any jobs yet.
              Start by creating your first job listing.
            </p>
          </div>
        </div>
      </td>
    </tr>
  ) : (
    jobs.map((job: TJobListing) => {
      const candidateCount =
        candidateCountMap.get(job._id || "") ?? (job.applicants || 0);

      return (
      <tr
        key={job._id}
        className="transition-colors hover:bg-muted/30"
      >
        <td className={tableCellClass}>
          <div className="font-medium">
            <Link href={`/jobs/${job._id}`}>{job.title}</Link>
          </div>
          <div className="text-xs text-muted-foreground">
            {job.jobCategory}
          </div>
        </td>

        <td className={tableCellClass}>
          <div className="font-medium">{job.companyName}</div>
          <div className="text-xs text-muted-foreground">
            {formatLocation(job)} · {job.postedAgo}
          </div>
        </td>

        <td className={`${tableCellClass} ${colTypeClass}`}>
          {job.jobType}
        </td>

        <td className={`${tableCellClass} ${colCompensationClass}`}>
          {formatCompensation(job)}
        </td>

        <td className={`${tableCellClass} ${colApplicantsClass}`}>
          <Link
            href={`/dashboard/recruiter/jobs/${job._id}/applications`}
            className="hover:underline hover:text-primary transition-colors font-medium"
          >
            {candidateCount} {candidateCount === 1 ? "Candidate" : "Candidates"}
          </Link>
        </td>

        <td className={tableCellClass}>
          <JobStatusBadge status={job.status} />
        </td>

        <td className={`${tableCellClass} ${colDeadlineClass}`}>
          <div>{formatDeadline(job.deadline)}</div>
          <div className="text-xs text-muted-foreground">
            {job.postedAgo}
          </div>
        </td>

        <td className={tableCellClass}>
          <JobRowActions isClosed={job.isClosed} job={job} />
        </td>
      </tr>
      );
    })
  )}
</tbody>

            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="divide-y md:hidden">
            {
              
            jobs.map((job: TJobListing) => {
              const candidateCount =
                candidateCountMap.get(job._id || "") ?? (job.applicants || 0);

              return (
              <div key={job._id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {job.jobCategory}
                    </div>
                  </div>
                  <JobStatusBadge status={job.status} />
                </div>

                <div className="text-sm">
                  <div className="font-medium">{job.companyName}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatLocation(job)} · {job.postedAgo}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="block text-muted-foreground">Type</span>
                    {job.jobType}
                  </div>
                  <div>
                    <span className="block text-muted-foreground">
                      Compensation
                    </span>
                    {formatCompensation(job)}
                  </div>
                  <div>
                    <span className="block text-muted-foreground">
                      Deadline
                    </span>
                    {formatDeadline(job.deadline)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href={`/dashboard/recruiter/jobs/${job._id}/applications`}
                    className="text-xs text-muted-foreground hover:underline hover:text-primary font-medium"
                  >
                    {candidateCount} {candidateCount === 1 ? "Candidate" : "Candidates"}
                  </Link>
                  <JobRowActions isClosed={job.isClosed} job={job} />
                </div>
              </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageJobsPage;
