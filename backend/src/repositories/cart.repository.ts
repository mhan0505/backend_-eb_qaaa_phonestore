import { ProductStatus } from '@prisma/client';
import prisma from '../config/database';

export class CartRepository {
  static async findVariantForCart(variantId: number) {
    return prisma.productVariant.findFirst({
      where: {
        id: variantId,
        isActive: true,
        product: {
          status: ProductStatus.ACTIVE,
        },
      },
      select: {
        id: true,
        sku: true,
        color: true,
        storage: true,
        ram: true,
        price: true,
        salePrice: true,
        stockQty: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              where: {
                isPrimary: true,
              },
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
      },
    });
  }
}
