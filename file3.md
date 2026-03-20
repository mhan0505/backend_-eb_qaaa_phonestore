1. CÁC TÁC NHÂN CHÍNH (ACTORS)
1.1. Guest (Khách vãng lai)
Đặc điểm:
Người dùng chưa đăng ký hoặc chưa đăng nhập
Có thể truy cập tự do các trang công khai
Quyền hạn:
✅ Xem danh sách sản phẩm
✅ Tìm kiếm, lọc sản phẩm
✅ Xem chi tiết sản phẩm
✅ Đăng ký tài khoản mới
✅ Đăng nhập
❌ Không thể thêm vào giỏ hàng
❌ Không thể đặt hàng
Use Cases chính:
Xem danh sách sản phẩm
Tìm kiếm sản phẩm
Xem chi tiết sản phẩm
Đăng ký tài khoản
Đăng nhập hệ thống

1.2. User (Khách hàng thành viên)
Đặc điểm:
Đã đăng ký và đăng nhập thành công
Có thể thực hiện mua hàng
Quyền hạn:
✅ Tất cả quyền của Guest
✅ Thêm sản phẩm vào giỏ hàng
✅ Quản lý giỏ hàng (thêm, sửa, xóa)
✅ Đặt hàng và thanh toán
✅ Xem lịch sử đơn hàng
✅ Xem chi tiết đơn hàng
✅ Cập nhật thông tin cá nhân
✅ Đăng xuất
Use Cases chính:
Quản lý giỏ hàng (thêm, cập nhật số lượng, xóa)
Đặt hàng (checkout)
Thanh toán qua SePay
Xem lịch sử đơn hàng
Xem chi tiết đơn hàng
Quản lý thông tin cá nhân
Đăng xuất

1.3. Admin (Quản trị viên)
Đặc điểm:
Người quản lý hệ thống
Có quyền truy cập vào trang quản trị
Quyền hạn:
✅ Quản lý sản phẩm (CRUD - Create, Read, Update, Delete)
✅ Xem danh sách đơn hàng
✅ Xem chi tiết đơn hàng
✅ Cập nhật trạng thái đơn hàng
✅ Xem thống kê, báo cáo
✅ Quản lý người dùng (xem danh sách, khóa/mở khóa)
Use Cases chính:
Đăng nhập Admin
Xem Dashboard (thống kê tổng quan)
Quản lý sản phẩm:
Thêm sản phẩm mới
Sửa thông tin sản phẩm
Xóa/ẩn sản phẩm
Upload hình ảnh sản phẩm
Quản lý đơn hàng:
Xem danh sách đơn hàng
Xem chi tiết đơn hàng
Cập nhật trạng thái đơn (Đang chuẩn bị, Đang giao, Đã giao)
Xem báo cáo thống kê

1.4. SePay System (Hệ thống bên ngoài) 
Đặc điểm:
Cổng thanh toán trực tuyến của bên thứ ba
Xử lý các giao dịch thanh toán
Vai trò:
✅ Nhận yêu cầu tạo giao dịch từ Backend
✅ Cung cấp giao diện thanh toán cho User
✅ Xử lý thanh toán (chuyển khoản ngân hàng, ví điện tử)
✅ Gửi kết quả thanh toán về Backend qua Webhook
Tương tác:
Backend → SePay: Tạo yêu cầu thanh toán (API call)
SePay → User: Hiển thị trang thanh toán
User → SePay: Thực hiện thanh toán
SePay → Backend: Gửi kết quả qua Webhook (POST callback)

2. SƠ ĐỒ CẤU TRÚC TRANG (SITEMAP)
┌─────────────────────────────────────────────────────────────┐
│                    HỆ THỐNG E-COMMERCE                      │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────┐
│ PUBLIC PAGES  │  │  USER PAGES   │  │ ADMIN PAGES  │
│ (Guest + User)│  │ (Auth Only)   │  │ (Admin Only) │
└───────────────┘  └───────────────┘  └──────────────┘


SƠ ĐỒ CẤU TRÚC TRANG
Public Pages (Guest & User):
Trang chủ (Home/Product List): 
Hiển thị danh sách sản phẩm (có phân trang, tìm kiếm, phân loại theo mục lục, mức giá). 
footer gồm các thông tin liên hệ
header: đăng ký, đăng nhập, bên phải, tên web bên trái



Chi tiết sản phẩm (Product Detail): 
Thông tin giá, tồn kho, mô tả, nút "Thêm vào giỏ", feedback, chi tiết sản phẩm


