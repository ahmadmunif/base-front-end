import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const expiresIn = parseInt(process.env.EXPIRES_IN || "3600", 10);
const secretKey = process.env.jwtSecret || "secret"; 
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn + "s")
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
  return payload;
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = Date.now() + expiresIn * 1000;
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    path: "/",
    expires: new Date(parsed.expires),
  });
  return res;
}