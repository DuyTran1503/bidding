export interface IFundingSource {
  id: string | number;
  name: string;
  type: string;
  code: string;
  description?: string;
  is_active?: string;
}
