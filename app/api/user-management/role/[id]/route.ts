import { NextResponse } from "next/server";
import { RoleService } from "@/services/roleService";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const roleService = new RoleService();

    const role = await roleService.findById(params.id);

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const roleService = new RoleService();

    const updatedRole = await roleService.update(params.id, body);

    return NextResponse.json({ success: true, role: updatedRole });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const roleService = new RoleService();

    // cek dulu ada atau tidak
    const role = await roleService.findById(params.id);
    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    await roleService.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE role error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}