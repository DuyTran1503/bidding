import { IBidDocument } from "../bid_document/bid_document.model";
import { IEnterprise } from "../enterprise/enterprise.model";
import { IProject } from "../project/project.model";

export interface IBiddingResult {
  id: string;
  project?: IProject;
  enterprise: IEnterprise;
  decision_number: string;
  decision_date: string;
  is_active: string;
  bid_document: IBidDocument;
  bid_document_id?: number;
  win_amount: string;
  project_id?: number;
  enterprise_id?: number | string;
}
