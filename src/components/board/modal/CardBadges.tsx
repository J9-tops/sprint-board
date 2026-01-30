import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface CardBadgesProps {
  labels?: Array<{ name: string; color: string }>;
  dueDate?: string;
}

export function CardBadges({ labels, dueDate }: CardBadgesProps) {
  return (
    <div className="flex flex-wrap gap-x-12 gap-y-6 px-10">

      {labels && labels.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-0.5">Labels</h4>
          <div className="flex flex-wrap gap-2">
            {labels.map((label, i) => (
              <button key={i} className={cn("h-8 px-3 text-xs font-bold border-none text-white rounded-md focus-visible:ring-2 focus-visible:ring-primary outline-none hover:opacity-90 transition-opacity flex items-center", label.color)}>
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 mr-2" />
                {label.name}
              </button>
            ))}
            <button className="h-8 w-8 rounded-md bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors">
              <Plus size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      {dueDate && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-0.5">Due Date</h4>
          <div className="flex items-center gap-2 h-8 px-3 rounded-md bg-muted hover:bg-muted/80 cursor-pointer transition-colors group focus-within:ring-2 focus-within:ring-primary outline-none">
            <Checkbox className="h-4 w-4 rounded shadow-none pointer-events-none" />
            <span className="text-xs font-bold text-foreground">{dueDate}</span>
            <Badge variant="secondary" className="h-4 px-1 text-[9px] font-black bg-red-500/10 text-red-500 border-none uppercase tracking-wider">Overdue</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
