"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTask } from "@/lib/actions/CreateAction";

export default function NewTask() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  //form submit
  async function handleTaskData(event) {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.target);
    const body = {
      title: formData.get("title"),
      status: formData.get("status"),
      description: formData.get("description"),
      due: formData.get("due"),
    };
    try {
      await createTask(body);
      setPending(false);
      router.push("/");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="items-center self-center justify-center">
      <Link
        href={"/"}
        className="text-blue-500 underline hover:cursor-pointer hover:no-underline absolute right-0 mr-8 mt-2"
      >
        Home
      </Link>
      <h1 className="font-bold text-2xl mt-10 mb-4">Create a Task</h1>
      <form
        onSubmit={handleTaskData}
        className="grid grid-cols-[auto_1fr] gap-y-4 items-end"
      >
        <div className="contents">
          <label htmlFor="title" className="border-b border-gray-500">
            Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="text-gray-600 border-b border-gray-500"
            required
            maxLength={255}
          />
        </div>
        <div className="contents">
          <label htmlFor="description" className="border-b border-gray-500">
            Description
          </label>
          <textarea
            type="text"
            id="description"
            name="description"
            className="text-gray-600 border-b border-gray-500"
            placeholder="optional"
            maxLength={255}
          />
        </div>
        <div className="contents">
          <label htmlFor="status" className="border-b border-gray-500">
            Status*
          </label>
          <select
            id="status"
            name="status"
            className="text-gray-600 border-b border-gray-500"
          >
            <option value="Not started">Not started</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Complete">Complete</option>
          </select>
        </div>
        <div className="contents">
          <label htmlFor="due" className="border-b border-gray-500">
            Due*
          </label>
          <input
            id="due"
            name="due"
            type="datetime-local"
            className="text-gray-600 border-b border-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="text-white bg-green-700 border-b-2 border-green-950 p-1 hover:bg-green-800
          hover:cursor-pointer
        active:border-3 active:border-amber-300 w-30"
        >
          {pending ? "Creating..." : "Create Task"}
        </button>
      </form>
    </main>
  );
}
