"use client";

import Link from "next/link";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { updateTask } from "@/lib/actions/UpdateAction";
import useTask from "@/hooks/useTask";

export default function EditTask({ params }) {
  const { taskId } = use(params);
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const { task, loading, error } = useTask(taskId);
  const displayDescription =
    task?.description === "NULL"
      ? "No details given - not required"
      : task?.description;

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
      await updateTask(taskId, body);
      router.push("/");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
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
          defaultValue={displayDescription}
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
