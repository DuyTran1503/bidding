import { IBidDocument } from "../bid_document/bid_document.model";
import { IEnterprise } from "../enterprise/enterprise.model";
import { IProject } from "../project/project.model";

export interface IBiddingResult {
    id: string;
    project: IProject;
    enterprise: IEnterprise;
    decision_number: string;
    decision_date: string;
    is_active: string;
    bid_document: IBidDocument;
    win_amount: string;
  }  