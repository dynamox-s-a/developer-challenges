export function isJwtValid(token: string | null): boolean {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
        const payloadJson = atob(
            parts[1].replace(/-/g, '+').replace(/_/g, '/'),
        );
        const payload = JSON.parse(payloadJson) as { exp?: number };

        if (!payload.exp) return true; // se não tem exp, trata como válido (ou false se preferir)
        const now = Math.floor(Date.now() / 1000);

        return payload.exp > now;
    } catch {
        return false;
    }
}
