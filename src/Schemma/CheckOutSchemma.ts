import { z } from "zod";

export const checkoutSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email (e.g. abc@gmail.com)" }),
  first_name: z
    .string()
    .min(1, { message: "First name cannot be empty" }),
  last_name: z
    .string()
    .min(1, { message: "Last name cannot be empty" }),
  address_1: z
    .string()
    .min(1, { message: "Please enter your house / flat / building details" }),
  address_2: z
    .string()
    .min(1, { message: "Please enter your area / street / landmark" }),
  city: z
    .string()
    .min(1, { message: "City name is required" }),
  postcode: z
    .string()
    .regex(/^\d{6}$/, { message: "Please enter a valid 6-digit PIN code" }),
  country: z.enum(["india", "usa", "uk"], {
    errorMap: () => ({ message: "Please select your country" }),
  }),
  state: z
    .string()
    .min(1, { message: "State name is required" }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number" }),
  reviewInvite: z.boolean().optional(),
  createAccount: z.boolean().optional(),
});
