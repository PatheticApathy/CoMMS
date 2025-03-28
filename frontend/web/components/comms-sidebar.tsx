import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

import { Profile } from "./profile-dialog"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <a href="/dashboard/jobsite">
              <span>Your Jobsite</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/material">
              <span>Materials</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/contacts">
              <span>Contacts</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="#">
              <span>Company</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/admin">
              <span>Admin</span>
            </a>
          </SidebarMenuButton>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Profile />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter >
    </Sidebar>
  )
}