Giỏ hàng (Cart): 
Xem danh sách item đã chọn, tổng tiền tạm tính, nút "Tiến hành đặt hàng".


Đăng nhập / Đăng ký: 
Form nhập Email/Pass.
		
		
User Pages (Yêu cầu đăng nhập):

Checkout (Đặt hàng): Nhập thông tin giao hàng, hiển thị tổng tiền cuối cùng, nút "Thanh toán".
Lựa chọn phương thức thanh toán.


Cổng thanh toán (Redirect): 
Đây là trang của SePay, không phải trang nội bộ (lưu ý Dev chỉ redirect, không code UI này).


Trang kết quả (Thank You / Error): Trang đích sau khi SePay redirect về (hiển thị kết quả dựa trên params trả về).


Lịch sử đơn hàng (My Orders): Danh sách đơn hàng và trạng thái (Chờ thanh toán / Đã thanh toán)

Chi tiết đơn hàng:

		Profile người dùng:



Admin Pages (Quản trị):


Dashboard: Tổng quan đơn hàng.


Quản lý sản phẩm: Form tạo/sửa sản phẩm.

7. LUỒNG NGƯỜI DÙNG CHÍNH (USER FLOWS)
Flow 1: Guest → Đăng ký → Mua hàng
1. Vào trang chủ (/)
2. Xem sản phẩm
3. Click "Đăng ký" → /register
4. Điền form → Submit
5. Auto login → Về trang chủ
6. Click sản phẩm → /products/:id
7. Chọn variant + số lượng
8. Click "Thêm vào giỏ"
9. Click icon giỏ → /cart
10. Click "Thanh toán" → /checkout
11. Điền địa chỉ → Click "Đặt hàng"
12. Redirect → SePay
13. Thanh toán trên SePay
14. Redirect về → /payment/success
15. Click "Xem đơn hàng" → /orders/:id

Flow 2: User đã login → Mua tiếp
1. Login → Trang chủ
2. Giỏ hàng có sẵn items (từ lần trước)
3. Click giỏ → /cart
4. Cập nhật số lượng
5. Thanh toán → /checkout
6. Địa chỉ auto-fill (từ profile)
7. Đặt hàng → SePay → Success
8. Xem "Đơn hàng của tôi" → /orders

Flow 3: Admin quản lý
1. Login admin → /admin
2. Xem dashboard (stats)
3. Click "Sản phẩm" → /admin/products
4. Click "Thêm sản phẩm"
5. Điền form + upload ảnh
6. Click "Xuất bản"
7. Click "Đơn hàng" → /admin/orders
8. Click đơn hàng → Xem chi tiết
9. Cập nhật trạng thái: "Đang chuẩn bị"
10. Lưu


SƠ ĐỒ CẤU TRÚC TRANG
Public Pages (Guest & User):
Trang chủ (Home/Product List): 
Hiển thị danh sách sản phẩm (có phân trang, tìm kiếm, phân loại theo mục lục, mức giá). 
footer gồm các thông tin liên hệ
header: đăng ký, đăng nhập, bên phải, tên web bên trái












Chi tiết sản phẩm (Product Detail): 
Thông tin giá, tồn kho, mô tả, nút "Thêm vào giỏ", feedback, chi tiết sản phẩm





Giỏ hàng (Cart): 
Xem danh sách item đã chọn, tổng tiền tạm tính, nút "Tiến hành đặt hàng".




Đăng nhập / Đăng ký: 
Form nhập Email/Pass.
		
		


User Pages (Yêu cầu đăng nhập):

Checkout (Đặt hàng): Nhập thông tin giao hàng, hiển thị tổng tiền cuối cùng, nút "Thanh toán".
Lựa chọn phương thức thanh toán.


Cổng thanh toán (Redirect): 
Đây là trang của SePay, không phải trang nội bộ (lưu ý Dev chỉ redirect, không code UI này).


Trang kết quả (Thank You / Error): Trang đích sau khi SePay redirect về (hiển thị kết quả dựa trên params trả về).


Lịch sử đơn hàng (My Orders): Danh sách đơn hàng và trạng thái (Chờ thanh toán / Đã thanh toán)

Chi tiết đơn hàng:

		Profile người dùng:



Admin Pages (Quản trị):


Dashboard: Tổng quan đơn hàng.


Quản lý sản phẩm: Form tạo/sửa sản phẩm.
