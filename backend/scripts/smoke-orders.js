const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres123@localhost:55432/ecommerce_db?schema=public',
    },
  },
});

const baseUrl = 'http://localhost:3002/api';

async function login() {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'customer@example.com',
      password: 'Customer@123',
    }),
  });

  const body = await response.json();
  if (!response.ok || !body?.data?.accessToken) {
    throw new Error(`Login failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body.data.accessToken;
}

async function ensureAddress(userId) {
  let address = await prisma.address.findFirst({ where: { userId } });
  if (!address) {
    address = await prisma.address.create({
      data: {
        userId,
        fullName: 'Nguyen Van A',
        phone: '0987654321',
        province: 'Ho Chi Minh',
        district: 'Quan 1',
        ward: 'Ben Nghe',
        street: '123 Le Loi',
      },
    });
  }

  return address.id;
}

async function getAnyVariantId() {
  const response = await fetch(`${baseUrl}/products/iphone-15-pro-max`);
  const body = await response.json();

  if (!response.ok || !body?.data?.variants?.length) {
    throw new Error(`Get product failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body.data.variants[0].id;
}

async function addCartItem(token, variantId) {
  const response = await fetch(`${baseUrl}/cart/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ variantId, quantity: 1 }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Add cart failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body;
}

async function checkout(token, shippingAddressId) {
  const response = await fetch(`${baseUrl}/orders/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shippingAddressId,
      paymentMethod: 'COD',
      customerNote: 'Smoke checkout test',
    }),
  });

  const body = await response.json();
  return { status: response.status, body };
}

async function run() {
  const token = await login();
  const customer = await prisma.user.findUnique({ where: { email: 'customer@example.com' } });
  if (!customer) {
    throw new Error('Seeded customer not found');
  }

  const addressId = await ensureAddress(customer.id);
  const variantId = await getAnyVariantId();

  await addCartItem(token, variantId);
  const successCheckout = await checkout(token, addressId);
  const emptyCartCheckout = await checkout(token, addressId);

  console.log(
    JSON.stringify({
      variantId,
      addressId,
      checkoutSuccessStatus: successCheckout.status,
      checkoutSuccessCode: successCheckout.body?.error?.code || 'OK',
      checkoutEmptyStatus: emptyCartCheckout.status,
      checkoutEmptyCode: emptyCartCheckout.body?.error?.code || 'OK',
      orderNumber: successCheckout.body?.data?.orderNumber || null,
    })
  );
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
