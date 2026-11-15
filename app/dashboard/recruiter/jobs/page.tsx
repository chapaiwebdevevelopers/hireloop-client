import Link from "next/link";
import { Ellipsis } from "lucide-react";
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
import { getJobs } from "@/lib/api/jobs";

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
        <DropdownMenuItem>View applicants</DropdownMenuItem>
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
  const jobListings = await getJobs();

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
                {jobListings.map((job: TJobListing) => (
                  <tr
                    key={job._id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className={tableCellClass}>
                      <div className="font-medium">
                        <Link href={`/jobs/${job._id}`}>{job.title}</Link>{" "}
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
                      {job.applicants} Candidates
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="divide-y md:hidden">
            {jobListings.map((job: TJobListing) => (
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
                  <span className="text-xs text-muted-foreground">
                    {job.applicants} Candidates
                  </span>
                  <JobRowActions isClosed={job.isClosed} job={job} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageJobsPage;
