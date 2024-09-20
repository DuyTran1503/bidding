export enum GENDER {
  MALE = 1,
  FEMALE = 2,
}

export const statusEnumArray: GENDER[] = [GENDER.MALE, GENDER.FEMALE];

export const mappingGender: { [key in GENDER]: string } = {
  [GENDER.MALE]: "Nam",
  [GENDER.FEMALE]: "Nữ",
};
