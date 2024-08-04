// ví dụ với role: {{base_url}} = http://127.0.0.1:8000/api/admin

index - Lấy danh sách các vai trò URL: {{base_url}}/roles Phương thức: GET

create - Hiển thị form để tạo mới một vai trò URL: {{base_url}}/roles/create Phương thức: GET

store - Lưu vai trò mới vào cơ sở dữ liệu URL: {{base_url}}/roles Phương thức: POST

show - Hiển thị thông tin chi tiết của một vai trò URL: {{base_url}}/roles/{id} Phương thức: GET

edit - Hiển thị form để chỉnh sửa một vai trò URL: {{base_url}}/roles/{id}/edit Phương thức: GET

update - Cập nhật thông tin của một vai trò URL: {{base_url}}/roles/{id} Phương thức: PUT hoặc PATCH

destroy - Xóa một vai trò URL: {{base_url}}/roles/{id} Phương thức: DELETE
