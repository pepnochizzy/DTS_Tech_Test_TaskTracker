//for tasks without id requirements
import { db } from "@/utils/dbConnections";

//get all tasks
export async function GET() {
  try {
    const result = await db.query(`SELECT * FROM tasktracker ORDER BY due ASC`);

    //handle empty database too
    const tasks = result.rows || [];

    return new Response(JSON.stringify({ success: true, data: tasks }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch tasks" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

//create new task
export async function POST(req) {
  //for validation
  const statusMap = {
    "not started": "Not started",
    ongoing: "Ongoing",
    complete: "Complete",
  };
  try {
    const body = await req.json();
    const { title, due, status, description } = body;

    if (!title || title.trim() === "") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Title is required and cannot be empty",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const dueDate = new Date(due);
    if (!due || isNaN(dueDate.getTime())) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Due date is required and must be valid",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!status || !statusMap[status.toLowerCase().trim()]) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Status is required and must be one of ${Object.values(statusMap).join(", ")}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = await db.query(
      `INSERT INTO tasktracker (title, status, due, description) VALUES ($1,$2,$3,$4) RETURNING *`,
      [
        title.trim(),
        statusMap[status.toLowerCase().trim()],
        due,
        description || null,
      ],
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: result.rows[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Failed to create new task:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create task" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
