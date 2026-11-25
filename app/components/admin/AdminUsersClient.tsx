"use client"

import { useState } from "react"
import {
  BriefcaseBusiness,
  Download,
  MoreHorizontal,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import {
  activeStatusBadgeClass,
  expiredStatusBadgeClass,
  pageContainerClass,
  tableCellClass,
  tableHeaderClass,
} from "@/lib/styles"
import type {
  TAdminUserItem,
  TUserAccountStatus,
  TUserRole,
} from "@/types/types"
import { updateRole } from "@/lib/actions/roles"

// Role filter allows "All Roles" plus any TUserRole from types.ts
type TRoleFilter = "All Roles" | TUserRole

const ROLE_OPTIONS: TRoleFilter[] = [
  "All Roles",
  "Seeker",
  "Recruiter",
  "Admin",
]

// Available roles for the Role dropdown in each user row
const USER_ROLES: TUserRole[] = ["Seeker", "Recruiter", "Admin"]

// Colors for each role dropdown trigger
const roleSelectClass: Record<TUserRole, string> = {
  Admin: "border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Recruiter: "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Seeker: "bg-secondary text-secondary-foreground",
}

// Badge colors for account status (reusing shared classes from lib/styles.ts)
const statusBadgeClass: Record<TUserAccountStatus, string> = {
  Active: activeStatusBadgeClass,
  Suspended: expiredStatusBadgeClass,
}

// Helper: take first letters of first & last name (e.g. "Jordan Davis" -> "JD")
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "U"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

type TAdminUsersClientProps = {
  initialUsers: TAdminUserItem[]
}

// Shared dropdown menu for row actions (used in desktop table and mobile cards)
function UserRowActions({
  user,
  onToggleStatus,
  onDeleteUser,
}: {
  user: TAdminUserItem
  onToggleStatus: (user: TAdminUserItem) => void
  onDeleteUser: (user: TAdminUserItem) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${user.name}`}
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {/*Ternary=>  user Active ? suspend : active or Delete  */}
        {user.status === "Active" ? (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onToggleStatus(user)}
          >
            <ShieldAlert />
            Suspend
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onToggleStatus(user)}>
              <UserCheck />
              Activate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDeleteUser(user)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Reusable role dropdown used in both desktop table and mobile cards
function UserRoleSelect({
  user,
  onRoleChange,
}: {
  user: TAdminUserItem
  onRoleChange: (user: TAdminUserItem, newRole: TUserRole) => void
}) {
  return (
    <Select
      value={user.role}
      onValueChange={(value) => {
        if (value) onRoleChange(user, value as TUserRole)
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={`Change role for ${user.name}`}
        className={`w-28 text-xs font-medium ${roleSelectClass[user.role]}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {USER_ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function AdminUsersClient({
  initialUsers,
}: TAdminUsersClientProps) {
  // React state holds the users list, search text, and selected role filter
  
  const [users, setUsers] = useState<TAdminUserItem[]>(initialUsers)
  const [searchEmail, setSearchEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState<TRoleFilter>("All Roles")

  // ------------------------------------------------------------------
  // Handler Functions (Connect your backend API or Server Actions here)
  // ------------------------------------------------------------------

  // 1. Update search input state
  const handleSearchChange = (value: string) => {
    setSearchEmail(value)
  }

  // 2. Update role filter dropdown state
  const handleRoleFilterChange = (value: TRoleFilter) => {
    setSelectedRole(value)
  }

  // 3. Change a user's role from the table Role dropdown
  const handleRoleChange = async (
    user: TAdminUserItem,
    newRole: TUserRole
  ) => {
    // if the exist user role and clickable user role same then return nothing
    if (user.role === newRole) return
    
    setUsers((prevUsers) =>
      prevUsers.map((item) =>
        item.id === user.id ? { ...item, role: newRole } : item
      )
    )
      const res = await updateRole(user.id,newRole)
    console.log ("update roled",res)

    toast.add({
      type: "success",
      title: "Role updated",
      description: `${user.name} is now a ${newRole}.`,
    })
  }

  // 4. Suspend an active user OR activate a suspended user
  const handleToggleStatus = async (user: TAdminUserItem) => {
    const nextStatus: TUserAccountStatus =
      user.status === "Active" ? "Suspended" : "Active"

    // TODO: Call your backend API / Server Action to suspend or activate the user
    // Example: await updateUserStatus(user.id, nextStatus)

    setUsers((prevUsers) =>
      prevUsers.map((item) =>
        item.id === user.id ? { ...item, status: nextStatus } : item
      )
    )

    toast.add({
      type: "success",
      title: nextStatus === "Suspended" ? "User suspended" : "User activated",
      description: `${user.name} is now ${nextStatus}.`,
    })
  }

  // 5. Delete a suspended user account
  const handleDeleteUser = async (user: TAdminUserItem) => {
    // TODO: Call your backend API / Server Action to delete the user from database
    // Example: await deleteUserById(user.id)

    setUsers((prevUsers) => prevUsers.filter((item) => item.id !== user.id))

    toast.add({
      type: "success",
      title: "User deleted",
      description: `${user.name} has been removed from the list.`,
    })
  }

  // 6. Export the currently filtered users list as a CSV file
  const handleExportList = () => {
    const headers = ["Name", "Email", "Role", "Join Date", "Status"]
    const rows = filteredUsers.map((u) => [
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      u.role,
      `"${u.joinDate}"`,
      u.status,
    ])

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    )
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "hireloop-users.csv"
    link.click()
    URL.revokeObjectURL(url)

    toast.add({
      type: "success",
      title: "Export started",
      description: `Exported ${filteredUsers.length} user(s) to CSV.`,
    })
  }

  // ------------------------------------------------------------------
  // Filter & Stats Calculations
  // ------------------------------------------------------------------

  // Filter users by email search and role dropdown
  const filteredUsers = users.filter((user) => {
    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchEmail.trim().toLowerCase())

    const matchesRole =
      selectedRole === "All Roles" || user.role === selectedRole

    return matchesEmail && matchesRole
  })

  // Calculate summary numbers from the current `users` array
  const totalActiveUsers = users.filter((u) => u.status === "Active").length
  const totalRecruiters = users.filter((u) => u.role === "Recruiter").length
  const totalSuspended = users.filter((u) => u.status === "Suspended").length
  const suspendedPercent =
    users.length > 0
      ? ((totalSuspended / users.length) * 100).toFixed(1)
      : "0.0"

  const stats = [
    {
      label: "Total Active Users",
      value: totalActiveUsers,
      helper: "+12% vs last month",
      icon: Users,
      iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Recruiter Growth",
      value: totalRecruiters,
      helper: "High demand",
      icon: BriefcaseBusiness,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Suspended Accounts",
      value: totalSuspended,
      helper: `${suspendedPercent}% of total`,
      icon: UserX,
      iconClass: "bg-destructive/10 text-destructive",
    },
    {
      label: "New Signups (24h)",
      value: users.length,
      helper: "Steady activity",
      icon: UserPlus,
      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ]

  return (
    <div className={pageContainerClass}>
      {/* Top Search Bar */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={searchEmail}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by email..."
          aria-label="Search by email"
          className="pl-8"
        />
      </div>

      {/* Page Header: Badge, Title, Role Filter & Export Button */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <Badge variant="secondary" className="h-6 px-3">
            Manage Roles
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Review, filter, and manage platform access for all users.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter Dropdown */}
          <Select
            value={selectedRole}
            onValueChange={(value) =>
              handleRoleFilterChange((value as TRoleFilter) ?? "All Roles")
            }
          >
            <SelectTrigger className="w-36" aria-label="Filter by role">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export List Button */}
          <Button variant="outline" onClick={handleExportList}>
            <Download className="size-4" />
            Export List
          </Button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-2 py-4">
            <CardContent className="flex items-start justify-between gap-3 px-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.helper}</p>
              </div>
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClass}`}
              >
                <stat.icon className="size-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
          <CardDescription>
            Change user roles, suspend or activate accounts, and remove
            suspended profiles.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
              <Search className="size-8 text-muted-foreground/50" />
              <p className="font-medium">No users found</p>
              <p className="text-sm text-muted-foreground">
                Try clearing your email search or changing the role filter.
              </p>
              {(searchEmail || selectedRole !== "All Roles") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSearchEmail("")
                    setSelectedRole("All Roles")
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden w-full overflow-x-auto md:block">
                <table className="w-full min-w-[780px] text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className={tableHeaderClass}>User Name</th>
                      <th className={tableHeaderClass}>Email Address</th>
                      <th className={tableHeaderClass}>Role</th>
                      <th className={tableHeaderClass}>Join Date</th>
                      <th className={tableHeaderClass}>Status</th>
                      <th className={`${tableHeaderClass} text-right`}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className={tableCellClass}>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              {user.avatar && (
                                <AvatarImage src={user.avatar} alt={user.name} />
                              )}
                              <AvatarFallback>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>

                        <td
                          className={`${tableCellClass} text-muted-foreground`}
                        >
                          {user.email}
                        </td>

                        <td className={tableCellClass}>
                          <UserRoleSelect
                            user={user}
                            onRoleChange={handleRoleChange}
                          />
                        </td>

                        <td
                          className={`${tableCellClass} text-muted-foreground`}
                        >
                          {user.joinDate}
                        </td>

                        <td className={tableCellClass}>
                          <Badge
                            variant="secondary"
                            className={statusBadgeClass[user.status]}
                          >
                            {user.status}
                          </Badge>
                        </td>

                        <td className={`${tableCellClass} text-right`}>
                          <div className="flex items-center justify-end gap-2">
                            <UserRowActions
                              user={user}
                              onToggleStatus={handleToggleStatus}
                              onDeleteUser={handleDeleteUser}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="divide-y md:hidden">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {user.avatar && (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          )}
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className={statusBadgeClass[user.status]}
                      >
                        {user.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <UserRoleSelect
                        user={user}
                        onRoleChange={handleRoleChange}
                      />
                      <span>Joined {user.joinDate}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <UserRowActions
                        user={user}
                        onToggleStatus={handleToggleStatus}
                        onDeleteUser={handleDeleteUser}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Table Footer */}
          <div className="border-t px-4 py-3 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
