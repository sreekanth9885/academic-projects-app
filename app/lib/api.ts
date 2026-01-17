export async function apiFetch(url: string) {
  const token = localStorage.getItem("admin_token");

  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
}
