import type { Machine } from "../features/machines/types"

const KEY = 'machines'

export const machinesStorage = {
    read(): Machine[] {
        const raw = localStorage.getItem(KEY)
        if (!raw) return []
        try {
            const parsed = JSON.parse(raw) as Machine[]
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    },

    write(items: Machine[]) {
        localStorage.setItem(KEY, JSON.stringify(items))
    }
}
