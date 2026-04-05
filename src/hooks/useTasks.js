import { useEffect, useState } from "react";
import { getTasks } from "@/lib/api/tasks";

export function useTasks() {
  const [tasks, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchTasks() {
    try {
      const data = await getTasks();
      setTask(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, refresh: fetchTasks };
}
