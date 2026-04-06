export async function getTasks() {
  const res = await fetch(`/api/tasks`, {
    method: "GET",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "failed to fetch tasks");
  }
  return data.data;
}

export async function getTaskById(id) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "GET",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "failed to fetch task");
  }
  return data.data;
}

export async function deleteTasksCall(id) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "failed to delete task");
  }
  return true;
}

export async function updateStatusCall(id, body) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update status");
  }
  return data.data;
}

export async function createTaskCall(body) {
  const res = await fetch(`/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create new task");
  }
  return data.data;
}
