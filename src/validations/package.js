import { z } from "zod";

export const packageSchema = z.object({
  carrierName: z.string().min(2).max(120),
  name: z.string().min(2).max(120),
  price: z.coerce.number().min(0)
});

export const packageQuerySchema = z.object({
  q: z.string().optional().default(""),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});
