import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Settings, 
  LogOut, 
  User, 
  BarChart3, 
  Map as MapIcon, 
  AlertTriangle,
  ClipboardList,
  PlusCircle,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const getLinks = () => {
    const role = user?.role;
    
    const commonLinks = [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
    ];

    if (role === 'ministry' || role === 'mp_mla') {
      return [
        {
          label: "Analytics",
          href: "/gov-dashboard/analytics",
          icon: <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Regional Heatmaps",
          href: "/gov-dashboard/heatmaps",
          icon: <MapIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Crisis Alerts",
          href: "/gov-dashboard/alerts",
          icon: <AlertTriangle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        ...commonLinks
      ];
    }

    if (role === 'officer') {
      return [
        {
          label: "Management",
          href: "/gov-dashboard",
          icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Assigned Tasks",
          href: "/gov-dashboard/sla",
          icon: <ClipboardList className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: "Activity Logs",
          href: "/gov-dashboard/logs",
          icon: <History className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        ...commonLinks
      ];
    }

    // Default to Citizen
    return [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Register Complaint",
        href: "/dashboard/new-grievance",
        icon: <PlusCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "My Complaints",
        href: "/dashboard/my-grievances",
        icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Feedback",
        href: "/dashboard/feedback",
        icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      {
        label: "Activity",
        href: "/dashboard/activity-logs",
        icon: <History className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      },
      ...commonLinks
    ];
  };

  const links = getLinks();

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: user?.name || "User Profile",
              href: "/dashboard/edit-profile",
              icon: (
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              ),
            }}
          />
          <button 
            onClick={logout}
            className="flex items-center justify-start gap-2 group/sidebar py-2 w-full text-left"
          >
            <LogOut className="text-rose-500 h-5 w-5 flex-shrink-0" />
            {open && <span className="text-rose-600 text-sm font-medium">Logout</span>}
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-slate-800 whitespace-pre"
      >
        Saarthii Portal
      </motion.span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </div>
  );
};
