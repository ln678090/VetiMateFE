# 🐾 Veterinary PetCare Shop — Frontend

<!-- updated -->

> Next.js 16.2.6 · TypeScript · TailwindCSS · shadcn/ui · Framer Motion · Zustand · TanStack Query

Web app khách hàng cho hệ thống phòng khám thú y kết hợp shop pet (chó & mèo).
Kết nối với backend Spring Boot qua REST API.

**Repo backend liên quan:** [graduation_project_be](#) ← link sau khi push xong

---

## 📑 Mục lục

- [Tech Stack](#-tech-stack)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt môi trường](#-cài-đặt-môi-trường)
  - [Node.js 20+](#1-nodejs-20)
  - [pnpm](#2-pnpm-1033)
- [Setup dự án](#-setup-dự-án)
  - [Clone repo](#1-clone-repo)
  - [Install dependencies](#2-install-dependencies)
  - [Tạo .env.local](#3-tạo-envlocal)
  - [Verify BE đã chạy](#4-verify-backend-đang-chạy)
- [Chạy dự án](#-chạy-dự-án)
- [Build production](#-build-production)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Routes & Pages](#-routes--pages)
- [Tài liệu](#-tài-liệu-quan-trọng)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Tech Stack

| Layer            | Tech                      | Version                         |
| ---------------- | ------------------------- | ------------------------------- |
| Framework        | Next.js                   | 16.2.6 (App Router + Turbopack) |
| Language         | TypeScript                | 5.x (strict mode)               |
| Package Manager  | pnpm                      | 10.33.1                         |
| Styling          | TailwindCSS               | 4.x                             |
| UI Components    | shadcn/ui (Radix)         | latest                          |
| Animation        | Framer Motion             | 11.x                            |
| Animation Engine | Anime.js                  | 3.x                             |
| State Management | Zustand                   | 5.x (memory only)               |
| Server State     | TanStack Query            | 5.x                             |
| HTTP Client      | Axios                     | 1.x (split publicApi/api)       |
| Forms            | React Hook Form           | 7.76+                           |
| Validation       | Zod                       | 3.x                             |
| Icons            | lucide-react              | latest                          |
| Utils            | clsx, tailwind-merge, cva | latest                          |
| Notifications    | Sonner (toast)            | latest                          |

---

## 💻 Yêu cầu hệ thống

- **Node.js** 20 LTS trở lên (20.x hoặc 22.x)
- **pnpm** 10.33.1 (CẤM dùng npm/yarn để tránh conflict lockfile)
- **Git**
- **Backend đang chạy** ở `http://localhost:8990` (xem repo BE)
- IDE khuyên dùng: **VS Code** với extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Next.js
  - Pretty TypeScript Errors

---

## ⚙️ Cài đặt môi trường

### 1. Node.js 20+

#### Windows / macOS

Tải installer từ: https://nodejs.org/

Hoặc dùng **nvm-windows** (khuyên dùng):

```powershell
# Windows
choco install nvm
nvm install 20
nvm use 20
```

#### macOS (nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# Restart terminal
nvm install 20
nvm use 20
nvm alias default 20
```

#### Linux (Ubuntu)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Verify

```bash
node --version
# v20.x.x

npm --version
# 10.x.x
```

=---

### 2 pnpm 10.33+

> ⚠️ **Bắt buộc dùng pnpm** — repo có `pnpm-lock.yaml`. Dùng npm/yarn sẽ tạo conflict và có thể break.#### Cài qua corepack (khuyên dùng — đi kèm Node 20+)

```bash
corepack enable
corepack prepare pnpm@10.33.1 --activate
```

#### Cài qua npm

```bash
npm install -g pnpm@10.33.1
```

#### Cài qua standalone script (macOS/Linux)

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

#### Cài qua PowerShell (Windows)

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

#### Verify

```bash
pnpm --version
# 10.33.1
```

=---

## 📦 Setup dự án### 1 Clone repo

```bash
git clone <repo-url> graduation_project_fe
cd graduation_project_fe
```

### 2. Install dependencies

```bash
pnpm install
```

> ⏱️ Lần đầu sẽ mất 2-3 phút để pnpm download và link toàn bộ packages.

> ⚠️ **Nếu thấy lỗi peer dependency** → đó là warning bình thường với Next.js 16 + React 19. Cứ tiếp tục.

### 3. Tạo `.env.local`

Tạo file `.env.local` ở **root repo** (cùng cấp với `package.json`):

```bash
# Linux/macOS
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local
```

Sau đó mở `.env.local` và verify nội dung:

```env
# ===== API Backend =====
NEXT_PUBLIC_API_URL=http://localhost:8990

# ===== App branding =====
NEXT_PUBLIC_APP_NAME=PetCare Vet Shop
```

#### Giải thích các biến

| Biến                   | Mặc định                | Ý nghĩa                                                           |
| ---------------------- | ----------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8990` | URL gốc của BE Spring Boot. Đổi khi deploy hoặc BE chạy port khác |
| `NEXT_PUBLIC_APP_NAME` | `PetCare Vet Shop`      | Tên app hiển thị ở navbar, title, footer                          |

#### Quy tắc env Next.js

- Biến **bắt đầu bằng `NEXT_PUBLIC_`** → expose ra browser (client-side đọc được)
- Biến **không có prefix** → chỉ chạy server-side (Server Components / Route Handlers)
- Sau khi sửa `.env.local` phải **restart `pnpm dev`** (không hot-reload)

> 🔒 **Bảo mật:**
>
> - File `.env.local` **KHÔNG commit** lên Git (đã có sẵn trong `.gitignore`)
> - File `.env.example` **CÓ commit** — để team biết schema
> - Không nhét secret/API key thực vào biến `NEXT_PUBLIC_*` (lộ ra browser)

### 4. Verify backend đang chạy

Trước khi chạy FE, đảm bảo BE đã chạy:

```bash
# Test health check BE
curl http://localhost:8990/actuator/health
# {"status":"UP"}

# Test catalog endpoint (BE Sprint 1.1+)
curl http://localhost:8990/api/catalog/categories/tree
```

Nếu BE chưa chạy → xem README repo BE và chạy `mvn spring-boot:run` trước.

> ⚠️ Nếu cố chạy FE mà BE chưa lên → các API call sẽ fail (Network Error) nhưng app vẫn render được landing page.

---

## ▶️ Chạy dự án

### Development mode (hot reload + Turbopack)

```bash
pnpm dev
```

App chạy ở: **http://localhost:3000**

Mở browser → bạn sẽ thấy landing page với hero animation, navbar sticky, footer 4 cột.

#### Log khởi động thành công

```
> graduation_project_fe@0.1.0 dev
> next dev --turbopack

   ▲ Next.js 16.2.6 (Turbopack)
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1.8s
```

### Test các route chính

| URL                                               | Mô tả                                   |
| ------------------------------------------------- | --------------------------------------- |
| http://localhost:3000                             | Landing page (hero + features + footer) |
| http://localhost:3000/login                       | Login form                              |
| http://localhost:3000/register                    | Register form                           |
| http://localhost:3000/shop                        | Shop catalog (12 products từ BE)        |
| http://localhost:3000/shop/royal-canin-mini-adult | Product detail                          |
| http://localhost:3000/shop/category/food          | Category page                           |
| http://localhost:3000/dashboard                   | Protected route (cần login trước)       |

---

## 🏗️ Build production

### Build

```bash
pnpm build
```

Output:

```
   ▲ Next.js 16.2.6

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages
 ✓ Finalizing page optimization

Route (app)                                 Size  First Load JS
┌ ○ /                                    5.21 kB         142 kB
├ ○ /_not-found                            976 B         103 kB
├ ƒ /dashboard                           2.84 kB         145 kB
├ ○ /login                                4.1 kB         157 kB
├ ○ /register                           4.32 kB         157 kB
├ ƒ /shop                                3.1 kB         148 kB
├ ƒ /shop/[slug]                         3.8 kB         151 kB
└ ƒ /shop/category/[slug]                2.5 kB         145 kB
```

### Start production server

```bash
pnpm start
```

App chạy ở **http://localhost:3000** với build tối ưu (minify, tree-shake, etc.)

### Lint & format

```bash
pnpm lint                  # Check ESLint
pnpm lint --fix            # Auto-fix
```

=---

## 📂 Cấu trúc thư mục

```
graduation_project_fe/
├── public/                              # Static assets (logo, images, favicon)
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── (auth)/                      # Route group - không ảnh hưởng URL
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (public)/                    # Route group - landing + shop
│   │   │   ├── layout.tsx               # Wrap LandingHeader + Footer
│   │   │   ├── page.tsx                 # / Landing page
│   │   │   └── shop/
│   │   │       ├── page.tsx             # /shop catalog
│   │   │       ├── [slug]/page.tsx      # /shop/[slug] product detail
│   │   │       └── category/[slug]/page.tsx
│   │   ├── dashboard/                   # Protected app shell
│   │   │   ├── layout.tsx               # Sidebar + Topbar + RequireAuth
│   │   │   └── page.tsx
│   │   ├── layout.tsx                   # Root layout (providers)
│   │   ├── globals.css                  # Tailwind + custom CSS vars
│   │   └── not-found.tsx                # 404 page
│   ├── components/
│   │   ├── ui/                          # shadcn components (Button, Input, ...)
│   │   ├── shared/                      # AuthHydrator, AuthGuard, FullScreenLoader
│   │   └── animations/                  # FadeIn, Stagger wrappers
│   ├── features/                        # Feature modules
│   │   ├── auth/
│   │   │   └── components/              # LoginForm, RegisterForm
│   │   ├── landing/
│   │   │   └── components/              # Header, Hero, Features, Footer
│   │   └── shop/
│   │       ├── components/              # ProductCard, ProductGrid, Filters, ...
│   │       └── hooks/                   # use-products, use-categories, use-brands
│   ├── services/                        # API service layer
│   │   ├── auth.service.ts
│   │   ├── shop.service.ts              # Real API (sau Sprint 1.2)
│   │   └── catalog.service.ts
│   ├── lib/                             # Utilities chung
│   │   ├── axios.ts                     # publicApi + api + interceptors
│   │   ├── utils.ts                     # cn, formatVND, formatDate
│   │   └── query-client.ts              # TanStack Query config
│   ├── hooks/                           # Custom hooks chung
│   │   ├── use-auth.ts
│   │   └── use-require-auth.ts
│   ├── stores/                          # Zustand stores
│   │   └── auth.store.ts                # Memory only (KHÔNG persist)
│   ├── types/                           # TypeScript types/interfaces
│   │   ├── auth.ts
│   │   ├── catalog.ts
│   │   └── shop.ts
│   ├── schemas/                         # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   ├── catalog.schema.ts
│   │   └── shop.schema.ts
│   └── mock/                            # Mock data (giai đoạn FE-first)
│       └── products.ts                  # Sẽ xoá sau khi BE Sprint 1.2 swap
├── .env.example                         # Template env (commit)
├── .env.local                           # Tự tạo, KHÔNG commit
├── .gitignore
├── components.json                      # shadcn config
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

=---

## 🗺️ Routes & Pages### Public (không cần login)

| Route | File | Mô tả |
| ----------------------- | -------------------------------------------- | --------------------------------- | -------------------------------------------------------- |
| `/` | `app/(public)/page.tsx` | Landing — hero + features + CTA |
| `/login` | `app/(auth)/login/page.tsx` | Đăng nhập |
| `/register` | `app/(auth)/register/page.tsx` | Đăng ký |
| `/shop` | `app/(public)/shop/page.tsx` | Catalog có filter + search + sort |
| `/shop/[slug]` | `app/(public)/shop/[slug]/page.tsx` | Chi tiết sản phẩm |
| `/shop/category/[slug]` | `app/(public)/shop/category/[slug]/page.tsx` | Sản phẩm theo danh mục | ### Protected (cần Bearer token / cookie refresh hợp lệ) |

| Route        | File                     | Mô tả                   |
| ------------ | ------------------------ | ----------------------- |
| `/dashboard` | `app/dashboard/page.tsx` | App shell sau khi login |

---

## 📚 Tài liệu quan trọng### Auth flow

1 **Login** → BE set `HttpOnly cookie refresh_token` (path=`/api/auth`) + trả `accessToken` trong body
2 **Frontend** lưu `accessToken` vào **Zustand memory** (KHÔNG localStorage)
3 **Axios interceptor** tự gắn `Authorization: Bearer <token>` cho mọi request qua instance `api`
4 **Khi 401** → interceptor tự gọi `POST /api/auth/refresh` (cookie tự gửi) → cập nhật `accessToken` → retry request gốc
5 **Reload page** → `accessToken` mất → `AuthHydrator` gọi `/refresh` để khôi phục (timeout 6s)
6 **Logout** → call `/api/auth/logout` (BE xoá cookie + Redis) + clear Zustand### Axios split

```typescript
// src/lib/axios.ts
publicApi  → KHÔNG gắn token. Dùng cho /login, /register, /refresh, /catalog/*, /products/*
api        → GẮN token + auto refresh. Dùng cho /users, /pet, /cart, /booking, ...
```

### Mock service swap pattern

Khi BE chưa có feature → FE dùng mock data:

- File mock: `src/mock/*.ts`
- Service trong `src/services/*.service.ts` đọc từ mock

Khi BE ready → **chỉ sửa 1 file service** từ `MOCK_DATA.filter(...)` thành `publicApi.get(...)`.
**Component và hook không phải đụng gì.**

---

## 🐛 Troubleshooting

### ❌ `EADDRINUSE: address already in use :::3000`

Port 3000 đã bị chiếm.

```bash
# Linux/macOS
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc chạy port khác
pnpm dev -- -p 3001
```

### ❌ `Module not found: Can't resolve '@/lib/...'`

Path alias chưa cấu hình hoặc TS Server cũ.

1. Mở `tsconfig.json` check có:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     }
   }
   ```
2. Trong VS Code: `Ctrl+Shift+P` → `TypeScript: Restart TS Server`
3. Restart `pnpm dev`

### ❌ `Network Error` / `ERR_CONNECTION_REFUSED localhost:8990`

Backend chưa chạy. Quay lại repo BE và:

```bash
mvn spring-boot:run
```

### ❌ CORS error: `No 'Access-Control-Allow-Origin' header`

Backend chưa cho phép origin của FE.

1. Vào file `.env.properties` của BE
2. Sửa biến `CORS_ALLOWED_ORIGINS=http://localhost:3000,...`
3. Restart BE

### ❌ Login OK nhưng `/dashboard` cứ redirect về `/login`

Cookie `refresh_token` không gửi do BE chưa config đúng SameSite/Secure.

- Check Network tab: response `Set-Cookie` có `SameSite=None; Secure; HttpOnly` không
- Nếu dev HTTP → tạm thời BE để `SameSite=Lax` (không cần Secure)

### ❌ `pnpm install` báo `ERR_PNPM_PEER_DEP_ISSUES`

Đó là **warning** với Next.js 16 + React 19 — bỏ qua, không phải lỗi.
Nếu thực sự kẹt:

```bash
pnpm install --no-strict-peer-dependencies
```

### ❌ `Error: Hydration failed` / `Text content does not match`

Code dùng `Date.now()`, `Math.random()`, hoặc `window` trong Server Component.

- Wrap component vào `"use client"`
- Hoặc dùng `useEffect` để chạy chỉ client-side

### ❌ shadcn add → ghi đè `utils.ts` mất hàm `formatVND`

Đã log lỗi này vào ErrorLog (E011). Fix:

1. Mở `src/lib/utils.ts`
2. Thêm lại:
   ```typescript
   export function formatVND(value: number): string {
     return new Intl.NumberFormat('vi-VN', {
       style: 'currency',
       currency: 'VND',
       maximumFractionDigits: 0,
     }).format(value);
   }
   ```

### ❌ Turbopack: `module factory not available`

Cache `.next` bị stale:

```bash
# Stop pnpm dev (Ctrl+C)

# Windows PowerShell
Remove-Item -Recurse -Force .next

# Linux/macOS
rm -rf .next

# Restart
pnpm dev
# Ctrl+Shift+R hard reload trong browser
```

### ❌ Image bị broken / 404

`next.config.ts` chưa whitelist domain ảnh:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // thêm domain khác ở đây
    ],
  },
};

export default nextConfig;
```

Hoặc trên `<Image />` thêm `unoptimized` để tạm bypass:

```tsx
<Image src={url} alt="..." unoptimized />
```

=---

## 📖 Tài liệu liên quan

- [Next.js 16 Docs](https://nextjs.org/docs)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Anime.js](https://animejs.com/)
- [TailwindCSS v4](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- **Repo backend**: [graduation_project_be](#) — link sau khi push

---

## 📄 License

MIT License — Đồ án tốt nghiệp 2026## 👨‍💻 Tác giả

[Your Name] — [your.email@gmail.com]
