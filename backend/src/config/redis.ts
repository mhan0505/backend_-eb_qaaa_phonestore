import Redis from 'ioredis';

// Redis client singleton
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redis;

// ============================================
// CART SERVICE
// ============================================
export class CartService {


 static async getCart(userId: number) {
    const data = await redis.get(`cart:${userId}`);
    return data ? JSON.parse(data) : { items: [] };
  }

  static async setCart(userId: number, cart: any) {
    const ttl = 60 * 60 * 24 * 7; // 7 days
    await redis.set(`cart:${userId}`, JSON.stringify(cart), 'EX', ttl);
  }

  static async deleteCart(userId: number) {
    await redis.del(`cart:${userId}`);
  }

  static async addItem(userId: number, item: any) {
    const cart = await this.getCart(userId);
    const existingIndex = cart.items.findIndex((i: any) => i.variantId === item.variantId);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    cart.updatedAt = new Date().toISOString();
    await this.setCart(userId, cart);
    return cart;
  }

  static async updateItem(userId: number, variantId: number, quantity: number) {
    const cart = await this.getCart(userId);
    const item = cart.items.find((i: any) => i.variantId === variantId);

    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter((i: any) => i.variantId !== variantId);
      } else {
        item.quantity = quantity;
      }
      cart.updatedAt = new Date().toISOString();
      await this.setCart(userId, cart);
    }

    return cart;
  }

  static async removeItem(userId: number, variantId: number) {
    return this.updateItem(userId, variantId, 0);
  }
}

// ============================================
// CACHE SERVICE
// ============================================
export class CacheService {
  static async get(key: string) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key: string, value: any, ttlSeconds: number) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  static async del(key: string) {
    await redis.del(key);
  }

  static async delPattern(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

// ============================================
// RATE LIMITER
// ============================================
export class RateLimiter {
  static async check(key: string, limit: number, windowSeconds: number): Promise<boolean> {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    return current <= limit;
  }

  static async getRemainingRequests(key: string, limit: number): Promise<number> {
    const current = await redis.get(key);
    return limit - (current ? parseInt(current) : 0);
  }
}
