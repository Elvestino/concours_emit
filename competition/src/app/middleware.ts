import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("⚡ Middleware exécuté !");
  console.log("URL demandée:", req.url);

  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  console.log("Secret dans l'URL:", secret); // Vérifie si le secret est bien détecté

  if (secret === "monmotdepasse") {
    console.log("✅ Secret correct, définition du cookie...");
    const res = NextResponse.redirect(new URL("/admin", req.url));
    res.cookies.set("adminSecret", "monmotdepasse", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res;
  }

  const hasAccess = req.cookies.get("adminSecret")?.value === "monmotdepasse";
  console.log("Cookie adminSecret:", req.cookies.get("adminSecret")?.value);

  if (req.nextUrl.pathname === "/pages/admin" && !hasAccess) {
    console.log("🚫 Accès refusé, redirection vers /pages/users");
    return NextResponse.redirect(new URL("/pages/users", req.url));
  }

  return NextResponse.next();
}

// 🔹 Vérifie que le middleware s'applique bien à toutes les pages
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
