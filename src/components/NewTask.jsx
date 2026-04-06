"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/hooks/useTasks";

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
    <form onSubmit={handleTaskData}>
      <div>
        <label htmlFor="title">Title Description: </label>
        <input type="text" id="title" name="title" />
      </div>
      <div>
        <label htmlFor="status">Status: </label>
        <select id="status" name="status">
          <option disabled value="">
            Select
          </option>
          <option value="notStarted">Not started</option>
          <option value="ongoing">Ongoing</option>
          <option value="Complete">Complete</option>
        </select>
      </div>
      <div>
        <label htmlFor="due">Due: </label>
        <input id="due" name="due" type="datetime-local" />
      </div>
      <button disabled={pending} type="submit">
        {pending ? "Saving..." : "Create Task"}
      </button>
    </form>
  );
}
