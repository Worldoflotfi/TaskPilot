
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// import { dataType } from "@prisma/orm-postgres/components";
import type { Varchar } from "@prisma/orm-postgres/target/codec-types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return Response.json({ error: "Invalid task ID" }, { status: 400 });
    }

    let body: unknown;

try {
  body = await request.json();
} catch {
  return Response.json(
    { error: "Invalid JSON request body" },
    { status: 400 }
  );
}

if (typeof body !== "object" || body === null || Array.isArray(body)) {
  return Response.json(
    { error: "Request body must be a JSON object" },
    { status: 400 }
  );
}

const data = body as Record<string, unknown>;

    // Only update completion status when completed is a boolean.
    if (typeof data?.completed === "boolean") {
      const updatedTask = await db.orm.public.Task
        .where({ id: taskId, userId: session.user.id })
        .update({ completed: data.completed });

      if (!updatedTask) {
        return Response.json({ error: "Task not found" }, { status: 404 });
      }

      return Response.json(updatedTask);
    }

    // Otherwise, validate title and description.
    if (
      typeof data?.title !== "string" ||
      typeof data?.description !== "string"
    ) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const title = data.title.trim();
    const description = data.description.trim();

    

    if (description.length > 5000) {
      return Response.json(
        { error: "Description must be 5000 characters or fewer" },
        { status: 400 }
      );
    }

    if (!title) {
      return Response.json({ error: "Task title is required" }, { status: 400 });
    }

    if (title.length > 255) {
      return Response.json(
        { error: "Task title must be 255 characters or fewer" },
        { status: 400 }
      );
    }
    const validatedTitle = title as Varchar<255>;
    const updatedTask = await db.orm.public.Task
      .where({ id: taskId, userId: session.user.id })
      .update({ title:validatedTitle, description: description || null });

    if (!updatedTask) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);
    return Response.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return Response.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const deletedTask = await db.orm.public.Task
      .where({ id: taskId, userId: session.user.id })
      .delete();

    if (!deletedTask) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    return Response.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return Response.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
