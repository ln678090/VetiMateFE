import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  parentId: z.string().uuid().nullable().optional(),
  sortOrder: z.number(),
});

// Recursive type — Zod requires manual recursion
type CategoryTreeInput = z.infer<typeof categorySchema> & {
  children: CategoryTreeInput[];
};

export const categoryTreeSchema: z.ZodType<CategoryTreeInput> = z.lazy(() =>
  categorySchema.extend({
    children: z.array(categoryTreeSchema),
  })
);

export const brandSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
});
