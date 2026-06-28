// app/api/user-management/menu/route.ts
import { NextResponse } from "next/server";
import { createMenuSchema } from "@/types/menu";
import { MenuService } from "@/services/menuService";
import { ILike, Between } from "typeorm";
import { z } from "zod";

// CREATE
export async function POST(req: Request) {
  const menuService = new MenuService();
  try {
    const body = await req.json();

    const parsed = createMenuSchema.parse(body);

    const menu = await menuService.create({
      name: parsed.name,
      path: parsed.path,
      icon: parsed.icon,
      sortOrder: parsed.sortOrder,
      isActive: parsed.isActive,
      parent: parsed.parent,  
    });

    return NextResponse.json({ success: true, menu });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// LIST (all atau paginated + filters)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";
  const menuService = new MenuService();

  if (all) {
    // Kembalikan semua menu tanpa paging
    const menus = await menuService.findAll();
    return NextResponse.json(menus);
  } else {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const name = searchParams.get("name") || "";
    const path = searchParams.get("path") || "";
    const icon = searchParams.get("icon") || "";
    const isActive = searchParams.get("isActive");
    const parent = searchParams.get("parent") || ""; // UUID parent
    const sortOrderStr = searchParams.get("sortOrder") || "";
    const minSortStr = searchParams.get("minSortOrder") || "";
    const maxSortStr = searchParams.get("maxSortOrder") || "";
    const createdAt = searchParams.get("createdAt") || "";
    const updatedAt = searchParams.get("updatedAt") || "";

    const where: any = {};

    if (name) where.name = ILike(`%${name}%`);
    if (path) where.path = ILike(`%${path}%`);
    if (icon) where.icon = ILike(`%${icon}%`);

    if (isActive === "true") where.isActive = true;
    if (isActive === "false") where.isActive = false;

    // Filter parent (relasi)
    if (parent) {
      where.parent = { id: parent }; // TypeORM: filter relasi by id
    }

    // sortOrder exact
    if (sortOrderStr) {
      const so = Number(sortOrderStr);
      if (!Number.isNaN(so)) where.sortOrder = so;
    }

    // sortOrder range (optional)
    const minSort = Number(minSortStr);
    const maxSort = Number(maxSortStr);
    const hasMin = !Number.isNaN(minSortStr === "" ? NaN : minSort);
    const hasMax = !Number.isNaN(maxSortStr === "" ? NaN : maxSort);
    if (hasMin && hasMax) where.sortOrder = Between(minSort, maxSort);

    // createdAt (exact day)
    const parsedCreatedAt = z.coerce.date().safeParse(createdAt);
    if (parsedCreatedAt.success) {
      const start = new Date(parsedCreatedAt.data);
      start.setHours(0, 0, 0, 0);
      const end = new Date(parsedCreatedAt.data);
      end.setHours(23, 59, 59, 999);
      where.createdAt = Between(start, end);
    }

    // updatedAt (exact day)
    const parsedUpdatedAt = z.coerce.date().safeParse(updatedAt);
    if (parsedUpdatedAt.success) {
      const start = new Date(parsedUpdatedAt.data);
      start.setHours(0, 0, 0, 0);
      const end = new Date(parsedUpdatedAt.data);
      end.setHours(23, 59, 59, 999);
      where.updatedAt = Between(start, end);
    }

    const { items, total } = await menuService.findAndCount(where, page, pageSize);
    return NextResponse.json({ items, total });
  }
}