
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tasks = await db.orm.public.Task
      .where({ userId: session.user.id })
      .all();

    return Response.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return Response.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title =
      typeof body?.title === "string" ? body.title.trim() : "";

    const description =
      typeof body?.description === "string"
        ? body.description.trim()
        : "";

    if (!title) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    if (title.length > 255) {
      return Response.json(
        { error: "Task title must be 255 characters or fewer" },
        { status: 400 }
      );
    }

    const task = await db.orm.public.Task.create({
      title,
      description: description || null,
      completed: false,
      userId: session.user.id,
    });

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return Response.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}