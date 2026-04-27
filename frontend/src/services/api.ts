export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  _retry = false,
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 401 && !_retry) {
    const refreshResponse = await fetch(API_BASE_URL + "/users/refresh", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshResponse.ok) {
      return apiFetch(endpoint, options, true);
    } else {
      throw new Error("Session expirée");
    }
  }

  const errorData = await response.json();
  const err = new Error(
    errorData.message || "Une erreur est survenue",
  ) as Error & { status: number };
  err.status = response.status;
  throw err;
}
