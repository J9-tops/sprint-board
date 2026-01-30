import { Cloud, HardDrive } from 'lucide-react'

export function StorageOverview() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-8 shadow-sm h-full flex flex-col items-center justify-center">
      <h3 className="text-sm font-bold text-foreground self-start px-2 uppercase tracking-widest">
        Local Quota Usage
      </h3>

      <div className="relative h-56 w-56 flex items-center justify-center">
        <svg className="h-full w-full transform -rotate-90 drop-shadow-2xl">
          <circle
            cx="112"
            cy="112"
            r="95"
            stroke="currentColor"
            strokeWidth="18"
            fill="transparent"
            className="text-muted/20"
          />
          <circle
            cx="112"
            cy="112"
            r="95"
            stroke="currentColor"
            strokeWidth="18"
            fill="transparent"
            strokeDasharray={596.9}
            strokeDashoffset={596.9 * (1 - 0.64)}
            className="text-primary transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black tracking-tighter">64%</span>
          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">
            Used
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <HardDrive size={12} className="text-primary" />
            Used
          </div>
          <p className="text-lg font-black tracking-tight">450 MB</p>
        </div>
        <div className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <Cloud size={12} className="text-muted-foreground" />
            Free
          </div>
          <p className="text-lg font-black tracking-tight text-muted-foreground">
            1.2 GB
          </p>
        </div>
      </div>

      <p className="text-[10px] text-center text-muted-foreground/60 font-medium px-4 leading-relaxed italic">
        Limits are imposed by your browser based on available disk space.
      </p>
    </div>
  )
}
