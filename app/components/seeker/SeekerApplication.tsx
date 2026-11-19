"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
  MessageSquareText,
  Search,
  Send,
  TrendingUp,
  UserCheck,
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
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  pageContainerClass,
  tableCellClass,
  tableHeaderClass,
} from "@/lib/styles"
import type { TApplication, TApplicationStatus } from "@/types/types"

const PAGE_SIZE = 5

const statusBadgeClass: Record<TApplicationStatus, string> = {
  Applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Review: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Shortlisted: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Rejected: "bg-destructive/10 text-destructive",
  Offered: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
}

function ApplicationStatusBadge({ status }: { status: TApplicationStatus }) {
  return (
    <Badge
      variant="secondary"
      className={statusBadgeClass[status] ?? "bg-muted text-muted-foreground"}
    >
      {status}
    </Badge>
  )
}

/** Builds the "1 2 3 … 9" page list with ellipsis gaps */
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "…")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push("…")
  for (let page = start; page <= end; page++) pages.push(page)
  if (end < total - 1) pages.push("…")
  pages.push(total)

  return pages
}

type TSeekerApplicationProps = {
  applications?: TApplication[]
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

const SeekerApplication = ({
  applications = [],
  user,
}: TSeekerApplicationProps) => {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<"Active" | "Archived">("Active")
  const [page, setPage] = useState(1)

  const stats = useMemo(() => {
    const total = applications.length
    const countBy = (status: TApplicationStatus) =>
      applications.filter((app) => app.status === status).length

    return [
      {
        label: "Total Applied",
        value: total,
        icon: Send,
        iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      {
        label: "Shortlisted",
        value: countBy("Shortlisted"),
        icon: UserCheck,
        iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        label: "Interviews",
        value: countBy("Review"),
        icon: MessageSquareText,
        iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        label: "Success Rate",
        value: total
          ? `${Math.round((countBy("Offered") / total) * 100)}%`
          : "0%",
        icon: TrendingUp,
        iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      },
    ]
  }, [applications])

  const filtered = useMemo(() => {
    const byTab = applications.filter(
      (app) => app.archived === (tab === "Archived")
    )
    const q = search.trim().toLowerCase()
    if (!q) return byTab

    return byTab.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.company.toLowerCase().includes(q)
    )
  }, [applications, search, tab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const showingFrom =
    filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const showingTo = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const firstName = user?.name?.split(" ")[0]

  const resetTo = (nextTab: "Active" | "Archived") => {
    setTab(nextTab)
    setPage(1)
  }

  return (
    <div className={pageContainerClass}>
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          placeholder="Search applications..."
          aria-label="Search applications"
          className="pl-8"
        />
      </div>

      {/* Page header: title, tabs & export */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">My Applications</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-input bg-muted/40 p-1">
              {(["Active", "Archived"] as const).map((t) => (
                <Button
                  key={t}
                  variant={tab === t ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => resetTo(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download data-icon="inline-start" />
              Export PDF
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {firstName ? `Welcome back, ${firstName}. ` : ""}
          Track your job applications and interview progress in real-time.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-2 py-4">
            <CardContent className="flex items-center gap-3 px-4">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  stat.iconClass
                )}
              >
                <stat.icon className="size-5" />
              </span>
              <div>
                <div className="text-xl font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            {tab} Applications
          </CardTitle>
          <CardDescription>
            {tab === "Active"
              ? "Applications currently in progress, from submission to offer."
              : "Older applications you've archived."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {pageRows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
              <Search className="size-8 text-muted-foreground/50" />
              <p className="font-medium">No applications found</p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? `Nothing matches "${search}" in your ${tab.toLowerCase()} applications.`
                  : `You have no ${tab.toLowerCase()} applications yet.`}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden w-full overflow-x-auto md:block">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className={tableHeaderClass}>Job Title</th>
                      <th className={tableHeaderClass}>Company</th>
                      <th className={tableHeaderClass}>Applied</th>
                      <th className={tableHeaderClass}>Status</th>
                      <th className={`${tableHeaderClass} text-right`}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pageRows.map((app) => (
                      <tr
                        key={app._id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className={tableCellClass}>
                          <div className="font-medium">{app.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {app.jobType} • {app.workMode}
                          </div>
                        </td>
                        <td className={tableCellClass}>
                          <div className="font-medium">{app.company}</div>
                        </td>
                        <td
                          className={`${tableCellClass} text-muted-foreground`}
                        >
                          {app.appliedAgo}
                        </td>
                        <td className={tableCellClass}>
                          <ApplicationStatusBadge status={app.status} />
                        </td>
                        <td className={`${tableCellClass} text-right`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="divide-y md:hidden">
                {pageRows.map((app) => (
                  <div key={app._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{app.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {app.jobType} • {app.workMode}
                        </div>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{app.company}</div>
                        <div className="text-xs text-muted-foreground">
                          Applied {app.appliedAgo}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer: count + pagination */}
          {pageRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
              <span className="text-sm text-muted-foreground">
                Showing {showingFrom}-{showingTo} of {filtered.length}{" "}
                applications
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ArrowLeft />
                </Button>
                {buildPageList(currentPage, totalPages).map((item, index) =>
                  item === "…" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex size-7 items-center justify-center text-sm text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={item}
                      variant={item === currentPage ? "secondary" : "ghost"}
                      size="icon-sm"
                      aria-current={item === currentPage ? "page" : undefined}
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ArrowRight />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SeekerApplication
