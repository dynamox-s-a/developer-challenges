type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class ApiError extends Error {
    status: number;
    payload: unknown;

    constructor(message: string, status: number, payload?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.payload = payload ?? null;
    }
}

export class APIHandler {
    private baseURL: string;

    constructor(baseURL?: string) {
        this.baseURL = baseURL ?? (import.meta.env.VITE_API_URL as string) ?? '/api';
    }

    private getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    private buildHeaders(
        extraHeaders: Record<string, string> = {},
        isFormData = false,
    ) {

        const headers: Record<string, string> = {
            Accept: 'application/json',
            ...extraHeaders,
        };

        const token = this.getToken();
        if (token) headers.Authorization = `Bearer ${token}`;

        if (!isFormData) headers['Content-Type'] = 'application/json';

        return headers;
    }

    async request<T>(
        endpoint: string,
        method: HttpMethod = 'GET',
        data: unknown = null,
        headers: Record<string, string> = {},
        isFormData = false,
    ): Promise<T> {

        const options: RequestInit = {
            method,
            headers: this.buildHeaders(headers, isFormData),
        };

        if (data !== null && data !== undefined) {
            options.body = isFormData
                ? (data as BodyInit)
                : JSON.stringify(data);
        }

        const url = endpoint.startsWith('http')
            ? endpoint
            : `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

        const response = await fetch(url, options);

        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');

        if (!response.ok) {
            const payload = isJson
                ? await response.json().catch(() => null)
                : await response.text().catch(() => null);

            const message =
                (payload &&
                    typeof payload === 'object' &&
                    'message' in payload &&
                    String((payload as any).message)) ||
                (typeof payload === 'string' && payload) ||
                `HTTP ${response.status} - ${response.statusText}`;

            throw new ApiError(message, response.status, payload);
        }

        // 204 No Content
        if (response.status === 204) return undefined as unknown as T;

        return (isJson ? response.json() : response.text()) as Promise<T>;
    }

    get<T>(endpoint: string, headers: Record<string, string> = {}) {
        return this.request<T>(endpoint, 'GET', null, headers);
    }

    post<T>(
        endpoint: string,
        data: unknown,
        headers: Record<string, string> = {},
        isFormData = false,
    ) {
        return this.request<T>(endpoint, 'POST', data, headers, isFormData);
    }

    put<T>(
        endpoint: string,
        data: unknown,
        headers: Record<string, string> = {},
        isFormData = false,
    ) {
        return this.request<T>(endpoint, 'PUT', data, headers, isFormData);
    }

    delete<T>(endpoint: string, headers: Record<string, string> = {}) {
        return this.request<T>(endpoint, 'DELETE', null, headers);
    }
}

export const api = new APIHandler();
export default APIHandler;
