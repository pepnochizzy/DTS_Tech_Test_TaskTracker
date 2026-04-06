import { getTaskById } from "@/lib/api/tasks";
import { useEffect, useState } from "react";

//for fetching by id
export default function useTask(taskId) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const data = await getTaskById(taskId);
        setTask(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (taskId) fetchTask();
  }, [taskId]);

  return { task, loading, error };
}
