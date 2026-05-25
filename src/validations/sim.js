import { z } from "zod";

export const simSchema = z.object({
  simNumber: z.string().min(3).max(64),
  carrierId: z.string().min(12).max(32)
});

export const bulkSimSchema = z.object({
  simNumber: z.string().min(3).max(64),
  carrierName: z.string().min(2).max(120)
});

export const simQuerySchema = z.object({
  q: z.string().optional().default(""),
  carrierId: z.string().optional().default(""),
  status: z.enum(["all", "available", "activated"]).optional().default("all"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

export const bulkSimsSchema = z.object({
  sims: z.array(bulkSimSchema).min(1).max(1000)
});
