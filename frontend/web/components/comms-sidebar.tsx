import {
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
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
import { Home, UserCog, Phone, MapPinned, Package } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuButton asChild>
            <a href="/dashboard">
              <Home className="mr-2 w-5 h-5" />
              <span>Home</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/admin">
              <UserCog className="mr-2 w-5 h-5" /> 
              <span>Admin</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/contacts">
              <Phone className="mr-2 w-5 h-5" />
              <span>Contacts</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/jobsite">
              <MapPinned className="mr-2 w-5 h-5" />
              <span>Job Site</span>
            </a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/dashboard/material">
              <Package className="mr-2 w-5 h-5" />
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
