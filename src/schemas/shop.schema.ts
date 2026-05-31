import { z } from 'zod';

export const productCategorySchema = z.enum(['food', 'toys', 'litter', 'accessories', 'grooming']);

export const petTypeSchema = z.enum(['dog', 'cat', 'both']);

export const productSortSchema = z.enum([
  'featured',
  'price-asc',
  'price-desc',
  'rating-desc',
  'newest',
]);

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  categories: z.array(productCategorySchema).optional(),
  petTypes: z.array(petTypeSchema).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  inStockOnly: z.boolean().optional(),
  sort: productSortSchema.default('featured'),
});

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
