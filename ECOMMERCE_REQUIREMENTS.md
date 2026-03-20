### 1. Thông tin chung dự án

- **Tên dự án**: Website thương mại điện tử XYZ  
- **Mục tiêu**:  
  - **Kinh doanh**: Tăng doanh thu online, mở rộng tệp khách hàng, giảm chi phí vận hành.  
  - **Người dùng**: Mua hàng nhanh, dễ, tiện, minh bạch thông tin.  
- **Phạm vi**:  
  - Website (Desktop + Mobile Web), có thể mở rộng Mobile App sau.  
  - Hệ thống quản trị (Admin) cho vận hành.  

---

### 2. Đối tượng sử dụng & vai trò hệ thống

- **Khách vãng lai (Guest)**: Xem sản phẩm, tìm kiếm, thêm giỏ, đăng ký.  
- **Khách hàng đã đăng ký (Customer)**: Đặt hàng, theo dõi đơn, quản lý tài khoản.  
- **Nhân viên CSKH (Support/CS)**: Xử lý khiếu nại, hỗ trợ đơn hàng, chat.  
- **Nhân viên vận hành (Ops)**: Quản lý đơn, kho, vận chuyển.  
- **Admin**: Quản lý toàn bộ hệ thống, cấu hình, quyền hạn.  
- **Nhà bán hàng (Seller)** (nếu là marketplace): Quản lý sản phẩm, đơn hàng của riêng mình.  

---

### 3. Phân rã module & chức năng (bảng tổng hợp)

| #   | Module                  | Chức năng chính                                | Vai trò liên quan |
| --- | ----------------------- | ---------------------------------------------- | ----------------- |
| 1   | Trang chủ               | Banner, danh mục, sản phẩm nổi bật, flash sale | Guest, Customer   |
| 2   | Danh mục & Tìm kiếm     | Duyệt danh mục, bộ lọc, search gợi ý           | Guest, Customer   |
| 3   | Trang chi tiết sản phẩm | Thông tin sản phẩm, giá, tồn kho, đánh giá     | Guest, Customer   |
| 4   | Giỏ hàng (Cart)         | Thêm/xóa/sửa sản phẩm, mã giảm giá             | Guest, Customer   |
| 5   | Thanh toán (Checkout)   | Nhập địa chỉ, chọn vận chuyển, chọn thanh toán | Customer          |
| 6   | Thanh toán online       | Tích hợp cổng thanh toán (VNPay, MoMo,...)     | Customer          |
| 7   | Tài khoản người dùng    | Hồ sơ, sổ địa chỉ, đổi mật khẩu                | Customer          |
| 8   | Đơn hàng của tôi        | Lịch sử đơn, trạng thái, hủy đơn, trả hàng     | Customer          |
| 9   | Đánh giá & phản hồi     | Đánh giá sản phẩm, comment, rating             | Customer          |
| 10  | Yêu thích / Wishlist    | Lưu sản phẩm yêu thích                         | Customer          |
| 11  | Thông báo               | Email/SMS/push/web notification                | Customer          |
| 12  | Chat/CSKH               | Live chat, ticket hỗ trợ                       | Customer, CS      |
| 13  | Khuyến mãi & Voucher    | Mã giảm giá, flash sale, combo                 | Customer, Admin   |
| 14  | CMS nội dung            | Trang blog, tin tức, FAQ, chính sách           | Admin             |
| 15  | Quản lý sản phẩm        | CRUD sản phẩm, biến thể, tồn kho               | Admin, Ops        |
| 16  | Quản lý đơn hàng        | Xem/xử lý đơn, thay đổi trạng thái             | Admin, Ops        |
| 17  | Quản lý kho             | Tồn kho, nhập xuất, cảnh báo hết hàng          | Admin, Ops        |
| 18  | Quản lý khách hàng      | Danh sách khách, phân nhóm, lịch sử            | Admin, CS         |
| 19  | Báo cáo & Dashboard     | Doanh thu, đơn, top sản phẩm                   | Admin, Management |
| 20  | Cấu hình hệ thống       | Cài đặt thanh toán, vận chuyển, cấu hình UI    | Admin             |
| 21  | Phân quyền & bảo mật    | Role, quyền, nhật ký hoạt động                 | Admin             |
| 22  | Tích hợp bên thứ 3      | Giao vận, thanh toán, CRM, marketing           | Admin, Tech       |

---

### 4. Chi tiết tính năng theo module

#### 4.1. Trang chủ

- **Thành phần**:  
  - Banner lớn (hero banner) + slider.  
  - Block danh mục chính.  
  - Sản phẩm nổi bật / bán chạy / mới về.  
  - Khung Flash Sale (đếm ngược thời gian).  
  - Gợi ý sản phẩm theo lịch sử duyệt/mua (nếu có).  
