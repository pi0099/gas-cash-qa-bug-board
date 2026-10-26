/** Resolve a root-absolute public asset path against Vite `base` (GitHub Pages). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  if (!path) return base
  if (/^https?:\/\//i.test(path)) return path
  const cleaned = path.replace(/^\//, '')
  return `${base}${cleaned}`
}
