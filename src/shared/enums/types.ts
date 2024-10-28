export enum TypeBidBond {
  INSURANCE = 1,
  BANK_GUARANTEE = 2,
  CASH = 3,
}

export const bidBondEnumArray: TypeBidBond[] = [TypeBidBond.INSURANCE, TypeBidBond.BANK_GUARANTEE, TypeBidBond.CASH];

export const mappingBidBond: { [key in TypeBidBond]: string } = {
  [TypeBidBond.INSURANCE]: "Bảo lãnh dự thầu bảo hiểm",
  [TypeBidBond.BANK_GUARANTEE]: "Bảo lãnh dự thầu ngân hàng",
  [TypeBidBond.CASH]: "Bảo lãnh dự thầu bằng tiền mặt",
};

export enum TypeEmployee {
  DOING = "doing",
  PAUSE = "pause",
  LEAVE = "leave",
}

export const employeeEnumArray: TypeEmployee[] = [TypeEmployee.DOING, TypeEmployee.PAUSE, TypeEmployee.LEAVE];

export const mappingEmployee: { [key in TypeEmployee]: string } = {
  [TypeEmployee.DOING]: "Bảo lãnh dự thầu bảo hiểm",
  [TypeEmployee.PAUSE]: "Bảo lãnh dự thầu ngân hàng",
  [TypeEmployee.LEAVE]: "Bảo lãnh dự thầu bằng tiền mặt",
};
