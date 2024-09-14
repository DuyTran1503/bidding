export enum STATUS {
  ACTIVE = 1,
  IN_ACTIVE = 0,
}

export const statusEnumArray: STATUS[] = [STATUS.ACTIVE, STATUS.IN_ACTIVE];

export const mappingStatus: { [key in STATUS]: string } = {
  [STATUS.ACTIVE]: "Hoạt động",
  [STATUS.IN_ACTIVE]: "Không hoạt động",
};
