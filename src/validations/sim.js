import { z } from "zod";

export const simSchema = z.object({
  simNumber: z.string().min(3).max(64),
  networkChannel: z.string().min(2).max(80),
  assignedScheme: z.string().min(2).max(120),
  status: z.enum(["available", "activated"]).default("available")
});

export const simQuerySchema = z.object({
  q: z.string().optional().default(""),
  network: z.string().optional().default(""),
  scheme: z.string().optional().default(""),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
});

export const bulkSimsSchema = z.object({
  sims: z.array(simSchema).min(1).max(1000)
});
