import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, FileText, History, Settings, LogOut,
  User, BarChart3, Map as MapIcon, AlertTriangle,
  ClipboardList, PlusCircle, MessageSquare, Bot,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_SRC = "/Red_Modern_Lettering_Creative_Studio_Logo-removebg-preview.png";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function getRoleLinks(role?: string): NavLink[] {
  const icon = (I: React.ElementType) => <I className="h-5 w-5 flex-shrink-0 text-neutral-600" />;

  if (role === "delhi_cm") return [
    { label: "CM Dashboard",    href: "/gov-dashboard",          icon: icon(LayoutDashboard) },
    { label: "Delhi Heatmaps",  href: "/gov-dashboard/heatmaps", icon: icon(MapIcon)         },
    { label: "SLA Tracker",     href: "/gov-dashboard/sla",      icon: icon(ClipboardList)   },
    { label: "Activity Logs",   href: "/gov-dashboard/logs",     icon: icon(History)         },
  ];
  if (role === "ministry") return [
    { label: "Ministry Analytics", href: "/gov-dashboard/analytics", icon: icon(BarChart3)      },
    { label: "Regional Heatmaps",  href: "/gov-dashboard/heatmaps",  icon: icon(MapIcon)        },
    { label: "Crisis Alerts",      href: "/gov-dashboard/alerts",    icon: icon(AlertTriangle)  },
  ];
  if (role === "mp_mla") return [
    { label: "Constituency Stats", href: "/gov-dashboard/analytics", icon: icon(BarChart3) },
    { label: "Area Heatmaps",      href: "/gov-dashboard/heatmaps",  icon: icon(MapIcon)   },
  ];
  if (role === "mc") return [
    { label: "City Management", href: "/gov-dashboard",           icon: icon(LayoutDashboard) },
    { label: "Ward Analytics",  href: "/gov-dashboard/analytics", icon: icon(BarChart3)       },
    { label: "City Heatmap",    href: "/gov-dashboard/heatmaps",  icon: icon(MapIcon)         },
  ];
  if (role === "officer") return [
    { label: "Management",    href: "/gov-dashboard",          icon: icon(LayoutDashboard) },
    { label: "Assigned Tasks",href: "/gov-dashboard/sla",      icon: icon(ClipboardList)   },
    { label: "Activity Logs", href: "/gov-dashboard/logs",     icon: icon(History)         },
    { label: "Local Heatmap", href: "/gov-dashboard/heatmaps", icon: icon(MapIcon)         },
  ];
  // Citizen (default)
  return [
    { label: "Dashboard",          href: "/dashboard",                    icon: icon(LayoutDashboard) },
    { label: "Register Complaint", href: "/dashboard/new-grievance",      icon: icon(PlusCircle)      },
    { label: "Saarthi AI",         href: "/dashboard/saarhtii-ke-sath",   icon: icon(Bot)             },
    { label: "My Complaints",      href: "/dashboard/my-grievances",      icon: icon(FileText)        },
    { label: "Feedback",           href: "/dashboard/feedback",           icon: icon(MessageSquare)   },
    { label: "Activity",           href: "/dashboard/activity-logs",      icon: icon(History)         },
    { label: "Heatmap",            href: "/dashboard/map",                icon: icon(MapIcon)         },
    { label: "Settings",           href: "/dashboard/edit-profile",       icon: icon(Settings)        },
  ];
}

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = getRoleLinks(user?.role);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen bg-white border-r border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute top-4 right-[-12px] z-50 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed
          ? <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          : <ChevronLeft  className="h-3.5 w-3.5 text-slate-500" />}
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center py-5 px-3 border-b border-slate-100">
        <img src={LOGO_SRC} alt="Saarthi" className={`object-contain transition-all duration-300 ${collapsed ? "h-8 w-8 rounded" : "h-10 w-auto max-w-[180px]"}`} />
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
        {links.map(link => {
          const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              to={link.href}
              title={collapsed ? link.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group
                ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <span className={`flex-shrink-0 ${isActive ? "text-primary" : "text-neutral-500 group-hover:text-slate-700"}`}>
                {link.icon}
              </span>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 py-3 px-2 flex flex-col gap-1">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-600 truncate`}>
          <div className="h-7 w-7 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && <span className="truncate font-medium">{user?.name || "User"}</span>}
        </div>
        <button
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors w-full"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
