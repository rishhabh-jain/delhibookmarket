import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  address_1: z.string().min(1),
  address_2: z.string().optional(),
  city: z.string().min(1),
  postcode: z
    .string()
    .regex(/^\d{6}$/, { message: "Postcode must be 6 digits" }),
  country: z.enum(["india", "usa", "uk"]),
  state: z.string().min(1),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  reviewInvite: z.boolean().optional(),
  createAccount: z.boolean().optional(),
});
