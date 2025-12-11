import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { loadMessagesForUser, countUnreadMessagesForUser, markAllMessagesReadForUser, UserMessage } from "@/utils/messagesStorage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<UserMessage[]>([]);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!user || user.role !== "student") {
      setUnreadCount(0);
      setMessages([]);
      return;
    }
    setUnreadCount(countUnreadMessagesForUser(user.id));
    setMessages(loadMessagesForUser(user.id));
  }, [user]);

  const handleNotificationsOpenChange = (open: boolean) => {
    setNotificationsOpen(open);
    if (open && user && user.role === "student") {
      markAllMessagesReadForUser(user.id);
      setMessages(loadMessagesForUser(user.id));
      setUnreadCount(0);
    }
  };

  const formatShortDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const day = d.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    const month = d.toLocaleString("en-US", { month: "short" });
    return `${month} ${day}${suffix}`;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold text-foreground hidden sm:block">
                Elective Recommendation System
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  {user.role === "student" && (
                    <Dialog open={notificationsOpen} onOpenChange={handleNotificationsOpenChange}>
                      <button
                        type="button"
                        aria-label="Notifications"
                        className="relative rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => handleNotificationsOpenChange(true)}
                      >
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Messages</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2 space-y-2 max-h-80 overflow-y-auto text-sm">
                          {messages.length === 0 ? (
                            <p className="text-muted-foreground">No messages</p>
                          ) : (
                            messages
                              .slice()
                              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                              .map((msg) => (
                                <div key={msg.id} className="border rounded-md p-2 bg-card/60">
                                  <div className="font-semibold text-foreground mb-1 truncate">
                                    {msg.title}
                                  </div>
                                  {msg.body && (
                                    <div className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                                      {msg.body}
                                    </div>
                                  )}
                                  <div className="text-[11px] flex justify-between">
                                    <span className="text-blue-600 font-medium">Admin({formatShortDate(msg.createdAt)})</span>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button aria-label="User menu">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>My Profile</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          logout();
                          navigate("/login");
                        }}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
