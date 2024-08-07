import { EButtonTypes } from "../enums/button";
import { EFetchStatus } from "../enums/fetchStatus";
import { EPermissions } from "../enums/permissions";
import { MethodType } from "./shared-types";

interface IFetchHeaders {
  "Content-Type"?: string;
  Authorization?: string;
}

export interface IFetchOptions extends IFetchHeaders {
  method: MethodType;
  body?: any;
}

export interface IThunkPayload {
  body?: unknown;
  query?: ISearchParams;
  param?: string;
  headers?: IFetchHeaders;
  id?: string;
}

export interface ISearchParams {
  page?: number;
  size?: number;
  element?: number;
  [key: string]: unknown;
}

export interface IResponse<MetaDataType> {
  statusCode: number;
  message: string;
  data: MetaDataType;
  limit?: number;
  page?: number;
  totalDocs?: number;
  totalPages?: number;
}
export interface ICovertData<IResponse> {
  data: IResponse;
}

export interface ClientReturnType<ReturnDataType> {
  response: Response;
  data: ReturnDataType;
}

export interface IInitialState {
  loading?: boolean;
  status: EFetchStatus;
  message: string;
  filter: ISearchParams;
  totalRecords: number;
  number_of_elements?:number;
  [key: string]: unknown;
}

export interface IGridButton {
  type: EButtonTypes;
  onClick: (record: { key: string; [key: string]: any }) => unknown;
  permission?: EPermissions;
}
