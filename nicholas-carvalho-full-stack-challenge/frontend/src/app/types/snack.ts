import { snackType } from "./enum"

export type snackBarState = {
    toast: {
        open: boolean,
        message: string,
        severity: snackType
    }
}