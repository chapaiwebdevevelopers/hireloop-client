
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Briefcase,
  Building2,
  CalendarClock,
  ClipboardList,
  FileText,
  ListChecks,
  MapPin,
  Tag,
  Users,
} from "lucide-react";

import { getJobsById } from "@/lib/api/jobs";
import {
  formatCompensation,
  formatDeadline,
  formatLocation,
} from "@/lib/job-utils";
import { TJobListing } from "@/types/types";
import { JobStatusBadge } from "@/app/components/JobStatusBadge";
import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";
import ApplyNowButton from "@/components/ApplyNow";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkUserApplied } from "@/lib/actions/job";

/**
 * Job details page — matches the reference design:
 *
 * [main column]                        [sidebar]
 *  ┌ header: logo, title, company ┐    ┌ Job Overview rows ┐
 *  │ meta chips + salary grid     │    │ (salary, location,│
 *  └──────────────────────────────┘    │  type, deadline…) │
 *  ┌ Responsibilities card        ┐    ├ Company Overview  ┤
 *  └──────────────────────────────┘    └ Apply Now button   ┘
 *
 * Everything is rendered from the API job record — nothing hardcoded.
 */

/** Small icon + label/value row, reused in the overview boxes */
function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm font-medium">{children}</p>
      </div>
    </div>
  );
}

/** Turns the requirements/responsibilities string into list items.
 *  The API stores them as "…; …; …" — fall back to sentence splitting. */
const toBulletItems = (text: string): string[] => {
  const items = text
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
  if (items.length > 1) return items;
  return text
    .split(".")
    .map((item) => item.trim())
    .filter(Boolean);
};
const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ Id: string }>;
}) => {
  const { Id } = await params;
  const job: TJobListing | null = await getJobsById(Id);

  if (!job) notFound();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const initialApplied =
    session?.user?.id && job._id
      ? await checkUserApplied(session.user.id, job._id)
      : false;

  const responsibilities = toBulletItems(job.responsibilities);
  const requirements = toBulletItems(job.requirements);


  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      {/* Back link */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to all jobs
      </Link>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        {/* ---------- Main column ---------- */}
        <div className="space-y-6">
          {/* Header card */}
          <section className="space-y-6 rounded-xl border bg-card p-6">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border bg-muted text-xl font-semibold text-muted-foreground">
                {job.companyName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold">{job.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.companyName} • {formatLocation(job)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <JobStatusBadge status={job.status} />
                  <Badge variant="secondary" className="font-normal">
                    {job.postedAgo}
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    {job.applicants} applicants
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <ApplyNowButton job={job}></ApplyNowButton>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarClock className="size-3.5" />
                  Apply by {formatDeadline(job.deadline)}
                </p>
              </div>
            </div>

            {/* Quick facts grid, as in the reference design */}
            <div className="grid gap-4 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem
                icon={<Banknote className="size-4" />}
                label="Salary Range"
              >
                {formatCompensation(job)}
              </InfoItem>
              <InfoItem icon={<MapPin className="size-4" />} label="Location">
                {formatLocation(job)}
              </InfoItem>
              <InfoItem
                icon={<Briefcase className="size-4" />}
                label="Job Type"
              >
                {job.jobType}
              </InfoItem>
              <InfoItem icon={<Tag className="size-4" />} label="Category">
                {job.jobCategory}
              </InfoItem>
            </div>
          </section>

          {/* Job description card */}
          {job.description && (
            <section className="rounded-xl border bg-card p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="size-5 text-primary" />
                Job Description
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {job.description}
              </p>
            </section>
          )}

          {/* Responsibilities card */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ListChecks className="size-5 text-primary" />
              Responsibilities
            </h2>
            <ul className="mt-4 space-y-3">
              {responsibilities.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Requirements card */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ClipboardList className="size-5 text-primary" />
              Requirements
            </h2>
            <ul className="mt-4 space-y-3">
              {requirements.map((item, index) => (
                <li key={index} className="flex gap-3 text-sm">
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---------- Sidebar ---------- */}
        <aside className="space-y-6">
          {/* Job overview */}
          <section
            id="apply"
            className="scroll-mt-8 space-y-5 rounded-xl border bg-card p-6"
          >
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Job Overview
            </h2>
            <div className="space-y-4">
              <InfoItem
                icon={<Banknote className="size-4" />}
                label="Salary Range"
              >
                {formatCompensation(job)}
              </InfoItem>
              <InfoItem icon={<MapPin className="size-4" />} label="Location">
                {formatLocation(job)}
              </InfoItem>
              <InfoItem
                icon={<Briefcase className="size-4" />}
                label="Job Type"
              >
                {job.jobType}
              </InfoItem>
              <InfoItem icon={<Tag className="size-4" />} label="Work Mode">
                {job.workMode}
              </InfoItem>
              <InfoItem
                icon={<CalendarClock className="size-4" />}
                label="Application Deadline"
              >
                {formatDeadline(job.deadline)}
              </InfoItem>
              <InfoItem
                icon={<Users className="size-4" />}
                label="Applicants"
              >
                {job.applicants}
              </InfoItem>
            </div>

            <Separator />
            <ApplyNowButton job={job} initialApplied={initialApplied} />

            <p className="text-center text-xs text-muted-foreground">
              {job.status === "Active"
                ? `Applications close ${formatDeadline(job.deadline)}`
                : `This posting is ${job.status.toLowerCase()} — applications are disabled`}
            </p>
          </section>

          {/* Company overview */}
          <section className="space-y-4 rounded-xl border bg-card p-6">
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Company Overview
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted text-lg font-semibold text-muted-foreground">
                {job.companyName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">{job.companyName}</p>
                <p className="text-xs text-muted-foreground">
                  Hiring via HireLoop
                </p>
              </div>
            </div>

            <Separator />

            <InfoItem icon={<Building2 className="size-4" />} label="Industry">
              {job.jobCategory}
            </InfoItem>
            <InfoItem icon={<Users className="size-4" />} label="Applicants">
              {job.applicants} candidates have applied
            </InfoItem>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default JobDetailsPage;
