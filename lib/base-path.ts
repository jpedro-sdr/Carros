/**
 * Use only for navegação fora do Next (ex.: assign). Link e useRouter já aplicam basePath do next.config.
 */
export function appPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
