export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }
  return data.data;
}
