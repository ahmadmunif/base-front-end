import id from "@/locales/id";
import { z } from "zod";

export const createUserSchema = z.object({
  id: z.uuid(),
  username: z.string().min(3).max(100),
  email: z.string().email().max(150),
  password: z.string().min(6), // plain password, wajib
  fullName: z.string().max(150).optional(),
  isActive: z.boolean().optional().default(true),
  roles: z.array(z.uuid()).min(1, "At least one role must be selected"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().extend({  
  password: z.string().min(6).optional(), // optional
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
