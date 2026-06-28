import { NextResponse } from "next/server";
import { createUserSchema } from "@/types/user";
import { UserService } from "@/services/userService";
import { ILike, Between } from "typeorm";
import { z } from "zod";

export async function POST(req: Request) {
  const userService = new UserService();
  try {
    const body = await req.json();
    const parsed = createUserSchema.parse(body);
    const user = await userService.create(parsed);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const username = searchParams.get("username") || "";
  const email = searchParams.get("email") || "";
  const fullName = searchParams.get("fullName") || "";
  const isActive = searchParams.get("isActive");
  const createdAt = searchParams.get("createdAt") || "";
  const updatedAt = searchParams.get("updatedAt") || "";

  const where: any = {};
  if (username) where.username = ILike(`%${username}%`);
  if (email) where.email = ILike(`%${email}%`);
  if (fullName) where.fullName = ILike(`%${fullName}%`);
  if (isActive === "true") where.isActive = true;
  if (isActive === "false") where.isActive = false;

  const parsed = z.coerce.date().safeParse(createdAt);
  if (parsed.success) {
    const start = new Date(parsed.data);
    start.setHours(0, 0, 0, 0);
    const end = new Date(parsed.data);
    end.setHours(23, 59, 59, 999);
    where.createdAt = Between(start, end);
  }

  const parsedUpdatedAt = z.coerce.date().safeParse(updatedAt);
  if (parsedUpdatedAt.success) {
    const start = new Date(parsedUpdatedAt.data);
    start.setHours(0, 0, 0, 0);
    const end = new Date(parsedUpdatedAt.data);
    end.setHours(23, 59, 59, 999);
    where.updatedAt = Between(start, end);
  }
    
  const userService = new UserService();
  const { items, total } = await userService.findAndCount(where, page, pageSize);

  return NextResponse.json({ items, total });
}
