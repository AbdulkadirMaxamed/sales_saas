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
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <div className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
          </div>
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">{children}</div>
        </main>
      </SidebarProvider>
    </ClerkProvider>
  );
}
