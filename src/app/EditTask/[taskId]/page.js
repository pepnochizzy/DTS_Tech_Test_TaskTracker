"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function EditTask({ params }) {
  const { taskId } = use(params);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
        } else {
          if (data.data.description === "NULL") {
            data.data.description = "No details given - not required";
          }
          setTask(data.data);
        }
      } catch (err) {
        setError("Failed to fetch task");
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [taskId]);

  //Form submit
  async function handleUpdates(event) {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.target);
    const body = {
      title: formData.get("title"),
      description: formData.get("description"),
      due: formData.get("due"),
    };

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to update task:", data.error);
        alert(`Error: ${data.error}`);
        setPending(false);
        return;
      }
      router.push("/");
    } catch (err) {
      alert("Failed to update task");
      setPending(false);
    }
  }

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>Error: {error}</p>;

  const dueFormatted = task.due
    ? new Date(task.due).toISOString().slice(0, 16)
    : "";

  return (
    <main className="items-center self-center justify-center">
      <Link
        href={"/"}
        className="text-blue-500 underline hover:cursor-pointer hover:no-underline absolute right-0 mr-8 mt-2"
      >
        Home
      </Link>
      <h1 className="font-bold text-2xl mt-10 mb-4">Edit Task</h1>
      <form
        onSubmit={handleUpdates}
        className="grid grid-cols-[auto_1fr] gap-y-4 items-end"
      >
        <label htmlFor="title" className="border-b border-gray-500 pr-4">
          Title
        </label>
        <input
          type="text"
          name="title"
          maxLength={255}
          defaultValue={task.title}
          className="text-gray-600 border-b border-gray-500 pl-4"
        />

        <label
          htmlFor="description"
          className="align-top border-b border-gray-500 pr-4"
        >
          Description
        </label>
        <textarea
          type="text"
          name="description"
          maxLength={255}
          defaultValue={task.description}
          placeholder="optional"
          className="text-gray-600 border-b border-gray-500 pl-4"
        />

        <label htmlFor="due" className="border-b border-gray-500 pr-4">
          Due{" "}
        </label>
        <input
          id="due"
          name="due"
          type="datetime-local"
          defaultValue={dueFormatted}
          className="text-gray-600 border-b border-gray-500 pl-4"
        />

        <button
          type="submit"
          disabled={pending}
          className="text-white bg-green-700 border-b-2 border-green-950 p-1 hover:bg-green-800 hover:cursor-pointer
        active:border-3 active:border-amber-300 w-12 ml-2"
        >
          {pending ? "Saving..." : "Edit"}
        </button>
      </form>
      <div className="mt-10">
        <Link
          href={"/"}
          className="text-white bg-green-700 border-b-2 border-green-950 p-1 hover:bg-green-800
        active:border-3 active:border-amber-300"
        >
          Go back without editting
        </Link>
      </div>
    </main>
  );
}
