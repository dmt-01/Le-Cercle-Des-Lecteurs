export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
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

  if (response.status === 401) {
    const refreshToken = await fetch(API_BASE_URL + "/users/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (refreshToken.ok) {
      return apiFetch(endpoint, options);
    } else {
         window.location.href = "/login";
         return
    }
  }

    const errorData = await response.json();
    throw new Error(errorData.message || "Une erreur est survenue");
}
