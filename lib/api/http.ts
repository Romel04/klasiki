const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface ApiEnvelope<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}

// Returns the full envelope (use when you need `pagination`).
export async function apiEnvelope<T>(
  path: string,
  init: RequestInit = {},
  errorMessage = "Request failed",
): Promise<ApiEnvelope<T>> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) throw new ApiError(errorMessage, res.status);
  return res.json();
}

// Returns just `.data`. The storefront is public, so no auth/refresh logic.
export async function apiJson<T>(
  path: string,
  init: RequestInit = {},
  errorMessage = "Request failed",
): Promise<T> {
  return (await apiEnvelope<T>(path, init, errorMessage)).data;
}
