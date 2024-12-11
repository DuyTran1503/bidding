export const convertMoney = (input: string): string => {
  const number = parseFloat(input);
  const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formattedNumber} VND`;
};
export const convertToNumber = (input: string): number => {
  // Remove " VND" and commas, then parse to float
  const cleanedInput = input.replace(/ VND/, "").replace(/,/g, "");
  const number = parseFloat(cleanedInput);
  return isNaN(number) ? 0 : number; // Return 0 if the result is NaN
};
export const convertToNumberFromMoney = (input: string): number => {
  // Loại bỏ dấu phẩy và chuyển đổi thành số
  const cleanedInput = input.replace(/,/g, ""); // Xóa tất cả dấu phẩy
  const number = parseFloat(cleanedInput); // Chuyển đổi thành số
  return isNaN(number) ? 0 : number; // Trả về 0 nếu kết quả là NaN
};
