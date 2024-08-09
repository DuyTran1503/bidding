export interface IBiddingField {
  id: string;
  name: string;
  description: string;
  code: number;
  is_active: string;
  parent_id: string;
  parent: string[];
}
export interface INewBiddingField {
  id: string;
  name: string;
  description: string;
  code: number;
  is_active: string;
  parent_id: string;
  parent: { id: string; name?: string };
}
