import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  TrendingDown,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { NavUser } from "./nav-user";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Sales Calls",
    url: "/sales-calls",
    icon: Phone,
  },
  {
    title: "Team Coaching",
    url: "#",
    icon: GraduationCap,
  },
  {
    title: "Email Marketing",
    url: "#",
    icon: Mail,
  },
  {
    title: "Playbook & Pitchdecks",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "Feedback Analysis",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Churn Analysis",
    url: "#",
    icon: TrendingDown,
  },
  {
    title: "Account Management",
    url: "#",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export async function AppSidebar() {
  const user = await currentUser();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.firstName || "User",
            email: user?.emailAddresses[0]?.emailAddress || "",
            avatar: user?.imageUrl || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
