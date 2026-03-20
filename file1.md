Các tác nhân chính:
Guest (Khách vãng lai):
User (Khách thành viên):
Admin (Quản trị viên):
SePay (External):

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


