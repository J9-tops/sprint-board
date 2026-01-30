import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function CreateBoardCard() {
  return (
    <button className={cn(
      "w-full h-44 rounded-2xl border-2 border-dashed border-muted-foreground/20",
      "flex flex-col items-center justify-center gap-4 transition-all duration-300 group",
      "hover:bg-muted/30 hover:border-primary/50 hover:scale-[1.03] hover:shadow-lg",
      "active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    )}>
      <div className="bg-muted group-hover:bg-primary group-hover:text-primary-foreground p-3 rounded-2xl transition-all duration-300 shadow-sm transform group-hover:rotate-90">
        <Plus size={24} strokeWidth={2.5} />
      </div>
      <div className="text-center">
        <p className="text-base font-extrabold text-foreground tracking-tight">Create new board</p>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">5 remaining</p>
      </div>
    </button>
  );
}
