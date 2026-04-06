import { createTaskCall } from "../api/tasks";

export async function createTask(body) {
  try {
    return await createTaskCall(body);
  } catch (err) {
    console.error("Failed to create new task:", err.message);
    throw err;
  }
}
