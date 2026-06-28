import { NextResponse } from "next/server";

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = NextResponse.redirect(new URL("/login", baseUrl));

    res.cookies.set("session", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0), // cara paling aman untuk hapus cookie
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
