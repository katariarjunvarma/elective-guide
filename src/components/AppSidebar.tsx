import { LayoutDashboard, Sparkles, Users, BookOpen, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const currentPath = location.pathname;

  const menuItems = !isAuthenticated || !user
    ? []
    : user.role === "admin"
    ? [
        { title: "Admin Dashboard", url: "/admin", icon: LayoutDashboard },
        { title: "Manage Students", url: "/students", icon: Users },
        { title: "Courses", url: "/courses", icon: BookOpen },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
        { title: "Settings", url: "/settings", icon: Settings },
      ]
    : [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Get Recommendations", url: "/recommendations", icon: Sparkles },
        { title: "Courses", url: "/courses", icon: BookOpen },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
        { title: "Settings", url: "/settings", icon: Settings },
      ];

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"}>
      <SidebarContent>
        <div className="p-6 border-b border-sidebar-border">
          {state === "expanded" && (
            <div className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="Elective Recommendation System logo"
                className="h-10 w-10 rounded-lg"
              />
              <div>
                <h2 className="font-bold text-sidebar-foreground">Elective</h2>
                <p className="text-xs text-sidebar-foreground/70">Recommendation</p>
              </div>
            </div>
          )}
          {state === "collapsed" && (
            <img
              src="/favicon.ico"
              alt="Elective Recommendation System logo"
              className="h-10 w-10 rounded-lg mx-auto"
            />
          )}
        </div>

        {menuItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {state === "expanded" && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
