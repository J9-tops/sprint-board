import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export function FilterPanel() {
  const labels = [
    { name: "Technical", color: "bg-blue-500" },
    { name: "Design", color: "bg-purple-500" },
    { name: "Urgent", color: "bg-red-500" },
    { name: "Marketing", color: "bg-orange-500" },
    { name: "Personal", color: "bg-green-500" },
  ];

  return (
    <div className="w-80 bg-card border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Filter</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <X size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Keyword</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <Input placeholder="Search cards..." className="pl-9 h-9 bg-muted/50 border-none text-sm" />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Labels</label>
          <div className="space-y-1">
            {labels.map((label) => (
              <label 
                key={label.name} 
                className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
              >
                <Checkbox className="h-4 w-4 rounded shadow-none" />
                <div className={`h-2 w-8 rounded-full ${label.color} shadow-sm`} />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label.name}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Due Date</label>
          <div className="space-y-1">
            {["No due date", "Overdue", "Due in next day", "Due in next week"].map((option) => (
              <label 
                key={option} 
                className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
              >
                <div className="h-4 w-4 rounded-full border border-primary/30 group-hover:border-primary transition-colors" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-muted/30">
        <Button variant="ghost" className="w-full h-9 font-bold text-[10px] uppercase tracking-widest">
          Clear all filters
        </Button>
      </div>
    </div>
  );
}
