export enum GENDER {
  MALE = 1,
  FEMALE = 0,
}

export const statusEnumArray: GENDER[] = [GENDER.MALE, GENDER.FEMALE];

export const mappingGender: { [key in GENDER]: string } = {
  [GENDER.MALE]: "Nam",
  [GENDER.FEMALE]: "Nữ",
};
