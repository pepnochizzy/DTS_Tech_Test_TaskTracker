"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/utils/dbConnections";

export async function DeleteAction(formData) {
  try {
    const id = formData.get("id");
    await db.query(`DELETE FROM tasktracker WHERE id = $1`, [id]);
    revalidatePath("/");
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}
