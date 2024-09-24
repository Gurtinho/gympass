
export function pagination<T>(items: T[], page: number = 1): T[] {
  return items.slice((page - 1) * 20, page * 20);
}