import { NextResponse } from "next/server";
import { UserService } from "@/services/userService"; 


export async function GET(req: Request,{ params }: { params: { id: string } }) {
  try {
    const userService = new UserService();

    const user = await userService.findById(params.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const userService = new UserService();

    const updatedUser = await userService.update(params.id, body);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
