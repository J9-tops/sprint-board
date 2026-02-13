import { ComponentType, Suspense, lazy } from 'react'
import type { LottieComponentProps } from 'lottie-react'
import loadingAnimation from '@/assets/loading.json'
import { cn } from '@/lib/utils'

/**
 * Handles CJS/ESM interop: in Node ESM (SSR), lottie-react's default export
 * resolves to the CJS namespace object rather than the component itself.
 * The actual component lives at m.default.default in that context.
 */
const Lottie = lazy(() =>
  import('lottie-react').then((m) => {
    const resolved = m.default as unknown as Record<string, unknown>
    const Component =
      typeof resolved === 'function' ? resolved : resolved?.default ?? resolved
    return { default: Component as ComponentType<LottieComponentProps> }
  }),
)


interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
  text?: string
}

export function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizeStyles = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    full: 'w-64 h-64',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        className,
      )}
    >
      <div className={sizeStyles[size]}>
        <Suspense fallback={null}>
          <Lottie animationData={loadingAnimation} loop />
        </Suspense>
      </div>
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )
}
