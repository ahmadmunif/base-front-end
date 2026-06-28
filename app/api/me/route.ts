import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ userData: null }, { status: 401 });
  }

  try {
    const { userData } = session;
    return NextResponse.json({ userData });
  } catch (e) {
    return NextResponse.json({ userData: null }, { status: 401 });
  }
}
