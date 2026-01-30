import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardTitle } from "./CardTitle";
import { CardBadges } from "./CardBadges";
import { CardDescription } from "./CardDescription";
import { CardChecklist } from "./CardChecklist";
import { CardAttachments } from "./CardAttachments";
import { CardSidebar } from "./CardSidebar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: { title: string; labels?: any[]; dueDate?: string };
}

export function CardModal({ isOpen, onClose, card }: CardModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Content = (
    <div className="flex flex-col h-full bg-card">
      <header className="h-16 flex items-center justify-between px-6 border-b shrink-0 bg-muted/20">
        <div className="flex items-center gap-2">
          {/* Empty space for alignment or add "Personal Task" breadcrumb if desired */}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted">
          <X size={20} />
        </Button>
      </header>
      <ScrollArea className="flex-1">
        <div className="p-8 space-y-10">
          <div className="h-40 w-full rounded-xl bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-950 flex items-end justify-end p-4 mb-6">
            <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur text-white border-white/10 text-[10px] uppercase font-black tracking-widest h-7 focus-visible:ring-2 focus-visible:ring-white/50 outline-none">
              Cover
            </Button>
          </div>
          <CardTitle title={card.title} />
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-10">
              <CardBadges labels={card.labels} dueDate={card.dueDate} />
              <CardDescription />
              <CardChecklist />
              <CardAttachments />
            </div>
            <CardSidebar />
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="p-0 sm:max-w-200 border-l-border/50 shadow-2xl" showCloseButton={false}>
          {Content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[95vh] p-0 focus:outline-none">
        {Content}
      </DrawerContent>
    </Drawer>
  );
}
