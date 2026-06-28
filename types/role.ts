import { z } from "zod";

export const createRoleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  menus: z.array(z.string().uuid()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const updateRoleSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  menus: z.array(z.string().uuid()).optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;