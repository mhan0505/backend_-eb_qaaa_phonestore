import crypto from 'crypto';
import { ProductVariant } from '@prisma/client';
import { CacheService } from '../config/redis';
import { ProductRepository } from '../repositories/product.repository';
import { ListProductsQuery } from '../validators/product.validator';
import { AppError } from '../middlewares/error.middleware';

const PRODUCTS_LIST_TTL_SECONDS = 60 * 10;
const PRODUCT_DETAIL_TTL_SECONDS = 60 * 30;

const getDisplayPrice = (basePrice: unknown, variants: Array<Pick<ProductVariant, 'price' | 'salePrice'>>) => {
  if (!variants.length) {
    return Number(basePrice);
  }

  const prices = variants.map((v) => Number(v.salePrice ?? v.price));
  return Math.min(...prices);
};

export class ProductsService {
  static async listProducts(query: ListProductsQuery) {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(query))
      .digest('hex');

    const cacheKey = `products:list:${query.page}:${hash}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const { items, total } = await ProductRepository.findMany(query);

    const data = {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        shortDesc: item.shortDesc,
        basePrice: Number(item.basePrice),
        salePrice: item.salePrice ? Number(item.salePrice) : null,
        displayPrice: getDisplayPrice(item.basePrice, item.variants),
        stockTotal: item.variants.reduce((acc, v) => acc + v.stockQty, 0),
        isFeatured: item.isFeatured,
        brand: item.brand,
        category: item.category,
        image: item.images[0]?.url ?? null,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };

    await CacheService.set(cacheKey, data, PRODUCTS_LIST_TTL_SECONDS);
    return data;
  }

  static async getProductDetail(identifier: string) {
    const cacheKey = `product:detail:${identifier}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await ProductRepository.findDetailByIdentifier(identifier);
    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found');
    }

    const data = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDesc: product.shortDesc,
      basePrice: Number(product.basePrice),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      displayPrice: getDisplayPrice(product.basePrice, product.variants),
      specs: product.specs,
      status: product.status,
      isFeatured: product.isFeatured,
      viewCount: product.viewCount,
      soldCount: product.soldCount,
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
        logoUrl: product.brand.logoUrl,
      },
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      images: product.images,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        color: variant.color,
        storage: variant.storage,
        ram: variant.ram,
        price: Number(variant.price),
        salePrice: variant.salePrice ? Number(variant.salePrice) : null,
        stockQty: variant.stockQty,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    await CacheService.set(cacheKey, data, PRODUCT_DETAIL_TTL_SECONDS);
    return data;
  }
}
