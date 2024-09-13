export const objectToFormData = (obj: Record<string, any>, formData = new FormData(), parentKey = ""): FormData => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof Date) {
        formData.append(formKey, value.toISOString());
      } else if (value instanceof File || value instanceof Blob) {
        formData.append(formKey, value, (value as File).name);
      } else if (typeof value === "boolean") {
        formData.append(formKey, value ? "1" : "0");
      } else if (value === null || value === undefined) {
        formData.append(formKey, "");
      } else if (typeof value === "object" && !(value instanceof File) && !(value instanceof Blob)) {
        objectToFormData(value, formData, formKey);
      } else {
        formData.append(formKey, value.toString());
      }
    }
  }
  return formData;
};
