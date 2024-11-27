export const convertMoney = (input: string): string => {
  const number = parseFloat(input);
  const formattedNumber = number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formattedNumber} VND`;
};
