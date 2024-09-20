export enum DOMESTIC {
  INSIDE = 1,
  OUTSIDE = 0,
}

export const domesticEnumArray: DOMESTIC[] = [DOMESTIC.INSIDE, DOMESTIC.OUTSIDE];

export const mappingDOMESTIC: { [key in DOMESTIC]: string } = {
  [DOMESTIC.INSIDE]: "Trong nước",
  [DOMESTIC.OUTSIDE]: "Nước ngoài",
};
