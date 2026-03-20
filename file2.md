MỘT SỐ LUỒNG NGHIỆP VỤ CHÍNH:6
3.1. Nghiệp vụ: Xem & Tìm kiếm sản phẩm
Mô tả: User vào xem danh sách sản phẩm.
Luồng dữ liệu (Data Flow):
User truy cập trang chủ.
Frontend gọi API GET /products.
Backend kiểm tra Redis (Key: products:list...).
Nếu có (Hit): Trả về JSON từ Redis (Tốc độ cao).
Nếu không (Miss): Query từ Database (PostgreSQL) -> Lưu vào Redis (TTL 5-10 phút) -> Trả về JSON.
Frontend hiển thị dữ liệu lên màn hình.
3.2. Nghiệp vụ: Thêm vào giỏ hàng
Mô tả: User chọn sản phẩm bỏ vào giỏ.
Quy tắc nghiệp vụ (Business Rules):
Hệ thống phải kiểm tra tồn kho (stock) trước khi thêm.
Dữ liệu giỏ hàng gắn liền với user_id (Lấy từ Session/Token).
Luồng dữ liệu:
User bấm "Thêm vào giỏ".
Frontend gọi API POST /cart/items kèm Token.
Backend lưu thông tin vào bảng cart_items (hoặc Redis tạm tùy cấu hình).
Backend trả về thông báo thành công.
3.3. Nghiệp vụ: Đặt hàng & Thanh toán (Luồng quan trọng nhất)
Mô tả: User tạo đơn và thanh toán qua SePay.
Luồng dữ liệu (Step-by-step):
User bấm "Thanh toán" tại trang Checkout.
Frontend gọi API POST /orders.
Backend thực hiện:
Tạo bản ghi trong bảng orders với trạng thái pending_payment.
Tạo bản ghi order_items.
Gọi API SePay để lấy paymentUrl.
Backend trả về paymentUrl cho Frontend.
Frontend tự động Redirect User sang trang thanh toán của SePay.
User chuyển khoản trên giao diện SePay.
3.4. Nghiệp vụ: Xử lý kết quả thanh toán (Webhook)
Mô tả: SePay báo cho hệ thống biết User đã chuyển tiền xong. User không tham gia bước này.
Luồng dữ liệu:
SePay gọi API POST /webhooks/sepay tới Backend của chúng ta.
Backend thực hiện xác thực bảo mật:
Check 1: Verify chữ ký (Signature) xem có đúng là từ SePay gửi không (Chống giả mạo).
Check 2: Kiểm tra Idempotency (Giao dịch này đã xử lý chưa?).
Backend cập nhật Database:

