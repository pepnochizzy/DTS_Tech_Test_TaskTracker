"use client";

import { useState } from "react";
import { updateTask } from "@/lib/actions/UpdateAction";
import { Pencil } from "lucide-react";

export default function StatusEditable({ task, id, refresh }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleUpdates(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const body = { status: formData.get("status") };
    setPending(true);
    try {
      await updateTask(id, body, refresh);
      setOpen(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div className="flex flex-row">
        <p>{task}</p>
        {!open && (
          <button onClick={() => setOpen(true)}>
            <Pencil className="h-4.5 hover:cursor-pointer" />
          </button>
        )}
      </div>
      {open && (
        <div>
          <form onSubmit={handleUpdates}>
            <input type="hidden" name="id" value={id} />
            <select name="status">
              <option value="Not started">Not Started</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Complete">Complete</option>
            </select>
            <button
              type="submit"
              disabled={pending}
              className="hover:cursor-pointer bg-green-700 text-white pl-1 pr-1 ml-2 border-b-2 border-green-950 p-1 hover:bg-green-800
        active:border-3 active:border-amber-300"
            >
              {pending ? "..." : "Change"}
            </button>
          </form>
          <button
            onClick={() => setOpen(false)}
            className="text-blue-500 underline hover:cursor-pointer hover:no-underline"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
