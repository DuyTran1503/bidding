export const convertDataOptions = <T extends { id: number | string; name: string }>(data: T[]): { value: number | string; label: string }[] => {
  if (!Array.isArray(data)) {
    return []; // Trả về mảng rỗng
  }

  const result = data.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return result;
};
