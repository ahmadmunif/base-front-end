import { NextResponse } from "next/server";
import { MenuService } from "@/services/menuService";
import { updateMenuSchema } from "@/types/menu";

// ✅ GET menu by id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuService = new MenuService();
    const menu = await menuService.findById(params.id);

    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json(menu);
  } catch (err) {
    console.error("GET menu error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ UPDATE menu by id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // validasi pakai zod
    const parsed = updateMenuSchema.parse({ ...body, id: params.id });

    const menuService = new MenuService();
    const updatedMenu = await menuService.update(params.id, parsed);

    return NextResponse.json({ success: true, menu: updatedMenu });
  } catch (err: any) {
    console.error("PUT menu error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuService = new MenuService();

    // cek dulu ada atau tidak
    const menu = await menuService.findById(params.id);
    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    await menuService.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE menu error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}