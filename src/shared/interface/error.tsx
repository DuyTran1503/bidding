export interface IError<T = unknown> {
  errors: T;
  message: string;
  result: boolean;
  code?: number;
}
export interface PayloadErrors {
  [key: string]: string[];
}
