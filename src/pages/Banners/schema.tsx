import * as Yup from "yup";

export const Schema = Yup.object().shape({
  name: Yup.string()
    .trim() // Loại bỏ khoảng trắng đầu và cuối
    .required("Tên là bắt buộc"), // Kiểm tra tên không được để trống
  path: Yup.string()
    .required("Ảnh là bắt buộc"), // Kiểm tra không được để trống
});