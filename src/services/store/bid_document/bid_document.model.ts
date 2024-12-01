import { IBidBond } from "../bid_bond/bidBond.model";
import { IEnterprise } from "../enterprise/enterprise.model";
import { IProject } from "../project/project.model";

export interface IBidDocument {
  id: number | string;
  project_id?: number;
  enterprise_id: number;
  bid_bond_id: number | string;
  name?: string;
  submission_date?: string;
  bid_price: string;
  implementation_time?: string;
  validity_period?: string;
  note: string;
  status?: string;
  enterprise?: IEnterprise;
  project?: IProject;
  bid_bond?: IBidBond;
  file?: File;
}
