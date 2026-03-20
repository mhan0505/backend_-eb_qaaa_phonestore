import {
  InventoryType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  ProductStatus,
} from '@prisma/client';
import prisma from '../config/database';

export class OrderRepository {
  static findAddressForUser(userId: number, addressId: number) {
    return prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });
  }

  static findVariantsForCheckout(variantIds: number[]) {
    return prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
        isActive: true,
        product: {
          status: ProductStatus.ACTIVE,
        },
      },
      select: {
        id: true,
        sku: true,
        stockQty: true,
      },
    });
  }

  static decrementVariantStock(
    tx: Prisma.TransactionClient,
    variantId: number,
    quantity: number
  ) {
    return tx.productVariant.updateMany({
      where: {
        id: variantId,
        stockQty: {
          gte: quantity,
        },
      },
      data: {
        stockQty: {
          decrement: quantity,
        },
      },
    });
  }

  static createOrder(
    tx: Prisma.TransactionClient,
    data: {
      orderNumber: string;
      userId: number;
      shippingAddressId: number;
      shippingName: string;
      shippingPhone: string;
      shippingAddress: string;
      subtotal: number;
      total: number;
      paymentMethod: PaymentMethod;
      customerNote?: string;
    }
  ) {
    return tx.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: data.userId,
        shippingAddressId: data.shippingAddressId,
        shippingName: data.shippingName,
        shippingPhone: data.shippingPhone,
        shippingAddress: data.shippingAddress,
        subtotal: data.subtotal,
        shippingFee: 0,
        discount: 0,
        total: data.total,
        paymentMethod: data.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        orderStatus: OrderStatus.PENDING,
        customerNote: data.customerNote,
      },
    });
  }

  static createOrderItems(
    tx: Prisma.TransactionClient,
    rows: Array<{
      orderId: number;
      variantId: number;
      quantity: number;
      price: number;
      subtotal: number;
    }>
  ) {
    return tx.orderItem.createMany({
      data: rows,
    });
  }

  static createOrderStatusHistory(
    tx: Prisma.TransactionClient,
    orderId: number,
    changedBy: number,
    note: string
  ) {
    return tx.orderStatusHistory.create({
      data: {
        orderId,
        fromStatus: null,
        toStatus: OrderStatus.PENDING,
        note,
        changedBy,
      },
    });
  }

  static createPayment(
    tx: Prisma.TransactionClient,
    orderId: number,
    amount: number,
    method: PaymentMethod
  ) {
    return tx.payment.create({
      data: {
        orderId,
        amount,
        method,
        status: PaymentStatus.PENDING,
      },
    });
  }

  static createInventoryLogs(
    tx: Prisma.TransactionClient,
    rows: Array<{
      variantId: number;
      quantity: number;
      referenceId: number;
      createdBy: number;
    }>
  ) {
    return tx.inventoryLog.createMany({
      data: rows.map((row) => ({
        variantId: row.variantId,
        type: InventoryType.SALE,
        quantity: -Math.abs(row.quantity),
        note: 'Stock reduced by checkout order',
        referenceId: row.referenceId,
        createdBy: row.createdBy,
      })),
    });
  }
}
