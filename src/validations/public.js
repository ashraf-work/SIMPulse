import { z } from "zod";

export const startActivationSchema = z.object({
  simNumber: z.string().regex(/^\d{6,20}$/, "SIM number must be a numeric string.")
});

export const publicActivationSchema = z.object({
  customerName: z.string().min(2, "Name is required.").max(120),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Phone number is required.").max(30),
  simNumber: z.string().regex(/^\d{6,20}$/, "SIM number must be a numeric string."),
  source: z.enum(["Direct", "Amazon", "eBay", "Retail Store", "Partner Outlet"], {
    message: "Select an activation source."
  })
});

export const publicStatusSchema = z.object({
  query: z.string().min(3, "Enter a reference ID or SIM number.").max(80)
});

export const contactSchema = z.object({
  subject: z.string().min(3, "Subject is required.").max(140),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(2000)
});
