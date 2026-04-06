import { deleteTasksCall } from "../api/tasks";

export async function deleteAction(id, refresh) {
  try {
    await deleteTasksCall(id);

    if (refresh) {
      await refresh();
    }
  } catch (err) {
    alert(`Failed to delete task: ${err.message}`);
  }
}
