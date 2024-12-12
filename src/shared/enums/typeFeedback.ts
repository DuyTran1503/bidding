export enum TypeFeedback {
  POOR = "poor",
  MEDIUM = "medium",
  GOOD = "good",
  VERYGOOD = "verygood",
  EXCELLENT = "excellent",
}
export const typeTypeFeedbackEnumArray: TypeFeedback[] = [
  TypeFeedback.POOR,
  TypeFeedback.MEDIUM,
  TypeFeedback.GOOD,
  TypeFeedback.VERYGOOD,
  TypeFeedback.EXCELLENT,
];

export const mappingTypeFeedback: { [key in TypeFeedback]: string } = {
  [TypeFeedback.POOR]: "Kém",
  [TypeFeedback.MEDIUM]: "Trung bình",
  [TypeFeedback.GOOD]: "Tốt",
  [TypeFeedback.VERYGOOD]: "Rất tốt",
  [TypeFeedback.EXCELLENT]: "Xuất sắc",
};
