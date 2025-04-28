import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/comms-sidebar"
import IdentityProvider from "@/components/identity-provider";


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
        <AppSidebar />
        <main>
          <IdentityProvider>
            {children}
          </IdentityProvider>
        </main>
      </SidebarProvider>
    </>
  );
}