- **Yêu cầu**:  
  - Tốc độ tải nhanh.  
  - Tùy chỉnh block từ Admin (banner, danh mục nổi bật…).  

#### 4.2. Danh mục & Tìm kiếm

- **Danh mục**:  
  - Cấu trúc đa cấp: Ngành hàng → Danh mục → Nhóm sản phẩm.  
  - URL thân thiện SEO (ví dụ: `/dien-thoai/iphone`).  
- **Bộ lọc (Filter)**:  
  - Theo giá, thương hiệu, thuộc tính (size, màu, chất liệu…).  
  - Cho phép chọn nhiều giá trị (multi-select).  
- **Sắp xếp (Sort)**:  
  - Mới nhất, giá tăng/giảm, bán chạy, đánh giá cao.  
- **Tìm kiếm**:  
  - Ô search trên header, gợi ý khi gõ (autocomplete).  
  - Gợi ý từ khóa hot, lịch sử tìm kiếm.  

#### 4.3. Trang chi tiết sản phẩm

- **Thông tin chính**:  
  - Tên, giá gốc, giá khuyến mãi, % giảm.  
  - Tình trạng tồn kho.  
  - Ảnh sản phẩm (gallery), video (nếu có).  
  - Thuộc tính chọn lựa (size, màu, dung lượng…).  
  - Mô tả chi tiết (HTML), thông số kỹ thuật.  
- **Xã hội / Tin cậy**:  
  - Số lượt đánh giá, điểm trung bình.  
  - Đánh giá chi tiết + ảnh từ khách.  
  - Câu hỏi & trả lời (Q&A).  
- **Hành động**:  
  - Thêm vào giỏ.  
  - Mua ngay.  
  - Thêm vào yêu thích.  
  - Chia sẻ link (Facebook, Zalo…).  

#### 4.4. Giỏ hàng (Cart)

- **Chức năng**:  
  - Xem danh sách sản phẩm đã chọn (ảnh, tên, giá, số lượng).  
  - Cập nhật số lượng, xóa sản phẩm.  
  - Áp mã khuyến mãi, voucher.  
  - Tính tiền tạm tính, phí ship (ước tính), tổng tiền.  
- **Yêu cầu**:  
  - Lưu giỏ cho cả Guest (local) và Customer (trên server).  
  - Cảnh báo nếu sản phẩm hết hàng / đổi giá.  

#### 4.5. Thanh toán (Checkout)

- **Bước 1 – Thông tin khách hàng**:  
  - Họ tên, điện thoại, email.  
  - Địa chỉ nhận hàng chi tiết (Tỉnh/TP, Quận/Huyện, Phường/Xã, địa chỉ).  
- **Bước 2 – Phương thức vận chuyển**:  
  - Lựa chọn đơn vị vận chuyển (GHN, GHTK,…).  
  - Thời gian giao dự kiến, phí ship tương ứng.  
- **Bước 3 – Phương thức thanh toán**:  
  - COD (thanh toán khi nhận hàng).  
  - Thanh toán online (VNPay/MoMo/…).  
- **Bước 4 – Xác nhận đơn**:  
  - Tóm tắt đơn (sản phẩm, giá, phí, tổng).  
  - Nút “Đặt hàng”.  
- **Kết quả**:  
  - Tạo mã đơn hàng.  
  - Gửi email/SMS xác nhận.  

#### 4.6. Thanh toán online

- **Tích hợp cổng thanh toán**:  
  - API redirect sang cổng thanh toán.  
  - Nhận callback kết quả (thành công/thất bại).  
- **Xử lý lỗi**:  
  - Nếu thanh toán thất bại: giữ đơn ở trạng thái chờ thanh toán hoặc hủy theo business rule.  
  - Ghi log giao dịch để đối soát.  

#### 4.7. Tài khoản người dùng & Đơn hàng của tôi

- **Đăng ký / Đăng nhập**:  
  - Email + mật khẩu, hoặc SSO (Google/Facebook).  
  - Quên mật khẩu, đổi mật khẩu.  
- **Thông tin tài khoản**:  
  - Hồ sơ (tên, SĐT, ngày sinh, giới tính).  
  - Sổ địa chỉ (default + nhiều địa chỉ).  
- **Đơn hàng của tôi**:  
  - Danh sách đơn (mới nhất trước).  
  - Chi tiết đơn: sản phẩm, trạng thái, lịch sử thay đổi.  
  - Hành động: hủy đơn (nếu chưa xử lý), yêu cầu trả hàng, in hóa đơn (nếu có).  

#### 4.8. Đánh giá, phản hồi, chat

