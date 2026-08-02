export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return { Authorization: `Bearer ${sessionStorage.getItem('admin_token') ?? ''}`, ...extra }
}
