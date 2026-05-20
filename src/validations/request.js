import { z } from "zod";

export const activationRequestSchema = z.object({
  customerName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(30),
  simNumber: z.string().min(3).max(64),
  provider: z.string().min(2).max(80),
  requestId: z.string().min(3).max(40),
  status: z.enum(["pending", "approved", "activated", "rejected"]).default("pending")
});

export const requestQuerySchema = z.object({
  status: z.enum(["all", "pending", "approved", "activated", "rejected"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});
