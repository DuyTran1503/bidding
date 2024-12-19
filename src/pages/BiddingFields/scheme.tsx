import * as Yup from "yup";

const stringRegex = /^[\p{L}0-9\s._,`-]*$/u;
export const Schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Tên là bắt buộc"), 
  description: Yup.string()
    .trim()
    .optional(), 
  code: Yup.number()
    .typeError("Code phải là số") 
    .min(1, "Code phải lớn hơn hoặc bằng 1") 
    .required("Code là bắt buộc"), 
  parent_id: Yup.string()
    .trim()
    .nullable()
    .optional(), 
});
