import { updateStatusCall } from "../api/tasks";

export async function updateTask(id, body, refresh) {
  try {
    await updateStatusCall(id, body);
    if (refresh) {
      await refresh();
    }
  } catch (err) {
    console.error("Failed to update task:", err.message);
    throw err;
  }
}
