import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function CleanupTools() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-6 shadow-sm">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-widest px-1">Maintenance Tools</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold">Compress Images</h4>
            <p className="text-xs text-muted-foreground font-medium">Reduce size of attachments</p>
          </div>
          <Button variant="outline" size="sm" className="font-bold text-xs px-4 h-8 uppercase tracking-widest">Run</Button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold">Clear Archived</h4>
            <p className="text-xs text-muted-foreground font-medium">Remove old archived cards</p>
          </div>
          <Button variant="outline" size="sm" className="font-bold text-xs px-4 h-8 uppercase tracking-widest text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">Delete</Button>
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-0.5 px-1">
            <h4 className="text-sm font-bold">Data Backup</h4>
            <p className="text-xs text-muted-foreground font-medium">Create a full JSON export of all boards</p>
          </div>
          <Button className="w-full h-11 font-black uppercase tracking-[0.15em] text-xs shadow-lg shadow-primary/20">
            <Download className="mr-2 h-4 w-4" /> Export All Data
          </Button>
        </div>
      </div>
    </div>
  );
}
