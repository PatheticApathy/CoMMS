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
            <a href="#">
              <span>Materials</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="#">
              <span>Job Sites</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="#">
              <span>Company</span>
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
