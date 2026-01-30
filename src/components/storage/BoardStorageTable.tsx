import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Search, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";

const boards = [
  { name: "Product Roadmap 2024", size: "124 MB", items: "1,240", updated: "2 hours ago", icon: "bg-blue-500/20 text-blue-500" },
  { name: "Marketing Launch - Q3", size: "86 MB", items: "856", updated: "Yesterday", icon: "bg-purple-500/20 text-purple-500" },
  { name: "Bug Tracker - Mobile App", size: "62 MB", items: "2,103", updated: "3 days ago", icon: "bg-green-500/20 text-green-500" },
  { name: "Design System - v2.0", size: "45 MB", items: "420", updated: "1 week ago", icon: "bg-orange-500/20 text-orange-500" },
  { name: "Ideas & Concepts", size: "12 MB", items: "156", updated: "2 weeks ago", icon: "bg-pink-500/20 text-pink-500" },
  { name: "Archived - 2023", size: "121 MB", items: "3,400", updated: "6 months ago", icon: "bg-slate-500/20 text-slate-500" },
];

export function BoardStorageTable() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 flex items-center justify-between border-b border-border/50">
        <div>
          <h3 className="font-bold text-base tracking-tight">Storage by Board</h3>
          <p className="text-xs text-muted-foreground font-medium">Breakdown of space usage per project board.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input placeholder="Search boards..." className="h-9 pl-9 bg-muted/50 border-none text-xs" />
        </div>
      </div>

      <div className="flex-1">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="font-bold text-[10px] uppercase tracking-widest px-6 h-10">Board Name</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest h-10 text-center">Last Modified</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest h-10 text-center">Items</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-widest h-10 text-right pr-6">Disk Size</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boards.map((board) => (
              <TableRow key={board.name} className="hover:bg-muted/10 transition-colors border-b border-border/50">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${board.icon}`}><LayoutGrid size={16} /></div>
                    <span className="font-bold text-sm tracking-tight">{board.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-muted-foreground text-center">{board.updated}</TableCell>
                <TableCell className="text-xs font-bold text-muted-foreground text-center">{board.items}</TableCell>
                <TableCell className="text-right pr-6">
                  <span className="text-sm font-black tracking-tight">{board.size}</span>
                </TableCell>
                <TableCell className="pr-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"><MoreVertical size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Showing 6 of 14 boards</p>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft size={14} /></Button>
          <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight size={14} /></Button>
        </div>
      </div>
    </div>
  );
}
