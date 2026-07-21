import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware - hiện tại CHỈ pass-through.
 *
 * Lý do KHÔNG check auth ở Edge:
 *   Cookie refresh_token có path=/api/auth, không gửi cho /dashboard.
 *   → Không thể detect auth state từ Edge.
 *
 * Việc bảo vệ route được handle ở client bằng <RequireAuth> (use-require-auth.ts).
 * AuthHydrator sẽ gọi /refresh khi mount để verify session thật.
 */
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)',
  ],
};
