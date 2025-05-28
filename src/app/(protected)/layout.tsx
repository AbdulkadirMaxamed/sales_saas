// dashboard/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="fixed top-0 left-0 p-4">
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger />
          <div>{children}</div>
        </SidebarProvider>
      </div>
      {/* <div className="fixed top-0 right-0 p-4"><UserButton /></div> */}
    </ClerkProvider>
  );
}
