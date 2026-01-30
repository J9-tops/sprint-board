export function GrowthTrend() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest px-1">Growth Trend</h3>
        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          Last 30 Days <span className="text-green-500 font-black">+12%</span>
        </div>
      </div>
      
      <div className="h-40 w-full relative pt-4">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 Q50,90 100,60 T200,70 T300,40 T400,60 V100 H0 Z"
            fill="url(#gradient)"
          />
          <path
            d="M0,80 Q50,90 100,60 T200,70 T300,40 T400,60"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        
        <div className="flex justify-between mt-4 px-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  );
}
