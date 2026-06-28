import { NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("session="))?.split("=")[1];
  if (!cookie) return NextResponse.json({ userData: null });

  try {
    const data = await decrypt(cookie);
    return NextResponse.json({ userData: data.userData });
  } catch (err) {
    return NextResponse.json({ userData: null });
  }
}