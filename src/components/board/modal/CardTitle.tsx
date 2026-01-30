import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";

interface CardTitleProps {
  title: string;
}

export function CardTitle({ title }: CardTitleProps) {
  return (
    <div className="flex items-start gap-4 w-full px-1">
      <div className="mt-2 text-muted-foreground">
        <CreditCard size={20} />
      </div>
      <div className="flex-1 space-y-1">
        <Input 
          defaultValue={title}
          className="text-2xl font-black border-transparent hover:border-input focus-visible:bg-background h-auto py-1 px-2 -ml-2 w-full shadow-none focus-visible:ring-1 tracking-tight"
        />
        <p className="text-xs text-muted-foreground font-medium px-0.5">
          in list <button className="underline decoration-muted-foreground/50 underline-offset-4 cursor-pointer hover:text-foreground transition-colors outline-none focus-visible:text-primary focus-visible:decoration-primary">Doing</button>
        </p>
      </div>
    </div>
  );
}
