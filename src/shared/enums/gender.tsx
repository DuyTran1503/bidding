export enum GENDER {
  FEMALE = 0,
  MALE = 1,
  OHTHER = 2,
}

export const statusEnumArray: GENDER[] = [GENDER.MALE, GENDER.FEMALE, GENDER.OHTHER];

export const mappingGender: { [key in GENDER]: string } = {
  [GENDER.FEMALE]: "Nữ",
  [GENDER.MALE]: "Nam",
  [GENDER.OHTHER]: "Khác",
};
