export type SortDir = 'asc' | 'desc'

export function compareValues(a: unknown, b: unknown): number {

    if (a == null && b == null) return 0
    if (a == null) return 1
    if (b == null) return -1

    if (typeof a === 'number' && typeof b === 'number') return a - b

    const sa = String(a).toLowerCase()
    const sb = String(b).toLowerCase()
    return sa.localeCompare(sb)
}

export function sortByKey<T extends Record<string, any>>(
    items: T[],
    key: keyof T,
    dir: SortDir
): T[] {
    const sorted = [...items].sort((x, y) => compareValues(x[key], y[key]))
    return dir === 'asc' ? sorted : sorted.reverse()
}