- **Đánh giá sản phẩm**:  
  - Điểm sao (1–5).  
  - Nội dung text + upload ảnh/video.  
  - Filter và sort đánh giá (mới nhất, có ảnh, 5 sao…).  
- **Chat / Hỗ trợ**:  
  - Live chat với CSKH hoặc chatbot.  
  - Tạo ticket khiếu nại / yêu cầu hỗ trợ.  

#### 4.9. Khuyến mãi, voucher, flash sale

- **Voucher**:  
  - Theo đơn hàng, theo sản phẩm, theo user group.  
  - Điều kiện áp dụng (min order, giới hạn số lần, thời gian).  
- **Flash sale**:  
  - Thời gian bắt đầu/kết thúc.  
  - Số lượng giới hạn, hiển thị progress còn bao nhiêu.  
- **Combo, mua kèm**:  
  - Mua combo giảm giá, gợi ý mua kèm.  

#### 4.10. CMS nội dung & trang chính sách

- **Trang nội dung tĩnh**:  
  - Giới thiệu, Liên hệ, Tuyển dụng.  
  - Chính sách bảo mật, đổi trả, giao hàng, thanh toán.  
- **Blog / Tin tức**:  
  - Bài viết, chuyên mục, tag.  
  - Hiển thị trên trang chủ/landing.  

#### 4.11. Admin – Quản lý sản phẩm, đơn hàng, kho

- **Quản lý sản phẩm**:  
  - Tạo/sửa/xóa sản phẩm.  
  - Thiết lập danh mục, thương hiệu, thuộc tính, biến thể.  
  - Quản lý giá, tồn kho, ảnh, SEO (title, meta, slug).  
- **Quản lý đơn hàng**:  
  - Xem danh sách đơn, filter theo trạng thái/thời gian/khách.  
  - Cập nhật trạng thái: Mới → Đang xử lý → Đang giao → Hoàn tất → Hủy.  
  - Ghi chú nội bộ, lịch sử trạng thái.  
- **Quản lý kho**:  
  - Tồn kho theo sản phẩm/biến thể.  
  - Nhập hàng, xuất hàng (nếu cần).  
  - Cảnh báo tồn kho thấp.  

#### 4.12. Admin – Khách hàng, báo cáo, cấu hình

- **Quản lý khách hàng**:  
  - Danh sách user, lịch sử mua hàng.  
  - Phân nhóm (VIP, mới, tiềm năng…).  
- **Báo cáo**:  
  - Doanh thu theo ngày/tháng/kênh.  
  - Top sản phẩm bán chạy.  
  - Tỷ lệ hủy đơn, tỷ lệ thanh toán online thành công.  
- **Cấu hình hệ thống**:  
  - Cấu hình phí ship, mức miễn phí ship.  
  - Cài đặt cổng thanh toán, API đối tác.  
  - Cài đặt banner, màu sắc chủ đề (nếu cho phép tùy chỉnh).  

---

### 5. Yêu cầu phi chức năng (Non-functional)

- **Hiệu năng**:  
  - Thời gian tải trang chủ \< 3s với đường truyền bình thường.  
- **Bảo mật**:  
  - HTTPS toàn site.  
  - Mã hóa mật khẩu, bảo vệ dữ liệu cá nhân (theo quy định địa phương).  
- **Khả dụng & ổn định**:  
  - Thời gian uptime ≥ 99%.  
- **Khả năng mở rộng**:  
  - Thiết kế để có thể thêm app mobile, tích hợp thêm đối tác trong tương lai.  
- **Khả năng SEO**:  
  - URL thân thiện, meta tag, sitemap, robots.txt.  

---

### 6. Tích hợp bên thứ ba

- **Thanh toán**: VNPay, MoMo, ZaloPay, v.v.  
- **Vận chuyển**: GHN, GHTK, VNPost… (tính phí tự động, cập nhật trạng thái).  
- **Marketing/CRM**: Email marketing (Mailchimp/SendGrid), Facebook Pixel, Google Analytics.  

---

### 7. Gợi ý cấu trúc bảng tài liệu chi tiết (dùng cho Excel/Sheets)

1. **Overview**: Mục tiêu, phạm vi, timeline.  
2. **User Roles**: Bảng mô tả vai trò & quyền hạn.  
3. **Feature List**:  
   - Cột gợi ý: `Module` / `Mã chức năng` / `Tên chức năng` / `Mô tả chi tiết` / `Vai trò` / `Độ ưu tiên` / `Ghi chú`.  
4. **Business Rules**:  
   - Quy định về phí ship, voucher, chính sách hủy, đổi trả…  
5. **Non-functional**:  
   - Hiệu năng, bảo mật, logging, backup.  
6. **Integration**:  
   - Danh sách hệ thống tích hợp, thông tin API chính.  

