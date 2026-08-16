# Implementation Plan: Staff Pages Data Integration

## Goal
Replace placeholders in Staff Dashboard, Products, Catalog, and Inventory pages with real data fetched from the backend APIs.

## Open Questions
- The backend does not currently have a dedicated `/api/staff/dashboard` endpoint for aggregate statistics. I will simulate the dashboard statistics by fetching the first page of products, orders, etc., and using the `total` fields. Is this acceptable for now?
- The backend `StaffProductController` does not have a `LOW_STOCK` filter. I will fetch the first page of products and filter them on the frontend for the "Sản phẩm sắp hết hàng" widget. Is this acceptable?

## Proposed Changes

### 1. `src/lib/constants.ts`
- [MODIFY] Add `catalog: { categories: '/api/catalog/categories', brands: '/api/catalog/brands' }` to `API_ROUTES`.

### 2. `src/services/staff.service.ts`
- [MODIFY] Refactor all methods to use the `unwrap` helper from `src/lib/axios.ts` to flatten `ApiResp<T>` and avoid `data?.data?.items` issues.
- [MODIFY] Add `getCategories` and `getBrands` methods calling the new catalog API routes.
- [MODIFY] Add `getDashboardStats` to aggregate total counts for the dashboard.

### 3. `src/app/staff/dashboard/page.tsx`
- [MODIFY] Remove placeholder code.
- [MODIFY] Fetch dashboard stats, recent orders, and low stock products using `react-query`.
- [MODIFY] Render actual data in the widgets and tables.

### 4. `src/app/staff/products/page.tsx`
- [MODIFY] Fix potential rendering crashes by safely checking `data?.items?.length` and using optional chaining.
- [MODIFY] Adapt to the `unwrap`ped `staffService.getProducts` response.

### 5. `src/app/staff/catalog/page.tsx`
- [MODIFY] Implement `useQuery` for `getCategories` and `getBrands`.
- [MODIFY] Build the tables for Categories and Brands using the fetched data.

### 6. `src/app/staff/inventory/page.tsx`
- [MODIFY] Implement `useQuery` for `getInventory`.
- [MODIFY] Build the table for Inventory using the fetched data.

## Verification Plan
- Login as Staff account (`shopstaff@vetimate.com`).
- Navigate to Dashboard and verify statistics, recent orders, and low stock items load correctly.
- Navigate to Products, Catalog, and Inventory pages and verify data is displayed in the tables without errors.