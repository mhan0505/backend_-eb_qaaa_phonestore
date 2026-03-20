import { CartService } from '../config/redis';
import { AppError } from '../middlewares/error.middleware';
import { CartRepository } from '../repositories/cart.repository';
import { AddCartItemInput } from '../validators/cart.validator';

interface CartItem {
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  sku: string;
  color: string;
  storage: string;
  ram: string;
  imageUrl: string | null;
  price: number;
  salePrice: number | null;
  quantity: number;
  stockQty: number;
}

interface UserCart {
  items: CartItem[];
  updatedAt?: string;
}

const toNumber = (value: unknown) => Number(value);

export class CartBusinessService {
  static async getCart(userId: number) {
    const cart = (await CartService.getCart(userId)) as UserCart;

    const enrichedItems = cart.items.map((item) => {
      const unitPrice = item.salePrice ?? item.price;
      return {
        ...item,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });

    const subtotal = enrichedItems.reduce((acc, item) => acc + item.lineTotal, 0);
    const totalItems = enrichedItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      items: enrichedItems,
      summary: {
        totalItems,
        subtotal,
      },
      updatedAt: cart.updatedAt ?? null,
    };
  }

  static async addItem(userId: number, input: AddCartItemInput) {
    const variant = await CartRepository.findVariantForCart(input.variantId);
    if (!variant) {
      throw new AppError(404, 'VARIANT_NOT_FOUND', 'Product variant not found');
    }

    const cart = (await CartService.getCart(userId)) as UserCart;
    const existing = cart.items.find((item) => item.variantId === input.variantId);
    const nextQuantity = (existing?.quantity ?? 0) + input.quantity;

    if (nextQuantity > variant.stockQty) {
      throw new AppError(400, 'INSUFFICIENT_STOCK', 'Insufficient stock for requested quantity', {
        stockQty: variant.stockQty,
        requestedQty: nextQuantity,
      });
    }

    if (existing) {
      existing.quantity = nextQuantity;
      existing.stockQty = variant.stockQty;
      existing.price = toNumber(variant.price);
      existing.salePrice = variant.salePrice ? toNumber(variant.salePrice) : null;
    } else {
      cart.items.push({
        variantId: variant.id,
        productId: variant.product.id,
        productName: variant.product.name,
        productSlug: variant.product.slug,
        sku: variant.sku,
        color: variant.color,
        storage: variant.storage,
        ram: variant.ram,
        imageUrl: variant.product.images[0]?.url ?? null,
        price: toNumber(variant.price),
        salePrice: variant.salePrice ? toNumber(variant.salePrice) : null,
        quantity: input.quantity,
        stockQty: variant.stockQty,
      });
    }

    cart.updatedAt = new Date().toISOString();
    await CartService.setCart(userId, cart);

    return this.getCart(userId);
  }

  static async updateItem(userId: number, variantId: number, quantity: number) {
    const variant = await CartRepository.findVariantForCart(variantId);
    if (!variant) {
      throw new AppError(404, 'VARIANT_NOT_FOUND', 'Product variant not found');
    }

    if (quantity > variant.stockQty) {
      throw new AppError(400, 'INSUFFICIENT_STOCK', 'Insufficient stock for requested quantity', {
        stockQty: variant.stockQty,
        requestedQty: quantity,
      });
    }

    const cart = (await CartService.getCart(userId)) as UserCart;
    const index = cart.items.findIndex((item) => item.variantId === variantId);
    if (index < 0) {
      throw new AppError(404, 'CART_ITEM_NOT_FOUND', 'Cart item not found');
    }

    cart.items[index].quantity = quantity;
    cart.items[index].stockQty = variant.stockQty;
    cart.items[index].price = toNumber(variant.price);
    cart.items[index].salePrice = variant.salePrice ? toNumber(variant.salePrice) : null;
    cart.updatedAt = new Date().toISOString();

    await CartService.setCart(userId, cart);
    return this.getCart(userId);
  }

  static async removeItem(userId: number, variantId: number) {
    const cart = (await CartService.getCart(userId)) as UserCart;
    const nextItems = cart.items.filter((item) => item.variantId !== variantId);

    if (nextItems.length === cart.items.length) {
      throw new AppError(404, 'CART_ITEM_NOT_FOUND', 'Cart item not found');
    }

    const nextCart: UserCart = {
      items: nextItems,
      updatedAt: new Date().toISOString(),
    };
    await CartService.setCart(userId, nextCart);

    return this.getCart(userId);
  }
}
