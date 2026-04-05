async function getTasks() {
  const res = await fetch(`/api/tasks`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "failed to fetch tasks");
  }
  return data.data;
}
