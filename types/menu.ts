import { z } from "zod";

// ✅ Schema untuk create menu
export const createMenuSchema = z.object({  
  name: z.string().min(2).max(100),
  path: z.string().min(1).max(200),
  icon: z.string().max(100).optional(),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  parent: z.uuid().nullable().optional(),
});

export type CreateMenuInput = z.infer<typeof createMenuSchema>;

// ✅ Schema untuk update menu
export const updateMenuSchema = createMenuSchema.partial().extend({  
  id: z.uuid(),
});

export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;