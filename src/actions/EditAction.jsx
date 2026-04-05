"use server";
//not in use as is a server action - used API endpoints
import { db } from "@/utils/dbConnections";

export default async function EditStatusAction({ formData }) {
  try {
    const id = formData.get("id");
    const due = formData.get("due");
    const title = formData.get("title");
    await db.query(
      `UPDATE tasktracker SET title = $1, due = $2 WHERE id = $3`,
      [title, due, id],
    );
  } catch (error) {
    console.error("Failed to update:", error);
    throw error;
  }
}
