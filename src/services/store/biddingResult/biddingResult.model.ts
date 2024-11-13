<<<<<<< HEAD
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
=======
export interface IBiddingResult {
    id: string;
    project: string;
    enterprise: string;
    decision_number: string;
    decision_date: string;
    is_active: string;
>>>>>>> c9843c114bb21f52324f28d188c3ec3bcb431663
  }  