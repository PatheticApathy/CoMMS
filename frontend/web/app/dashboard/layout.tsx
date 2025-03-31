import { cookies } from "next/headers"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/comms-sidebar"
import { AuthProvider } from "@/hooks/useToken";


export default async function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //sidebar uses cookies to store state
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AuthProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </AuthProvider>
      </SidebarProvider>
    </>
  );
}
