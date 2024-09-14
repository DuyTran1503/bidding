type EnumType = { [key: string]: string };

export const convertEnum = (enumObj: EnumType, iConsistent: boolean = false): Array<{ value: string; label: string }> => {
  if (iConsistent) {
    return Object.entries(enumObj).map(([value, label]) => ({
      value,
      label,
    }));
  } else {
    return Object.values(enumObj).map((label) => ({
      value: label,
      label,
    }));
  }
};
