import { PaymentMethod } from '@prisma/client';
import prisma from '../config/database';
import { CartService } from '../config/redis';
import { AppError } from '../middlewares/error.middleware';
import { OrderRepository } from '../repositories/order.repository';
import { CheckoutInput } from '../validators/orders.validator';

interface CartItem {
  variantId: number;
  quantity: number;
  price: number;
  salePrice: number | null;
}

interface UserCart {
  items: CartItem[];
  updatedAt?: string;
}

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `OD${timestamp}${random}`;
};

export class OrdersService {
  static async checkout(userId: number, payload: CheckoutInput) {
    const cart = (await CartService.getCart(userId)) as UserCart;
    if (!cart.items || cart.items.length === 0) {
      throw new AppError(400, 'CART_EMPTY', 'Cart is empty');
    }

    const address = await OrderRepository.findAddressForUser(userId, payload.shippingAddressId);
    if (!address) {
      throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Shipping address not found');
    }

    const variantIds = cart.items.map((item) => item.variantId);
    const variants = await OrderRepository.findVariantsForCheckout(variantIds);
    if (variants.length !== variantIds.length) {
      throw new AppError(404, 'VARIANT_NOT_FOUND', 'One or more product variants not found');
    }

    const variantMap = new Map(variants.map((variant) => [variant.id, variant]));
    for (const item of cart.items) {
      const variant = variantMap.get(item.variantId);
      if (!variant) {
        throw new AppError(404, 'VARIANT_NOT_FOUND', `Variant ${item.variantId} not found`);
      }

      if (variant.stockQty < item.quantity) {
        throw new AppError(400, 'INSUFFICIENT_STOCK', 'Insufficient stock for checkout', {
          variantId: item.variantId,
          stockQty: variant.stockQty,
          requestedQty: item.quantity,
        });
      }
    }

    const subtotal = cart.items.reduce((acc, item) => {
      const unitPrice = item.salePrice ?? item.price;
      return acc + unitPrice * item.quantity;
    }, 0);

    const shippingAddress = `${address.street}, ${address.ward}, ${address.district}, ${address.province}`;
    const orderNumber = generateOrderNumber();

    const result = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        const updated = await OrderRepository.decrementVariantStock(tx, item.variantId, item.quantity);
        if (updated.count !== 1) {
          throw new AppError(400, 'INSUFFICIENT_STOCK', 'Insufficient stock for checkout', {
            variantId: item.variantId,
          });
        }
      }

      const order = await OrderRepository.createOrder(tx, {
        orderNumber,
        userId,
        shippingAddressId: address.id,
        shippingName: address.fullName,
        shippingPhone: address.phone,
        shippingAddress,
        subtotal,
        total: subtotal,
        paymentMethod: payload.paymentMethod as PaymentMethod,
        customerNote: payload.customerNote,
      });

      await OrderRepository.createOrderItems(
        tx,
        cart.items.map((item) => {
          const unitPrice = item.salePrice ?? item.price;
          return {
            orderId: order.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: unitPrice,
            subtotal: unitPrice * item.quantity,
          };
        })
      );

      await OrderRepository.createOrderStatusHistory(
        tx,
        order.id,
        userId,
        'Order created from checkout'
      );

      await OrderRepository.createPayment(
        tx,
        order.id,
        subtotal,
        payload.paymentMethod as PaymentMethod
      );

      await OrderRepository.createInventoryLogs(
        tx,
        cart.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          referenceId: order.id,
          createdBy: userId,
        }))
      );

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        discount: Number(order.discount),
        total: Number(order.total),
        createdAt: order.createdAt,
        itemsCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
      };
    });

    await CartService.deleteCart(userId);

    return result;
  }
}
