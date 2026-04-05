"use client";

import { Ellipsis, X } from "lucide-react";
import { useState } from "react";

export default function DetailsDropdown({ task }) {
  const [open, setOpen] = useState(false);

  if (task === "NULL") {
    task = "No details added";
  }

  return (
    <div>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="h-4.5 hover:cursor-pointer"
        >
          <Ellipsis />
        </button>
      )}
      {open && (
        <div className="flex flex-row place-content-between">
          <p>{task}</p>
          <button onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
      )}
    </div>
  );
}
