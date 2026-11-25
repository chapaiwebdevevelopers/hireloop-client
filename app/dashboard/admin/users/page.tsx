import AdminUsersClient from "@/app/components/admin/AdminUsersClient"
import { getUsers } from "@/lib/api/premiumUsers"
import { MONTH_NAMES } from "@/lib/job-utils"
import type { TAdminUserItem, TUserRole } from "@/types/types"

// Convert database role (e.g. "recruiter") into TUserRole ("Recruiter")
function normalizeRole(role?: string): TUserRole {
  const value = role?.toLowerCase()
  if (value === "admin") return "Admin"
  if (value === "recruiter") return "Recruiter"
  return "Seeker"
}

// Format Date into "Oct 12, 2023" consistently on both server & client
function formatJoinDate(dateValue?: Date | string): string {
  if (!dateValue) return "—"
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return "—"
  const month = MONTH_NAMES[date.getUTCMonth()]
  const day = String(date.getUTCDate()).padStart(2, "0")
  const year = date.getUTCFullYear()

  return `${month} ${day}, ${year}`

}


// Server Component: fetches users on the server, then passes them to the Client Component
const AdminUsersPage = async () => {
  let rawUsers: Awaited<ReturnType<typeof getUsers>>["users"] = []

  try {
    const usersInfo = await getUsers()
    rawUsers = usersInfo?.users ?? []
  } catch (error) {
    console.error("Failed to fetch users:", error)
  }

  // Format fetched users to match TAdminUserItem from types/types.ts
  const users: TAdminUserItem[] = rawUsers.map((user) => ({
    id: user.id,
    name: user.name || "Unnamed User",
    email: user.email,
    role: normalizeRole(user.role),
    joinDate: formatJoinDate(user.createdAt),
    status: user.banned ? "Suspended" : "Active",
    avatar: user.image ?? undefined,
  }))

  // console.log("check users:",users)

  return <AdminUsersClient initialUsers={users} />
}

export default AdminUsersPage
