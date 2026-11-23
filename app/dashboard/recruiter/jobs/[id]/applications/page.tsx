"use client"

import React, { use, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Eye,
  Mail,
  MoreHorizontal,
  Search,
  Trash2,
  User,
  UserX,
  Users,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/components/ui/toast"
import {
  pageContainerClass,
  tableCellClass,
  tableHeaderClass,
} from "@/lib/styles"
import { timeAgo } from "@/lib/job-utils"
import type { TApplicationStatus, TApplyJob } from "@/types/types"
import { updateApplicationStatus } from "@/lib/actions/applications"

/**
 * ============================================================================
 * DATABASE & BACKEND INTEGRATION INSTRUCTIONS (MongoDB / Express or Next.js API)
 * ============================================================================
 *
 * 1. BACKEND SCHEMA (MongoDB / Mongoose):
 *    Collection: `applications`
 *    Schema matching TApplyJob:
 *    {
 *      jobId: String,          // Matches the Job _id from route params
 *      userId: String,         // Seeker's user ID
 *      email: String,          // Applicant's contact email
 *      title: String,          // Job title applied for
 *      company: String,        // Company name
 *      jobType: String,        // e.g. 'Full-time'
 *      workMode: String,       // e.g. 'Remote', 'Hybrid', 'On-site'
 *      status: String,         // 'Applied' | 'Review' | 'interviews' | 'Shortlisted' | 'Rejected' | 'Offered'
 *      Deadline: String,       // Job application deadline
 *      archived: Boolean,      // Application archive state
 *      appliedAt: String       // ISO timestamp
 *    }
 *
 * 2. BACKEND API ENDPOINTS NEEDED:
 *    - GET /application?jobId=:id
 *      Returns an array of TApplyJob matching the job ID.
 *
 *    - PATCH /application/:userId (or application _id)
 *      Body: { status: "Review" }
 *      Updates the status of that specific application in MongoDB.
 *
 * 3. CONNECTING THIS COMPONENT:
 *    - Replace STATIC_APPLICANTS with a `useEffect` fetch:
 *      useEffect(() => {
 *        fetch(`http://localhost:5000/application?jobId=${id}`)
 *          .then((res) => res.json())
 *          .then((data: TApplyJob[]) => setApplicants(data))
 *      }, [id])
 * ============================================================================
 */

// Available recruitment statuses
const STATUS_OPTIONS: TApplicationStatus[] = [
  "Applied",
  "Review",
  "interviews",
  "Shortlisted",
  "Rejected",
  "Offered",
]

// Status visual configurations
const statusBadgeConfig: Record<
  TApplicationStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  Applied: {
    label: "Applied",
    badgeClass:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  Review: {
    label: "Review",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  interviews: {
    label: "Interviews",
    badgeClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    dotClass: "bg-sky-500",
  },
  Shortlisted: {
    label: "Shortlisted",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  Rejected: {
    label: "Rejected",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
    dotClass: "bg-destructive",
  },
  Offered: {
    label: "Offered",
    badgeClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    dotClass: "bg-violet-500",
  },
}

// Static Demo Data strictly adhering to TApplyJob
const STATIC_APPLICANTS: TApplyJob[] = [
  {
    jobId: "job_01",
    userId: "usr_101",
    email: "sarah.jenkins@example.com",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Full-time",
    workMode: "Remote",
    status: "Applied",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 53 * 60 * 1000).toISOString(), // 53 minutes ago
  },
  {
    jobId: "job_01",
    userId: "usr_102",
    email: "alex.rivera@techmail.io",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Full-time",
    workMode: "Hybrid",
    status: "Review",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    jobId: "job_01",
    userId: "usr_103",
    email: "david.chen@devhub.com",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Contract",
    workMode: "Remote",
    status: "interviews",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    jobId: "job_01",
    userId: "usr_104",
    email: "emily.watson@designpro.org",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Full-time",
    workMode: "On-site",
    status: "Shortlisted",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    jobId: "job_01",
    userId: "usr_105",
    email: "m.brown@cloudcorp.net",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Part-time",
    workMode: "Hybrid",
    status: "Rejected",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    jobId: "job_01",
    userId: "usr_106",
    email: "sophia.m@codeworks.io",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Full-time",
    workMode: "Remote",
    status: "Offered",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    jobId: "job_01",
    userId: "usr_107",
    email: "jwilson@stackflow.dev",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Full-time",
    workMode: "Remote",
    status: "Applied",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 53 * 60 * 1000).toISOString(), // 53 minutes ago
  },
  {
    jobId: "job_01",
    userId: "usr_108",
    email: "olivia.t@uxcreatives.com",
    title: "Senior Full-Stack Developer",
    company: "Hireloop Tech",
    jobType: "Full-time",
    workMode: "Hybrid",
    status: "interviews",
    Deadline: "2026-06-30",
    archived: false,
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
]

function getCandidateInitials(email: string, userId: string): string {
  if (email && email.includes("@")) {
    return email.split("@")[0].slice(0, 2).toUpperCase()
  }
  return (userId || "U").slice(0, 2).toUpperCase()
}

export default function JobApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
 console.log("id",id)
  // 1. Applicants State typed with TApplyJob
  const [applicants, setApplicants] = useState<TApplyJob[]>(STATIC_APPLICANTS)

  // 2. Search & Filter State
  const [search, setSearch] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  // 3. Candidate Details Modal State
  const [selectedApplicant, setSelectedApplicant] = useState<TApplyJob | null>(null)

  // 4. Dynamic Status Counts for Filter Pills
     const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: applicants.length,
      Applied: 0,
      Review: 0,
      interviews: 0,
      Shortlisted: 0,
      Rejected: 0,
      Offered: 0,
    }

    applicants.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++
      }
    })

    return counts
  }, [applicants])

  // 5. Filtered Applicants List (Search by email, userId, or title)
  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const query = search.trim().toLowerCase()
      const matchesSearch =
        query === "" ||
        applicant.userId.toLowerCase().includes(query) ||
        applicant.email.toLowerCase().includes(query) ||
        applicant.title.toLowerCase().includes(query)

      const matchesStatus =
        selectedFilter === "all" || applicant.status === selectedFilter

      return matchesSearch && matchesStatus
    })
  }, [applicants, search, selectedFilter])

  // 6. Update Status Handler
  const handleStatusChange = async (
    userId: string,
    newStatus: TApplicationStatus,
    identifier: string
  ) => {
  
    const updateStatus = await updateApplicationStatus(userId, { status: newStatus })
    console.log("userId:",userId)

    setApplicants((prev) =>
      prev.map((app) =>
        app.userId === userId ? { ...app, status: newStatus } : app
      )
    )

    if (selectedApplicant && selectedApplicant.userId === userId) {
      setSelectedApplicant((prev) =>
        prev ? { ...prev, status: newStatus } : null
      )
    }

    toast.add({
      title: "Status Updated",
      description: `Candidate (${identifier}) status changed to "${statusBadgeConfig[newStatus].label}".`,
    })
    
    // TODO: Connect your backend API when ready:
    // await fetch(`http://localhost:5000/application/${userId}`, {
    //   method: "PATCH",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ status: newStatus }),
    // })
  }

  // 7. Context Management Actions
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    toast.add({
      title: "Email Copied",
      description: `${email} copied to clipboard.`,
    })
  }

  const handleCopyAllEmails = () => {
    const emails = filteredApplicants.map((a) => a.email).join(", ")
    navigator.clipboard.writeText(emails)
    toast.add({
      title: "All Emails Copied",
      description: `${filteredApplicants.length} applicant emails copied to clipboard.`,
    })
  }

  const handleQuickScheduleInterview = (applicant: TApplyJob) => {
    handleStatusChange(applicant.userId, "interviews", applicant.userId)
    toast.add({
      title: "Interview Scheduled",
      description: `Candidate (${applicant.userId}) moved to Interviews stage.`,
    })
  }

  const handleRemoveApplicant = (userId: string, identifier: string) => {
    setApplicants((prev) => prev.filter((a) => a.userId !== userId))
    if (selectedApplicant && selectedApplicant.userId === userId) {
      setSelectedApplicant(null)
    }
    toast.add({
      title: "Applicant Removed",
      description: `Candidate (${identifier}) removed from applicant pool.`,
    })
  }

  return (
    <div className={pageContainerClass}>
      {/* Top Back Link & Breadcrumb */}
      <div>
        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Manage Jobs</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="secondary" className="h-6 px-3">
            Job Applications
          </Badge>
          <h2 className="text-2xl font-semibold">Job Applicants</h2>
          <p className="text-xs text-muted-foreground">
            Manage candidates, review application stages, and update status for Job Ref: #{id.slice(0, 8)}
          </p>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAllEmails}
            className="text-xs h-8 gap-1.5"
          >
            <Copy className="size-3.5" />
            <span>Copy All Emails</span>
          </Button>
        </div>
      </div>

      {/* Status Count Filter Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <button
          type="button"
          onClick={() => setSelectedFilter("all")}
          className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
            selectedFilter === "all"
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-border bg-card hover:bg-muted/40"
          }`}
        >
          <span className="text-[11px] font-medium text-muted-foreground block uppercase tracking-wider">
            All
          </span>
          <span className="mt-0.5 block text-lg font-bold text-foreground">
            {statusCounts.all}
          </span>
        </button>

        {STATUS_OPTIONS.map((statusKey) => {
          const cfg = statusBadgeConfig[statusKey]
          const isSelected = selectedFilter === statusKey

          return (
            <button
              key={statusKey}
              type="button"
              onClick={() => setSelectedFilter(statusKey)}
              className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                isSelected
                  ? `border-foreground/30 ring-1 ring-foreground/20 bg-muted/60`
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium capitalize text-muted-foreground">
                  {cfg.label}
                </span>
                <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
              </div>
              <span className="mt-0.5 block text-lg font-bold text-foreground">
                {statusCounts[statusKey] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Main Table & Filter Card */}
      <Card className="border border-border">
        <CardHeader className="p-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Applications List
              </CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredApplicants.length} of {applicants.length} total applicant(s)
              </CardDescription>
            </div>

            {/* Search Input Bar */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search user ID, email, title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 pr-7 text-xs"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {(search || selectedFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setSelectedFilter("all")
                  }}
                  className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredApplicants.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2">
                <Users className="size-5" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                No Applicants Found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                No candidate matches your current search or filter criteria.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setSelectedFilter("all")
                }}
                className="mt-3 text-xs"
              >
                Clear Search &amp; Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden w-full overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className={tableHeaderClass}>Applicant (User ID)</th>
                      <th className={tableHeaderClass}>Applicant Email</th>
                      <th className={tableHeaderClass}>Applied</th>
                      <th className={tableHeaderClass}>Status</th>
                      <th className={`${tableHeaderClass} min-w-[160px]`}>
                        Update Status
                      </th>
                      <th className={`${tableHeaderClass} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredApplicants.map((applicant) => {
                      const currentBadge = statusBadgeConfig[applicant.status]
                      const initials = getCandidateInitials(applicant.email, applicant.userId)

                      return (
                        <tr
                          key={applicant.userId}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          {/* 1. Applicant (User ID & Title) */}
                          <td className={tableCellClass}>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8 border border-border">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setSelectedApplicant(applicant)}
                                  className="font-semibold text-foreground hover:text-primary transition-colors text-left block cursor-pointer"
                                >
                                  Candidate #{applicant.userId}
                                </button>
                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                  <span>{applicant.title}</span>
                                  <span>•</span>
                                  <span className="capitalize">{applicant.workMode}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Applicant Email */}
                          <td className={tableCellClass}>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`mailto:${applicant.email}`}
                                className="text-xs font-mono text-foreground hover:text-primary transition-colors"
                              >
                                {applicant.email}
                              </a>
                              <button
                                type="button"
                                onClick={() => handleCopyEmail(applicant.email)}
                                title="Copy Email"
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded"
                              >
                                <Copy className="size-3" />
                              </button>
                            </div>
                          </td>

                          {/* 3. Applied (53 minutes ago, 2 days ago) */}
                          <td className={tableCellClass}>
                            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="size-3.5 text-muted-foreground/70" />
                              <span className="font-medium text-foreground/90">
                                {timeAgo(applicant.appliedAt)}
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground/60 block mt-0.5">
                              {new Date(applicant.appliedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </td>

                          {/* 4. Status */}
                          <td className={tableCellClass}>
                            <Badge
                              variant="outline"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ${currentBadge.badgeClass}`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${currentBadge.dotClass}`}
                              />
                              <span>{currentBadge.label}</span>
                            </Badge>
                          </td>

                          {/* 5. Update Status (applied, review, interviews, shortlisted, rejected, offered) */}
                          <td className={tableCellClass}>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 text-xs justify-between font-normal min-w-[130px]"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={`size-2 rounded-full ${currentBadge.dotClass}`}
                                      />
                                      <span className="capitalize">
                                        {applicant.status}
                                      </span>
                                    </div>
                                    <ChevronDown className="size-3 text-muted-foreground" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="start" className="w-44">
                                <DropdownMenuLabel className="text-[11px] text-muted-foreground font-semibold uppercase">
                                  Update Status
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {STATUS_OPTIONS.map((statusKey) => {
                                  const isCurrent = applicant.status === statusKey
                                  const cfg = statusBadgeConfig[statusKey]

                                  return (
                                    <DropdownMenuItem
                                      key={statusKey}
                                      onClick={() =>
                                        handleStatusChange(
                                          applicant.userId,
                                          statusKey,
                                          applicant.userId
                                        )
                                      }
                                      className={`flex items-center justify-between text-xs cursor-pointer py-1.5 ${
                                        isCurrent ? "font-semibold bg-muted/60" : ""
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`size-2 rounded-full ${cfg.dotClass}`}
                                        />
                                        <span className="capitalize">
                                          {statusKey}
                                        </span>
                                      </div>
                                      {isCurrent && (
                                        <Check className="size-3.5 text-primary stroke-[2.5]" />
                                      )}
                                    </DropdownMenuItem>
                                  )
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>

                          {/* 6. Context Management Actions <td> */}
                          <td className={`${tableCellClass} text-right`}>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedApplicant(applicant)}
                                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                              >
                                <Eye className="size-3.5 mr-1" />
                                View
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      aria-label="More candidate actions"
                                    >
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  }
                                />
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuLabel className="text-[11px] text-muted-foreground uppercase">
                                    Manage Candidate
                                  </DropdownMenuLabel>

                                  <DropdownMenuItem
                                    onClick={() => setSelectedApplicant(applicant)}
                                    className="cursor-pointer"
                                  >
                                    <User className="size-3.5 mr-2" />
                                    View Full Details
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => {
                                      window.location.href = `mailto:${applicant.email}`
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Mail className="size-3.5 mr-2" />
                                    Send Email
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => handleCopyEmail(applicant.email)}
                                    className="cursor-pointer"
                                  >
                                    <Copy className="size-3.5 mr-2" />
                                    Copy Email Address
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    onClick={() => handleQuickScheduleInterview(applicant)}
                                    className="cursor-pointer text-sky-600 dark:text-sky-400 font-medium"
                                  >
                                    <Calendar className="size-3.5 mr-2" />
                                    Schedule Interview
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(
                                        applicant.userId,
                                        "Rejected",
                                        applicant.userId
                                      )
                                    }
                                    className="cursor-pointer text-destructive font-medium"
                                  >
                                    <UserX className="size-3.5 mr-2" />
                                    Reject Application
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleRemoveApplicant(
                                        applicant.userId,
                                        applicant.userId
                                      )
                                    }
                                    className="cursor-pointer text-destructive focus:bg-destructive/10"
                                  >
                                    <Trash2 className="size-3.5 mr-2" />
                                    Remove Candidate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View */}
              <div className="divide-y md:hidden">
                {filteredApplicants.map((applicant) => {
                  const currentBadge = statusBadgeConfig[applicant.status]
                  const initials = getCandidateInitials(applicant.email, applicant.userId)

                  return (
                    <div key={applicant.userId} className="space-y-3 p-4">
                      {/* Name and Status Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8 border border-border">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm text-foreground">
                              Candidate #{applicant.userId}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {applicant.email}
                            </div>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-xs px-2 py-0.5 rounded-full ${currentBadge.badgeClass}`}
                        >
                          {currentBadge.label}
                        </Badge>
                      </div>

                      {/* Title & Applied Details */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          <span>Applied {timeAgo(applicant.appliedAt)}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedApplicant(applicant)}
                          className="text-primary hover:underline font-medium cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>

                      {/* Update Status for Mobile */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          Change Status:
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs font-normal"
                              >
                                <span
                                  className={`size-2 rounded-full ${currentBadge.dotClass}`}
                                />
                                <span className="capitalize">{applicant.status}</span>
                                <ChevronDown className="size-3 text-muted-foreground ml-1" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="w-44">
                            {STATUS_OPTIONS.map((statusKey) => (
                              <DropdownMenuItem
                                key={statusKey}
                                onClick={() =>
                                  handleStatusChange(
                                    applicant.userId,
                                    statusKey,
                                    applicant.userId
                                  )
                                }
                                className="flex items-center justify-between text-xs capitalize cursor-pointer"
                              >
                                <span>{statusKey}</span>
                                {applicant.status === statusKey && (
                                  <Check className="size-3.5 text-primary" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Candidate Profile Details Dialog (Management Action) */}
      <Dialog
        open={Boolean(selectedApplicant)}
        onOpenChange={(open) => {
          if (!open) setSelectedApplicant(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <User className="size-5 text-primary" />
              Candidate #{selectedApplicant?.userId}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Application details and recruitment progression.
            </DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                <Avatar className="size-11 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {getCandidateInitials(selectedApplicant.email, selectedApplicant.userId)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-foreground text-sm truncate">
                    {selectedApplicant.title}
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {selectedApplicant.email}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadgeConfig[selectedApplicant.status].badgeClass}`}
                    >
                      {statusBadgeConfig[selectedApplicant.status].label}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Applied {timeAgo(selectedApplicant.appliedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Status Stage Changer */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Update Candidate Stage:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {STATUS_OPTIONS.map((statusKey) => {
                    const isSelected = selectedApplicant.status === statusKey
                    const cfg = statusBadgeConfig[statusKey]

                    return (
                      <button
                        key={statusKey}
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            selectedApplicant.userId,
                            statusKey,
                            selectedApplicant.userId
                          )
                        }
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? `${cfg.badgeClass} ring-2 ring-primary/30 font-bold`
                            : "border-border hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
                        <span className="capitalize">{statusKey}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Candidate Info Overview (Using TApplyJob properties) */}
              <div className="rounded-xl border border-border bg-card p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-foreground font-medium">
                    #{selectedApplicant.userId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Title:</span>
                  <span className="font-medium text-foreground">
                    {selectedApplicant.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="text-foreground">
                    {selectedApplicant.company}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Work Mode:</span>
                  <span className="capitalize text-foreground font-medium">
                    {selectedApplicant.workMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Type:</span>
                  <span className="capitalize text-foreground">
                    {selectedApplicant.jobType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="text-foreground">
                    {selectedApplicant.Deadline}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applied:</span>
                  <span className="text-foreground">
                    {timeAgo(selectedApplicant.appliedAt)} ({new Date(selectedApplicant.appliedAt).toLocaleDateString()})
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleRemoveApplicant(
                      selectedApplicant.userId,
                      selectedApplicant.userId
                    )
                  }
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Remove
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplicant(null)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                  <a
                    href={`mailto:${selectedApplicant.email}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="size-3.5" />
                    Contact
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
