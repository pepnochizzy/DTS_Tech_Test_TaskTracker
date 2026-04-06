"use client";

import { useState } from "react";
import { deleteAction } from "@/lib/actions/DeleteAction";

export default function DeleteTask({ id, refresh }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deleteAction(id, refresh);
    setPending(false);
    setOpen(false);
  }

  return (
    <div>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="text-blue-500 underline hover:cursor-pointer hover:no-underline"
        >
          Delete task
        </button>
      )}
      {open && (
        <div className="bg-gray-200 p-2 flex flex-col">
          <p className="font-bold mt-2">
            Are you sure you wish to delete this task?
          </p>
          <div>
            <input type="hidden" name="id" value={id} />
            <button
              onClick={handleDelete}
              disabled={pending}
              className=" hover:cursor-pointer underline hover:no-underline bg-gray-600 text-white p-1 border-b-2 active:border-3 active:border-amber-300 border-black mt-2"
            >
              {pending ? "..." : "Delete"}
            </button>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-white bg-green-700 border-b-2 border-green-950 p-1 hover:bg-green-800 hover:cursor-pointer
        active:border-3 active:border-amber-300 justify-end mt-2"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
