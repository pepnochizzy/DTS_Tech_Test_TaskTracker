"use client";

import { useState } from "react";
import NewTask from "./NewTask";

export default function NewTaskButton() {
  const [clicked, setClick] = useState(false);
  return (
    <>
      <button onClick={() => setClick(!clicked)}>Create a new task</button>
      {clicked && <NewTask />}
    </>
  );
}
