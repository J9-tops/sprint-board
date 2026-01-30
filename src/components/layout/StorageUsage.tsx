import { Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function StorageUsage() {
  const used = 45;
  const total = 500;
  const percentage = (used / total) * 100;

  return (
    <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 flex flex-col gap-4 focus-within:ring-2 focus-within:ring-primary/50 outline-none">
      <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground select-none">
        <div className="p-1.5 bg-background rounded-lg border border-border/50 shadow-sm">
          <Database size={16} className="text-primary" />
        </div>
        <span>Storage Usage</span>
      </div>
      <div className="space-y-2">
        <Progress value={percentage} className="h-1.5" aria-label="Storage consumption progress" />
        <p className="text-[11px] font-medium text-muted-foreground select-none">
          {used}MB used of {total}MB
        </p>
      </div>
    </div>
  );
}
