import { z } from "zod";

export const settingSchema = z.object({
  businessName: z.string().min(2).max(120),
  supportEmail: z.string().email(),
  autoActivation: z.boolean(),
  maintenanceMode: z.boolean()
});
