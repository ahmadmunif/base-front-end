import { NextResponse } from "next/server";
import { createRoleSchema } from "@/types/role";
import { RoleService } from "@/services/roleService";
import { ILike, Between } from "typeorm";
import { z } from "zod";

export async function POST(req: Request) {
  const roleService = new RoleService();
  try {
    const body = await req.json();
    const parsed = createRoleSchema.parse(body);
    const role = await roleService.create(parsed);

    return NextResponse.json({ success: true, role });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const roleService = new RoleService();
  
  if (all) {
    const roles = await roleService.findAll();
    return NextResponse.json(roles);    
  } else {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const name = searchParams.get("name") || "";
    const description = searchParams.get("description") || "";
    const createdAt = searchParams.get("createdAt") || "";
    const updatedAt = searchParams.get("updatedAt") || "";

    const where: any = {};
    if (name) where.name = ILike(`%${name}%`);
    if (description) where.description = ILike(`%${description}%`);

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

    const { items, total } = await roleService.findAndCount(where, page, pageSize);

    return NextResponse.json({ items, total });
  }
}