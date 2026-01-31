import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const colors = [
  { name: 'Blue', value: 'bg-blue-600' },
  { name: 'Orange', value: 'bg-orange-600' },
  { name: 'Green', value: 'bg-green-600' },
  { name: 'Red', value: 'bg-red-600' },
  { name: 'Purple', value: 'bg-purple-600' },
  { name: 'Pink', value: 'bg-pink-600' },
  { name: 'Lime', value: 'bg-lime-600' },
  { name: 'Sky', value: 'bg-sky-600' },
  { name: 'Gray', value: 'bg-gray-600' },
  { name: 'Navy', value: 'bg-slate-900' },
]

const gradients = [
  { name: 'Sunset', value: 'bg-gradient-to-br from-orange-500 to-pink-500' },
  { name: 'Ocean', value: 'bg-gradient-to-br from-blue-500 to-teal-500' },
  { name: 'Forest', value: 'bg-gradient-to-br from-green-500 to-emerald-900' },
  { name: 'Twilight', value: 'bg-gradient-to-br from-purple-600 to-blue-600' },
  { name: 'Fire', value: 'bg-gradient-to-br from-red-500 to-orange-500' },
]

interface BackgroundSelectorProps {
  selected: string
  onSelect: (value: string) => void
}

export function BackgroundSelector({
  selected,
  onSelect,
}: BackgroundSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
          Solid Colors
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              type="button"
              key={color.name}
              onClick={() => onSelect(color.value)}
              className={cn(
                'h-8 rounded-md transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary outline-none hover:scale-105 active:scale-95',
                color.value,
              )}
              title={color.name}
            >
              {selected === color.value && (
                <Check size={14} className="text-white drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
          Gradients
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {gradients.map((gradient) => (
            <button
              type="button"
              key={gradient.name}
              onClick={() => onSelect(gradient.value)}
              className={cn(
                'h-8 rounded-md transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary outline-none hover:scale-105 active:scale-95',
                gradient.value,
              )}
              title={gradient.name}
            >
              {selected === gradient.value && (
                <Check size={14} className="text-white drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
