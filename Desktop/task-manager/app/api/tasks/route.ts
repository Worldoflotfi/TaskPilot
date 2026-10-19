import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import type { Varchar } from "@prisma/orm-postgres/target/codec-types";


export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await db.orm.public.Task.where({
      userId: session.user.id,
    }).all();

    return Response.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON request body" },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return Response.json(
        { error: "Request body must be a JSON object" },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const title = typeof data.title === "string" ? data.title.trim() : "";

    const description =
      typeof data.description === "string" ? data.description.trim() : "";

    if (
      data.description !== undefined &&
      typeof data.description !== "string"
    ) {
      return Response.json(
        { error: "Description must be a string" },
        { status: 400 },
      );
    }

    if (!title) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 },
      );
    }

    if (title.length > 255) {
      return Response.json(
        { error: "Task title must be 255 characters or fewer" },
        { status: 400 },
      );
    }

    if (description.length > 5000) {
      return Response.json(
        { error: "Description must be 5000 characters or fewer" },
        { status: 400 },
      );
    }
     
    const validatedTitle = title as Varchar<255>;

    const task = await db.orm.public.Task.create({
      title: validatedTitle,
      description: description || null,
      completed: false,
      userId: session.user.id,
    });

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("Failed to create task:", error);
    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
