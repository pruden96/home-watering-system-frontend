const BASE_URL = import.meta.env.VITE_SERVER_URL; // o fija si aplica
const DEFAULT_TIMEOUT = 3000;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions<T> {
    method: HttpMethod;
    endpoint: string;
    body?: T;
    timeout?: number;
}

export async function apiRequest<TBody, TResponse = void>({
    method,
    endpoint,
    body,
    timeout = DEFAULT_TIMEOUT,
}: RequestOptions<TBody>): Promise<TResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
        }

        // If the response has no body
        if (response.status === 204) return undefined as TResponse;

        return (await response.json()) as TResponse;
    } catch (error: any) {
        if (error.name === "AbortError") {
            throw new Error("Request timeout");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
