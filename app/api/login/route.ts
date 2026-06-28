import { NextResponse } from "next/server";
import { z } from "zod";
import { UserService } from "@/services/userService";
import { buildMenuTree, buildSafeRoutes } from "@/lib/menuTree";
import { encrypt } from "@/lib/auth";

const expiresIn = parseInt(process.env.EXPIRES_IN || "3600", 10);

export async function POST(req: Request) {
  const userService = new UserService();

  const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  });

  try {
    const body = await req.json();
    const { username, password } = loginSchema.parse(body);

    // Ambil user beserta roles dan menus
    const user = await userService.findByUsername(username);
    if (!user || !user.isActive)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await userService.checkPassword(password, user.passwordHash);
    if (!valid)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Flat roles untuk session
    const roles = user.roles.map((r) => ({ id: r.id, name: r.name }));

    // Ambil semua menu termasuk parent dan children
    const allMenus: any[] = [];
    user.roles.forEach((role) => {
      role.menus.forEach((menu: any) => {
        if (!allMenus.find((m) => m.id === menu.id)) allMenus.push(menu);

        // Masukkan parent jika ada
        if (menu.parent && !allMenus.find((p) => p.id === menu.parent.id)) {
          allMenus.push(menu.parent);
        }

        // Jika menu ini parent, masukkan semua children
        if (menu.children && menu.children.length) {
          menu.children.forEach((child: any) => {
            if (!allMenus.find((m) => m.id === child.id)) allMenus.push(child);

            // pastikan parent child ada
            if (child.parent && !allMenus.find((p) => p.id === child.parent.id)) {
              allMenus.push(child.parent);
            }
          });
        }
      });
    });

    // Build tree dan safe routes untuk frontend
    const menuTree = buildMenuTree(allMenus);
    const menuRoutes = buildSafeRoutes(menuTree);

    // Siapkan data session
    const userData = {
      username: user.username,
      name: user.fullName,
      roles,
      menuRoutes,
    };

    const session = await encrypt({ userData, expires: Date.now() + expiresIn * 1000 });

    const res = NextResponse.json({ success: true });
    res.cookies.set("session", session, {
      httpOnly: true,
      path: "/",
      maxAge: expiresIn,
    });
    return res;

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}