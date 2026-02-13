export function generateSlug(
  name: string,
  existingSlugs: Array<string> = [],
): string {
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!slug) {
    slug = 'workspace'
  }

  let finalSlug = slug
  let counter = 2

  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`
    counter++
  }

  return finalSlug
}
