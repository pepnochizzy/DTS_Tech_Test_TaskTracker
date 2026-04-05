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
  try {
    const body = await req.json();
    const { title, due, status, description } = body;

    //validation
    if (!title || !due || !status) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Title, due and status are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await db.query(
      `INSERT INTO tasktracker (title, status, due, description) VALUES ($1,$2,$3,$4) RETURNING *`,
      [title, status, due, description || null],
    );

    return new Response(
      JSON.stringify({
        success: true,
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
