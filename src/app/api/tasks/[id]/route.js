//require id

import { db } from "@/utils/dbConnections";

//individual task (for edit page)
export async function GET(req, { params }) {
  const { id } = await params;
  console.log(id);
  try {
    const result = await db.query(`SELECT * FROM tasktracker WHERE id = $1`, [
      id,
    ]);
    const task = result.rows[0];

    return new Response(JSON.stringify({ success: true, data: task }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch task" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

//update (patch) for full task edit and status only edit
export async function PATCH(req, { params }) {
  const { id } = await params;
  console.log("Updating task with id:", id);

  try {
    const body = await req.json();
    const fields = [];
    const values = [];
    //for validation
    const statusMap = {
      "not started": "Not started",
      ongoing: "Ongoing",
      complete: "Complete",
    };

    if (body.title !== undefined) {
      if (body.title.trim() === "") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Title cannot be empty",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      fields.push(`title =$${fields.length + 1}`);
      values.push(body.title);
    }

    if (body.description) {
      fields.push(`description =$${fields.length + 1}`);
      values.push(body.description);
    }

    if (body.due) {
      fields.push(`due =$${fields.length + 1}`);
      values.push(body.due);
    }

    //status validation
    if (body.status !== undefined) {
      const normalisedStatus = body.status.toLowerCase().trim();

      if (!statusMap[normalisedStatus]) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid status value",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      fields.push(`status =$${fields.length + 1}`);
      values.push(statusMap[normalisedStatus]);
    }

    if (fields.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No fields to update" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    values.push(id);

    const query = `
    UPDATE tasktracker SET ${fields.join(", ")} WHERE id =$${values.length} RETURNING *`;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Task not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

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
    console.error("Failed to update task:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to update task" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

//delete task
export async function DELETE(req, { params }) {
  const { id } = await params;
  console.log("Deleting task with id:", id);

  try {
    const result = await db.query(
      `DELETE FROM tasktracker WHERE id = $1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Task not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: result.rows[0] }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Failed to delete task", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to delete task" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
