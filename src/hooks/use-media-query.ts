import * as React from 'react'

/**
 * A React hook that tracks whether a given media query currently matches. It updates automatically when the viewport changes.
 *
 * This hook is useful for implementing responsive behavior in components without manually subscribing to media query events.
 *
 * Args:
 *   query: A CSS media query string to evaluate against the current viewport.
 *
 * Returns:
 *   A boolean indicating whether the media query currently matches.
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    const onChange = (event: MediaQueryListEvent) => {
      setValue(event.matches)
    }

    const result = window.matchMedia(query)
    result.addEventListener('change', onChange)
    setValue(result.matches)

    return () => result.removeEventListener('change', onChange)
  }, [query])

  return value
}
