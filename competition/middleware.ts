import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/pages/login", req.url));
  }

  try {
    const secretKey = process.env.JWT_SECRET as string;
    const decoded: any = jwt.verify(token, secretKey);

    if (decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/pages/login", req.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/pages/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
