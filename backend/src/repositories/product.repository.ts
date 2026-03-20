import { Prisma, ProductStatus } from '@prisma/client';
import prisma from '../config/database';
import { ListProductsQuery } from '../validators/product.validator';

export class ProductRepository {
  static buildWhere(query: ListProductsQuery): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
    };

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { shortDesc: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.brand) {
      where.brand = {
        OR: [
          { slug: { equals: query.brand.toLowerCase() } },
          { name: { equals: query.brand, mode: 'insensitive' } },
        ],
      };
    }

    if (query.category) {
      where.category = {
        OR: [
          { slug: { equals: query.category.toLowerCase() } },
          { name: { equals: query.category, mode: 'insensitive' } },
        ],
      };
    }

    if (query.featured !== undefined) {
      where.isFeatured = query.featured;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.basePrice = {
        gte: query.minPrice,
        lte: query.maxPrice,
      };
    }

    return where;
  }

  static async findMany(query: ListProductsQuery) {
    const where = this.buildWhere(query);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              url: true,
              alt: true,
              isPrimary: true,
              displayOrder: true,
            },
            orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              price: true,
              salePrice: true,
              stockQty: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  }

  static async findDetailByIdentifier(identifier: string) {
    const asId = Number(identifier);
    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      OR: [{ slug: identifier }],
    };

    if (!Number.isNaN(asId)) {
      where.OR?.push({ id: asId });
    }

    return prisma.product.findFirst({
      where,
      include: {
        brand: true,
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { displayOrder: 'asc' }],
        },
        variants: {
          where: { isActive: true },
          orderBy: [{ price: 'asc' }, { displayOrder: 'asc' }],
        },
      },
    });
  }
}
