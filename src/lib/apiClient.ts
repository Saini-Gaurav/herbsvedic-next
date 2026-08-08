// A thin wrapper around fetch that ALWAYS sends cookies, and always throws a real Error (with the backend's message) on a failed request, instead of quietly returning a "not ok" response that's easy to forget to check.
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    // THIS is the line that makes the httpOnly cookie actually get sent. Without it, every request goes out with no cookie at all, and every protected route replies 401 - "not authenticated" - even seconds after a successful login. Easy to lose an hour to if you don't know to look for this one line specifically.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // 204 No Content (e.g. a successful DELETE) has no body to parse - trying to call response.json() on an empty body throws its own confusing error, so this is handled as its own case.
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong", response.status);
  }

  return data as T;
}