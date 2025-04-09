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
import { ModeToggle } from "./darkmode-button"
import IdentityProvider from "./identity-provider"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <a href="/dashboard">
              <span>Home</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/admin">
              <span>Admin</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/contacts">
              <span>Contacts</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/jobsite">
              <span>Job Site</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/material">
              <span>Materials</span>
            </a>
          </SidebarMenuButton>
          <SidebarGroupContent></SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <IdentityProvider>
              <div className="grid grid-flow-col grid-rows-3 gap-4 justify-end">
                <div className="col-span-2 row-start-4 row-end-4"><Profile /></div>
                <div className="row-start-4 row-end-4"><ModeToggle /></div>
              </div>
            </IdentityProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter >
    </Sidebar>
  )
}
