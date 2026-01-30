import { Search, Bell, HelpCircle, CheckCircle2, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { KanbanSquare } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-30">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-muted-foreground hover:bg-muted" 
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>

        <Link to="/" className="flex items-center gap-2 px-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <KanbanSquare size={18} />
          </div>
          <span className="hidden sm:inline font-bold text-xl tracking-tight text-foreground select-none">TaskMaster</span>
        </Link>

        <div className="hidden sm:flex max-w-xs w-full relative group ml-auto md:ml-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <Input 
            placeholder="Search" 
            className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-sm"
          />
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 px-4">
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
        <Link to="/" className="text-sm font-bold text-foreground border-b-2 border-primary py-5 translate-y-px">Boards</Link>
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Calendar</Link>
      </nav>

      <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground border border-border/50">
          <CheckCircle2 size={16} className="text-green-500" />
          <span className="text-[11px] font-medium">All changes saved</span>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted/80">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex h-9 w-9 text-muted-foreground hover:bg-muted/80">
          <HelpCircle size={18} />
        </Button>
        <Avatar className="h-8 w-8 md:h-9 md:w-9 border shadow-sm ml-1">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
