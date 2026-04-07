"use client";

import Link from "next/link";
import DeleteTask from "@/components/DeleteTask";
import StatusEditable from "@/components/StatusEditable";
import style from "@/styles/homePage.module.css";
import DetailsDropdown from "@/components/DetailsDropdown";
import { useTasks } from "@/hooks/useTasks";

export default function TaskTrack() {
  const { tasks, loading, error, refresh } = useTasks();

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="items-center self-center justify-center">
      <h1 className="font-bold text-2xl mt-10 mb-4">Current Tasks</h1>
      <div className={style.gridContainer}>
        {tasks.map((task) => (
          <section key={task.id} className={style.taskRow}>
            <div className={style.task}>
              <h2>{task.title}</h2>
              <DetailsDropdown task={task.description} />
            </div>
            <div className={style.task}>
              <StatusEditable
                task={task.status}
                id={task.id}
                refresh={refresh}
              />
            </div>
            <div className={style.task}>
              <p>
                {new Date(task.due).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className={style.task}>
              <Link
                href={`/EditTask/${task.id}`}
                className="text-blue-500 underline hover:cursor-pointer hover:no-underline"
              >
                Edit task
              </Link>
              <DeleteTask id={task.id} refresh={refresh} />
              {/* <Trash2 aria-label="Delete" /> */}
            </div>
          </section>
        ))}
      </div>
      {!tasks || tasks.length === 0 ? <p>No tasks to display</p> : null}
      <div className="mt-5">
        <Link
          href={"/NewTask"}
          className="text-white bg-green-700 border-b-2 border-green-950 p-1 hover:bg-green-800
          hover:cursor-pointer
        active:border-3 active:border-amber-300"
        >
          Create a new task
        </Link>
      </div>
      <p className="mt-4">
        This site is for demonstration purposes only and has no affiliation with
        any official sites
      </p>
    </main>
  );
}
