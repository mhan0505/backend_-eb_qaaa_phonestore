import { z } from 'zod';

export const checkoutSchema = z.object({
  shippingAddressId: z.coerce.number().int().positive(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'WALLET']),
  customerNote: z.string().trim().max(1000).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
