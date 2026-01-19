export const generateFakeToken = (user: any) => {
    return btoa(
        JSON.stringify({
            id: user.id,
            role: user.role,
            exp: Date.now() + 1000 * 60 * 60 // 1h
        })
    )
}

export const decodeToken = (token: string) => {
    return JSON.parse(atob(token))
}
