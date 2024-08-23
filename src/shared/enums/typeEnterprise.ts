export enum ETYPEENTERPRISE {
  STATE = 1,
  OUTSIDE_STATE = 2,
}

export const typeEnterpriseEnumArray: ETYPEENTERPRISE[] = [ETYPEENTERPRISE.STATE, ETYPEENTERPRISE.OUTSIDE_STATE];

export const mappingTypeEnterprise: { [key in ETYPEENTERPRISE]: string } = {
  [ETYPEENTERPRISE.STATE]: "Doanh nghiệp nhà nước",
  [ETYPEENTERPRISE.OUTSIDE_STATE]: "Doanh nghiệp ngoài nhà nước",
};
