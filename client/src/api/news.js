export async function getNews(path = "") {
  const response = await fetch(`/api/news${path}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Could not load news.");
  }

  return data;
}
