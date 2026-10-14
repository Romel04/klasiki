import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(1, "Enter your full name"),
  customerPhone: z
    .string()
    .trim()
    .refine((v) => /^(?:\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, "")), "Enter a valid Bangladeshi mobile number"),
  customerEmail: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  shippingAddress: z.string().trim().min(5, "Enter your full delivery address"),
  districtId: z.string().min(1, "Select your district"),
  thanaId: z.string().optional(),
  specialNotes: z.string().trim().optional(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
