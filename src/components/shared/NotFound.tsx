import { useNavigate } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <FileQuestion className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
        <Button onClick={() => navigate({ to: '/' })} className="mt-6">
          Go Home
        </Button>
      </div>
    </div>
  )
}
