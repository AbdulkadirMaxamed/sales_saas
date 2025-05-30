// dashboard/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";

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
    </ClerkProvider>
  );
}
