'use client'
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  CreditCard,
  Settings,
  Building2,
  BriefcaseBusiness,
  Users,
  Landmark,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"

const menuItemsByRole = {
  seeker: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { id: "jobs", name: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/saved-jobs", icon: Bookmark },
    { id: "applications", name: "Applications", url: "/dashboard/applications", icon: FileText },
    { id: "billing", name: "Billing", url: "/dashboard/billing", icon: CreditCard },
    { id: "settings", name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  recruiter: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { id: "my-company", name: "My Company", url: "/dashboard/company", icon: Building2 },
    { id: "manage-jobs", name: "Manage Jobs", url: "/dashboard/manage-jobs", icon: BriefcaseBusiness },
    { id: "applications", name: "Applications", url: "/dashboard/applications", icon: FileText },
    { id: "settings", name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { id: "users", name: "Users", url: "/dashboard/users", icon: Users },
    { id: "companies", name: "Companies", url: "/dashboard/companies", icon: Building2 },
    { id: "jobs", name: "Jobs", url: "/dashboard/jobs", icon: Briefcase },
    { id: "payments", name: "Payments", url: "/dashboard/payments", icon: Landmark },
    { id: "settings", name: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
}

export function DashboardSidebar() {
  const { data: session, isPending } = useSession()
  const role = (session?.user?.role || "seeker") as keyof typeof menuItemsByRole;
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsByRole[role].map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton render={<a href={item.url} />}>
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
