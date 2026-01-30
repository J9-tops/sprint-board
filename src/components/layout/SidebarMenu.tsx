import { LayoutDashboard, Home, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const menuItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Database, label: "Storage", to: "/settings/storage" },
];

export function SidebarMenu() {
  return (
    <nav className="flex flex-col gap-1">
      <p className="text-[10px] font-bold text-muted-foreground px-2 mb-2 uppercase tracking-[0.15em]">
        Menu
      </p>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          activeProps={{ className: "bg-secondary text-foreground" }}
          inactiveProps={{ className: "text-muted-foreground" }}
          className="block group"
        >
          {({ isActive }) => (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 h-11 px-3 text-sm focus-visible:ring-2 focus-visible:ring-primary"
            >
              <item.icon size={18} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
              <span className={isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground group-hover:text-foreground"}>
                {item.label}
              </span>
            </Button>
          )}
        </Link>
      ))}
    </nav>
  );
}
