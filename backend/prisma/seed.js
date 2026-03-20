"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    // Clean existing data (optional - comment out in production)
    console.log('🗑️  Cleaning existing data...');
    await prisma.voucherUsage.deleteMany();
    await prisma.voucher.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.review.deleteMany();
    await prisma.orderStatusHistory.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventoryLog.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.category.deleteMany();
    await prisma.address.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.cmsPage.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.user.deleteMany();
    // 1. Create users
    console.log('👤 Creating users...');
    const hashedPassword = await bcrypt_1.default.hash('Admin@123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@phonestore.vn',
            password: hashedPassword,
            fullName: 'Admin User',
            phone: '0901234567',
            role: client_1.Role.ADMIN,
            emailVerified: true,
        },
    });
    const customer = await prisma.user.create({
        data: {
            email: 'customer@example.com',
            password: await bcrypt_1.default.hash('Customer@123', 10),
            fullName: 'Nguyễn Văn A',
            phone: '0987654321',
            role: client_1.Role.CUSTOMER,
            emailVerified: true,
        },
    });
    console.log(`✅ Created admin: ${admin.email}`);
    console.log(`✅ Created customer: ${customer.email}`);
    // 2. Create brands
    console.log('📱 Creating brands...');
    const brands = await Promise.all([
        prisma.brand.create({
            data: {
                name: 'Apple',
                slug: 'apple',
                description: 'Apple Inc. - Thiết kế đẳng cấp từ California',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
            },
        }),
        prisma.brand.create({
            data: {
                name: 'Samsung',
                slug: 'samsung',
                description: 'Samsung - Công nghệ tiên phong từ Hàn Quốc',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
            },
        }),
        prisma.brand.create({
            data: {
                name: 'Xiaomi',
                slug: 'xiaomi',
                description: 'Xiaomi - Hiệu năng vượt trội, giá cả hợp lý',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
            },
        }),
        prisma.brand.create({
            data: {
                name: 'OPPO',
                slug: 'oppo',
                description: 'OPPO - Camera sắc nét, thiết kế thời trang',
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/OPPO_Logo.svg',
            },
        }),
        prisma.brand.create({
            data: {
                name: 'Vivo',
                slug: 'vivo',
                description: 'Vivo - Âm thanh và camera chuyên nghiệp',
                logoUrl: 'https://via.placeholder.com/200x80?text=VIVO',
            },
        }),
    ]);
    console.log(`✅ Created ${brands.length} brands`);
    // 3. Create categories
    console.log('📂 Creating categories...');
    const smartphonesCategory = await prisma.category.create({
        data: {
            name: 'Điện thoại',
            slug: 'dien-thoai',
            description: 'Điện thoại thông minh chính hãng',
            displayOrder: 1,
        },
    });
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Flagship',
                slug: 'flagship',
                description: 'Dòng cao cấp, cấu hình mạnh nhất',
                parentId: smartphonesCategory.id,
                displayOrder: 1,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Tầm trung',
                slug: 'tam-trung',
                description: 'Cân bằng giữa hiệu năng và giá cả',
                parentId: smartphonesCategory.id,
                displayOrder: 2,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Phổ thông',
                slug: 'pho-thong',
                description: 'Giá rẻ, phù hợp sinh viên',
                parentId: smartphonesCategory.id,
                displayOrder: 3,
            },
        }),
    ]);
    console.log(`✅ Created ${categories.length + 1} categories`);
    // 4. Create products with variants
    console.log('📦 Creating products...');
    // Helper function to create product with variants
    async function createProduct(data) {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                shortDesc: data.shortDesc,
                brandId: data.brandId,
                categoryId: data.categoryId,
                basePrice: data.basePrice,
                salePrice: data.salePrice,
                costPrice: data.costPrice,
                specs: data.specs,
                status: client_1.ProductStatus.ACTIVE,
                isFeatured: data.isFeatured || false,
            },
        });
        // Create variants
        const variants = await Promise.all(data.variants.map((v) => prisma.productVariant.create({
            data: {
                productId: product.id,
                sku: v.sku,
                color: v.color,
                storage: v.storage,
                ram: v.ram,
                price: v.price,
                salePrice: v.salePrice,
                stockQty: v.stockQty,
            },
        })));
        // Create images
        await Promise.all(data.images.map((img, index) => prisma.productImage.create({
            data: {
                productId: product.id,
                url: img.url,
                alt: img.alt || data.name,
                isPrimary: index === 0,
                displayOrder: index,
            },
        })));
        return { product, variants };
    }
    // ==================== APPLE ====================
    const appleProducts = [
        {
            name: 'iPhone 15 Pro Max',
            slug: 'iphone-15-pro-max',
            shortDesc: 'Titan mạnh mẽ. Vô cùng Pro.',
            description: 'iPhone 15 Pro Max. Thiết kế titan chuẩn hàng không vũ trụ. Chip A17 Pro mạnh mẽ. Camera  hệ Pro đột phá. Và nút Tác vụ tùy biến để nhanh chóng truy cập tính năng yêu thích của bạn.',
            brandId: brands[0].id, // Apple
            categoryId: categories[0].id, // Flagship
            basePrice: 29990000,
            salePrice: 28490000,
            costPrice: 25000000,
            isFeatured: true,
            specs: {
                screen: '6.7 inch Super Retina XDR OLED',
                resolution: '2796 x 1290 pixels, 460 ppi',
                os: 'iOS 17',
                chip: 'Apple A17 Pro 3nm 6-core',
                mainCamera: 'Camera chính 48MP, Ultra Wide 12MP, Telephoto 12MP (5x zoom quang học)',
                frontCamera: '12MP TrueDepth',
                battery: '4422 mAh, sạc nhanh 20W, MagSafe 15W',
                charging: 'USB-C, sạc không dây MagSafe',
                sim: '1 Nano SIM + 1 eSIM',
                weight: '221g',
                waterproof: 'IP68',
            },
            variants: [
                { sku: 'IP15PM-256-NTI', color: 'Titan Tự Nhiên', storage: '256GB', ram: '8GB', price: 29990000, salePrice: 28490000, stockQty: 50 },
                { sku: 'IP15PM-256-BLU', color: 'Titan Xanh', storage: '256GB', ram: '8GB', price: 29990000, salePrice: 28490000, stockQty: 40 },
                { sku: 'IP15PM-256-BLK', color: 'Titan Đen', storage: '256GB', ram: '8GB', price: 29990000, salePrice: 28490000, stockQty: 45 },
                { sku: 'IP15PM-512-NTI', color: 'Titan Tự Nhiên', storage: '512GB', ram: '8GB', price: 34990000, salePrice: 33490000, stockQty: 30 },
                { sku: 'IP15PM-512-BLU', color: 'Titan Xanh', storage: '512GB', ram: '8GB', price: 34990000, salePrice: 33490000, stockQty: 25 },
                { sku: 'IP15PM-1TB-NTI', color: 'Titan Tự Nhiên', storage: '1TB', ram: '8GB', price: 39990000, salePrice: 38490000, stockQty: 20 },
            ],
            images: [
                { url: 'https://cdn.hoanghamobile.com/i/content/Uploads/2023/09/13/iphone-15-pro-max-1.jpg', alt: 'iPhone 15 Pro Max' },
                { url: 'https://cdn.hoanghamobile.com/i/content/Uploads/2023/09/13/iphone-15-pro-max-2.jpg', alt: 'iPhone 15 Pro Max back' },
            ],
        },
        {
            name: 'iPhone 15',
            slug: 'iphone-15',
            shortDesc: 'Mới. Đầy màu sắc. Đầy năng lượng.',
            description: 'iPhone 15. Thiết kế với Dynamic Island. Camera 48MP với telephoto 2x. Sạc USB-C. Toàn bộ trong một vỏ nhôm bền bỉ và mặt lưng kính màu.',
            brandId: brands[0].id,
            categoryId: categories[0].id,
            basePrice: 22990000,
            salePrice: 21490000,
            costPrice: 19000000,
            isFeatured: true,
            specs: {
                screen: '6.1 inch Super Retina XDR OLED',
                resolution: '2556 x 1179 pixels',
                os: 'iOS 17',
                chip: 'Apple A16 Bionic',
                mainCamera: 'Camera chính 48MP, Ultra Wide 12MP',
                frontCamera: '12MP TrueDepth',
                battery: '3349 mAh, sạc nhanh 20W',
                charging: 'USB-C',
                sim: '1 Nano SIM + 1 eSIM',
                weight: '171g',
                waterproof: 'IP68',
            },
            variants: [
                { sku: 'IP15-128-PNK', color: 'Hồng', storage: '128GB', ram: '6GB', price: 22990000, salePrice: 21490000, stockQty: 60 },
                { sku: 'IP15-128-BLK', color: 'Đen', storage: '128GB', ram: '6GB', price: 22990000, salePrice: 21490000, stockQty: 55 },
                { sku: 'IP15-128-BLU', color: 'Xanh', storage: '128GB', ram: '6GB', price: 22990000, salePrice: 21490000, stockQty: 50 },
                { sku: 'IP15-256-PNK', color: 'Hồng', storage: '256GB', ram: '6GB', price: 25990000, salePrice: 24490000, stockQty: 40 },
                { sku: 'IP15-256-BLK', color: 'Đen', storage: '256GB', ram: '6GB', price: 25990000, salePrice: 24490000, stockQty: 35 },
                { sku: 'IP15-512-BLK', color: 'Đen', storage: '512GB', ram: '6GB', price: 30990000, salePrice: 29490000, stockQty: 20 },
            ],
            images: [
                { url: 'https://cdn.hoanghamobile.com/i/content/Uploads/2023/09/13/iphone-15-1.jpg', alt: 'iPhone 15' },
                { url: 'https://cdn.hoanghamobile.com/i/content/Uploads/2023/09/13/iphone-15-2.jpg', alt: 'iPhone 15 màu' },
            ],
        },
    ];
    // ==================== SAMSUNG ====================
    const samsungProducts = [
        {
            name: 'Samsung Galaxy S24 Ultra',
            slug: 'samsung-galaxy-s24-ultra',
            shortDesc: 'AI Phone. Tiên phong công nghệ.',
            description: 'Galaxy S24 Ultra với Galaxy AI tích hợp, camera 200MP, bút S Pen, màn hình Dynamic AMOLED 2X 6.8 inch, chip Snapdragon 8 Gen 3 for Galaxy mạnh mẽ.',
            brandId: brands[1].id, // Samsung
            categoryId: categories[0].id,
            basePrice: 29990000,
            salePrice: 27990000,
            costPrice: 24000000,
            isFeatured: true,
            specs: {
                screen: '6.8 inch Dynamic AMOLED 2X',
                resolution: '3120 x 1440 pixels, 120Hz',
                os: 'Android 14, One UI 6.1',
                chip: 'Snapdragon 8 Gen 3 for Galaxy',
                mainCamera: 'Camera chính 200MP, Ultra Wide 12MP, Telephoto 10MP (3x), Telephoto 50MP (5x)',
                frontCamera: '12MP Dual Pixel',
                battery: '5000 mAh, sạc nhanh 45W',
                charging: 'USB-C, sạc không dây 15W',
                sim: '2 Nano SIM hoặc 1 Nano + 1 eSIM',
                weight: '232g',
                waterproof: 'IP68',
                extra: 'Bút S Pen tích hợp',
            },
            variants: [
                { sku: 'S24U-256-GRY', color: 'Titan Xám', storage: '256GB', ram: '12GB', price: 29990000, salePrice: 27990000, stockQty: 45 },
                { sku: 'S24U-256-BLK', color: 'Titan Đen', storage: '256GB', ram: '12GB', price: 29990000, salePrice: 27990000, stockQty: 40 },
                { sku: 'S24U-256-VIO', color: 'Titan Tím', storage: '256GB', ram: '12GB', price: 29990000, salePrice: 27990000, stockQty: 35 },
                { sku: 'S24U-512-GRY', color: 'Titan Xám', storage: '512GB', ram: '12GB', price: 33990000, salePrice: 31990000, stockQty: 30 },
                { sku: 'S24U-512-BLK', color: 'Titan Đen', storage: '512GB', ram: '12GB', price: 33990000, salePrice: 31990000, stockQty: 25 },
                { sku: 'S24U-1TB-GRY', color: 'Titan Xám', storage: '1TB', ram: '12GB', price: 39990000, salePrice: 37990000, stockQty: 15 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-1.jpg', alt: 'Galaxy S24 Ultra' },
                { url: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-2.jpg', alt: 'Galaxy S24 Ultra camera' },
            ],
        },
        {
            name: 'Samsung Galaxy S24',
            slug: 'samsung-galaxy-s24',
            shortDesc: 'Galaxy AI đến với mọi người',
            description: 'Galaxy S24 với camera 50MP, màn hình Dynamic AMOLED 2X 6.2 inch 120Hz, chip Exynos 2400 mạnh mẽ, pin 4000mAh.',
            brandId: brands[1].id,
            categoryId: categories[0].id,
            basePrice: 19990000,
            salePrice: 18490000,
            costPrice: 16000000,
            isFeatured: true,
            specs: {
                screen: '6.2 inch Dynamic AMOLED 2X',
                resolution: '2340 x 1080 pixels, 120Hz',
                os: 'Android 14, One UI 6.1',
                chip: 'Exynos 2400',
                mainCamera: 'Camera chính 50MP, Ultra Wide 12MP, Telephoto 10MP (3x)',
                frontCamera: '12MP',
                battery: '4000 mAh, sạc nhanh 25W',
                charging: 'USB-C, sạc không dây',
                sim: '2 Nano SIM hoặc 1 Nano + 1 eSIM',
                weight: '167g',
                waterproof: 'IP68',
            },
            variants: [
                { sku: 'S24-128-BLK', color: 'Đen', storage: '128GB', ram: '8GB', price: 19990000, salePrice: 18490000, stockQty: 55 },
                { sku: 'S24-128-PUR', color: 'Tím', storage: '128GB', ram: '8GB', price: 19990000, salePrice: 18490000, stockQty: 50 },
                { sku: 'S24-128-YEL', color: 'Vàng', storage: '128GB', ram: '8GB', price: 19990000, salePrice: 18490000, stockQty: 45 },
                { sku: 'S24-256-BLK', color: 'Đen', storage: '256GB', ram: '8GB', price: 22990000, salePrice: 21490000, stockQty: 35 },
                { sku: 'S24-256-PUR', color: 'Tím', storage: '256GB', ram: '8GB', price: 22990000, salePrice: 21490000, stockQty: 30 },
                { sku: 'S24-512-BLK', color: 'Đen', storage: '512GB', ram: '8GB', price: 26990000, salePrice: 25490000, stockQty: 20 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-violet-1.jpg', alt: 'Galaxy S24' },
                { url: 'https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-violet-2.jpg', alt: 'Galaxy S24 colors' },
            ],
        },
    ];
    // ==================== XIAOMI ====================
    const xiaomiProducts = [
        {
            name: 'Xiaomi 14 Ultra',
            slug: 'xiaomi-14-ultra',
            shortDesc: 'Nhiếp ảnh đỉnh cao với Leica',
            description: 'Xiaomi 14 Ultra - Camera Leica chuyên nghiệp với cảm biến 1 inch, chip Snapdragon 8 Gen 3, màn hình AMOLED 6.73 inch 120Hz.',
            brandId: brands[2].id, // Xiaomi
            categoryId: categories[0].id,
            basePrice: 24990000,
            salePrice: 23490000,
            costPrice: 20000000,
            isFeatured: true,
            specs: {
                screen: '6.73 inch AMOLED',
                resolution: '3200 x 1440 pixels, 120Hz',
                os: 'Android 14, HyperOS',
                chip: 'Snapdragon 8 Gen 3',
                mainCamera: 'Camera chính 50MP (1 inch), Ultra Wide 50MP, Telephoto 50MP (3.2x), Telephoto 50MP (5x)',
                frontCamera: '32MP',
                battery: '5000 mAh, sạc nhanh 90W',
                charging: 'USB-C, sạc không dây 80W',
                sim: '2 Nano SIM',
                weight: '219g',
                waterproof: 'IP68',
            },
            variants: [
                { sku: 'X14U-512-BLK', color: 'Đen', storage: '512GB', ram: '16GB', price: 24990000, salePrice: 23490000, stockQty: 35 },
                { sku: 'X14U-512-WHT', color: 'Trắng', storage: '512GB', ram: '16GB', price: 24990000, salePrice: 23490000, stockQty: 30 },
                { sku: 'X14U-1TB-BLK', color: 'Đen', storage: '1TB', ram: '16GB', price: 29990000, salePrice: 28490000, stockQty: 20 },
                { sku: 'X14U-1TB-WHT', color: 'Trắng', storage: '1TB', ram: '16GB', price: 29990000, salePrice: 28490000, stockQty: 15 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/320712/xiaomi-14-ultra-black-1.jpg', alt: 'Xiaomi 14 Ultra' },
            ],
        },
        {
            name: 'Redmi Note 13 Pro',
            slug: 'redmi-note-13-pro',
            shortDesc: 'Hiệu năng vượt trội phân khúc',
            description: 'Redmi Note 13 Pro với camera 200MP, chip Snapdragon 7s Gen 2, màn hình AMOLED 120Hz, sạc nhanh 67W. Giá cực tốt.',
            brandId: brands[2].id,
            categoryId: categories[1].id, // Tầm trung
            basePrice: 7990000,
            salePrice: 7490000,
            costPrice: 6000000,
            specs: {
                screen: '6.67 inch AMOLED',
                resolution: '2712 x 1220 pixels, 120Hz',
                os: 'Android 13, MIUI 14',
                chip: 'Snapdragon 7s Gen 2',
                mainCamera: 'Camera chính 200MP, Ultra Wide 8MP, Macro 2MP',
                frontCamera: '16MP',
                battery: '5100 mAh, sạc nhanh 67W',
                charging: 'USB-C',
                sim: '2 Nano SIM',
                weight: '187g',
                waterproof: 'IP54',
            },
            variants: [
                { sku: 'RN13P-128-BLK', color: 'Đen', storage: '128GB', ram: '8GB', price: 7990000, salePrice: 7490000, stockQty: 70 },
                { sku: 'RN13P-128-BLU', color: 'Xanh', storage: '128GB', ram: '8GB', price: 7990000, salePrice: 7490000, stockQty: 65 },
                { sku: 'RN13P-128-WHT', color: 'Trắng', storage: '128GB', ram: '8GB', price: 7990000, salePrice: 7490000, stockQty: 60 },
                { sku: 'RN13P-256-BLK', color: 'Đen', storage: '256GB', ram: '8GB', price: 8990000, salePrice: 8490000, stockQty: 50 },
                { sku: 'RN13P-256-BLU', color: 'Xanh', storage: '256GB', ram: '8GB', price: 8990000, salePrice: 8490000, stockQty: 45 },
                { sku: 'RN13P-256-WHT', color: 'Trắng', storage: '256GB', ram: '8GB', price: 8990000, salePrice: 8490000, stockQty: 40 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/313570/redmi-note-13-pro-black-1.jpg', alt: 'Redmi Note 13 Pro' },
            ],
        },
    ];
    // ==================== OPPO ====================
    const oppoProducts = [
        {
            name: 'OPPO Find X7 Ultra',
            slug: 'oppo-find-x7-ultra',
            shortDesc: 'Camera Hasselblad đỉnh cao',
            description: 'OPPO Find X7 Ultra - Hệ thống camera Hasselblad với 2 telephoto periscope, chip Snapdragon 8 Gen 3, màn hình AMOLED 120Hz.',
            brandId: brands[3].id, // OPPO
            categoryId: categories[0].id,
            basePrice: 23990000,
            salePrice: 22490000,
            costPrice: 19000000,
            specs: {
                screen: '6.82 inch AMOLED LTPO',
                resolution: '3168 x 1440 pixels, 120Hz',
                os: 'Android 14, ColorOS 14',
                chip: 'Snapdragon 8 Gen 3',
                mainCamera: 'Camera chính 50MP, Ultra Wide 50MP, Telephoto 50MP (3x), Telephoto 50MP (6x)',
                frontCamera: '32MP',
                battery: '5000 mAh, sạc nhanh 100W',
                charging: 'USB-C, sạc không dây 50W',
                sim: '2 Nano SIM',
                weight: '221g',
                waterproof: 'IP68',
            },
            variants: [
                { sku: 'FX7U-256-BLK', color: 'Đen', storage: '256GB', ram: '12GB', price: 23990000, salePrice: 22490000, stockQty: 30 },
                { sku: 'FX7U-256-BLU', color: 'Xanh Dương', storage: '256GB', ram: '12GB', price: 23990000, salePrice: 22490000, stockQty: 25 },
                { sku: 'FX7U-512-BLK', color: 'Đen', storage: '512GB', ram: '16GB', price: 27990000, salePrice: 26490000, stockQty: 20 },
                { sku: 'FX7U-512-BLU', color: 'Xanh Dương', storage: '512GB', ram: '16GB', price: 27990000, salePrice: 26490000, stockQty: 15 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/329900/oppo-find-x7-ultra-black-1.jpg', alt: 'OPPO Find X7 Ultra' },
            ],
        },
        {
            name: 'OPPO Reno 11',
            slug: 'oppo-reno-11',
            shortDesc: 'Chụp chân dung đẹp tự nhiên',
            description: 'OPPO Reno 11 - Camera chân dung 32MP, chip MediaTek Dimensity 7050, màn hình AMOLED 120Hz, thiết kế mỏng nhẹ.',
            brandId: brands[3].id,
            categoryId: categories[1].id, // Tầm trung
            basePrice: 9990000,
            salePrice: 9490000,
            costPrice: 7500000,
            specs: {
                screen: '6.7 inch AMOLED',
                resolution: '2412 x 1080 pixels, 120Hz',
                os: 'Android 14, ColorOS 14',
                chip: 'MediaTek Dimensity 7050',
                mainCamera: 'Camera chính 50MP, Ultra Wide 8MP, Macro 2MP',
                frontCamera: '32MP',
                battery: '5000 mAh, sạc nhanh 67W',
                charging: 'USB-C',
                sim: '2 Nano SIM',
                weight: '184g',
                waterproof: 'Không',
            },
            variants: [
                { sku: 'R11-256-GRN', color: 'Xanh Lá', storage: '256GB', ram: '8GB', price: 9990000, salePrice: 9490000, stockQty: 50 },
                { sku: 'R11-256-PUR', color: 'Tím', storage: '256GB', ram: '8GB', price: 9990000, salePrice: 9490000, stockQty: 45 },
                { sku: 'R11-256-BLK', color: 'Đen', storage: '256GB', ram: '8GB', price: 9990000, salePrice: 9490000, stockQty: 40 },
                { sku: 'R11-512-BLK', color: 'Đen', storage: '512GB', ram: '12GB', price: 11990000, salePrice: 11490000, stockQty: 25 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/329399/oppo-reno-11-green-1.jpg', alt: 'OPPO Reno 11' },
            ],
        },
    ];
    // ==================== VIVO ====================
    const vivoProducts = [
        {
            name: 'Vivo X100 Pro',
            slug: 'vivo-x100-pro',
            shortDesc: 'Camera ZEISS chuyên nghiệp',
            description: 'Vivo X100 Pro - Hệ thống camera ZEISS với telephoto APO, chip MediaTek Dimensity 9300, màn hình AMOLED 120Hz.',
            brandId: brands[4].id, // Vivo
            categoryId: categories[0].id,
            basePrice: 19990000,
            salePrice: 18990000,
            costPrice: 16000000,
            specs: {
                screen: '6.78 inch AMOLED',
                resolution: '2800 x 1260 pixels, 120Hz',
                os: 'Android 14, Funtouch OS 14',
                chip: 'MediaTek Dimensity 9300',
                mainCamera: 'Camera chính 50MP, Ultra Wide 50MP, Telephoto 50MP APO (4.3x)',
                frontCamera: '32MP',
                battery: '5400 mAh, sạc nhanh 100W',
                charging: 'USB-C, sạc không dây 50W',
                sim: '2 Nano SIM',
                weight: '221g',
                waterproof: 'IP68',
            },
            variants: [
                { sku: 'VX100P-256-BLK', color: 'Đen', storage: '256GB', ram: '12GB', price: 19990000, salePrice: 18990000, stockQty: 35 },
                { sku: 'VX100P-256-BLU', color: 'Xanh', storage: '256GB', ram: '12GB', price: 19990000, salePrice: 18990000, stockQty: 30 },
                { sku: 'VX100P-512-BLK', color: 'Đen', storage: '512GB', ram: '16GB', price: 23990000, salePrice: 22990000, stockQty: 20 },
                { sku: 'VX100P-512-BLU', color: 'Xanh', storage: '512GB', ram: '16GB', price: 23990000, salePrice: 22990000, stockQty: 15 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/326570/vivo-x100-pro-black-1.jpg', alt: 'Vivo X100 Pro' },
            ],
        },
        {
            name: 'Vivo V30',
            slug: 'vivo-v30',
            shortDesc: 'Chân dung đẹp, mỏng nhẹ',
            description: 'Vivo V30 - Camera chân dung 50MP với OIS, chip Snapdragon 7 Gen 3, màn hình AMOLED 120Hz, thiết kế mỏng 7.5mm.',
            brandId: brands[4].id,
            categoryId: categories[1].id, // Tầm trung
            basePrice: 10990000,
            salePrice: 10490000,
            costPrice: 8500000,
            specs: {
                screen: '6.78 inch AMOLED',
                resolution: '2800 x 1260 pixels, 120Hz',
                os: 'Android 14, Funtouch OS 14',
                chip: 'Snapdragon 7 Gen 3',
                mainCamera: 'Camera chính 50MP OIS, Ultra Wide 50MP',
                frontCamera: '50MP AF',
                battery: '5000 mAh, sạc nhanh 80W',
                charging: 'USB-C',
                sim: '2 Nano SIM',
                weight: '186g',
                waterproof: 'IP54',
            },
            variants: [
                { sku: 'VV30-256-PUR', color: 'Tím', storage: '256GB', ram: '12GB', price: 10990000, salePrice: 10490000, stockQty: 50 },
                { sku: 'VV30-256-BLK', color: 'Đen', storage: '256GB', ram: '12GB', price: 10990000, salePrice: 10490000, stockQty: 45 },
                { sku: 'VV30-256-SLV', color: 'Bạc', storage: '256GB', ram: '12GB', price: 10990000, salePrice: 10490000, stockQty: 40 },
                { sku: 'VV30-512-BLK', color: 'Đen', storage: '512GB', ram: '12GB', price: 12490000, salePrice: 11990000, stockQty: 22 },
            ],
            images: [
                { url: 'https://cdn.tgdd.vn/Products/Images/42/329262/vivo-v30-purple-1.jpg', alt: 'Vivo V30' },
            ],
        },
    ];
    // Create all products
    const allProducts = [...appleProducts, ...samsungProducts, ...xiaomiProducts, ...oppoProducts, ...vivoProducts];
    let totalVariants = 0;
    for (const productData of allProducts) {
        const result = await createProduct(productData);
        totalVariants += result.variants.length;
        console.log(`✅ Created: ${productData.name} (${result.variants.length} variants)`);
    }
    console.log(`✅ Created ${allProducts.length} products with ${totalVariants} variants`);
    // 5. Create vouchers
    console.log('🎟️  Creating vouchers...');
    const vouchers = await Promise.all([
        prisma.voucher.create({
            data: {
                code: 'WELCOME2024',
                description: 'Giảm 500K cho đơn hàng đầu tiên',
                type: client_1.VoucherType.FIXED,
                value: 500000,
                minOrderValue: 5000000,
                maxDiscount: 500000,
                usageLimit: 100,
                perUserLimit: 1,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
            },
        }),
        prisma.voucher.create({
            data: {
                code: 'SALE10',
                description: 'Giảm 10% tối đa 1 triệu',
                type: client_1.VoucherType.PERCENTAGE,
                value: 10,
                minOrderValue: 3000000,
                maxDiscount: 1000000,
                usageLimit: 500,
                perUserLimit: 3,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
            },
        }),
        prisma.voucher.create({
            data: {
                code: 'FREESHIP',
                description: 'Miễn phí vận chuyển cho đơn từ 2 triệu',
                type: client_1.VoucherType.FREE_SHIP,
                value: 0,
                minOrderValue: 2000000,
                usageLimit: 1000,
                perUserLimit: 5,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2024-12-31'),
            },
        }),
    ]);
    console.log(`✅ Created ${vouchers.length} vouchers`);
    // 6. Create sample CMS pages
    console.log('📄 Creating CMS pages...');
    await prisma.cmsPage.create({
        data: {
            title: 'Giới thiệu',
            slug: 'gioi-thieu',
            content: '<h1>Về chúng tôi</h1><p>Cửa hàng điện thoại uy tín tại Việt Nam...</p>',
            metaTitle: 'Giới thiệu - Phone Store',
            metaDesc: 'Tìm hiểu về Phone Store - cửa hàng điện thoại uy tín',
            isPublished: true,
        },
    });
    console.log('✅ Created CMS pages');
    // 7. Create sample banners
    console.log('🖼️  Creating banners...');
    await prisma.banner.create({
        data: {
            title: 'iPhone 15 Pro Max - Giảm đến 2 triệu',
            imageUrl: 'https://via.placeholder.com/1920x600?text=iPhone+15+Pro+Max',
            linkUrl: '/products/iphone-15-pro-max',
            displayOrder: 1,
            isActive: true,
        },
    });
    console.log('✅ Created banners');
    console.log('');
    console.log('🎉 ============================================');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('🎉 ============================================');
    console.log(`📊 Summary:`);
    console.log(`   - Users: 2 (1 admin, 1 customer)`);
    console.log(`   - Brands: ${brands.length}`);
    console.log(`   - Categories: ${categories.length + 1}`);
    console.log(`   - Products: ${allProducts.length}`);
    console.log(`   - Product Variants: ${totalVariants}`);
    console.log(`   - Vouchers: ${vouchers.length}`);
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('   Admin: admin@phonestore.vn / Admin@123');
    console.log('   Customer: customer@example.com / Customer@123');
    console.log('');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map