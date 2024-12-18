import { IProcurementCategorie } from './../procurementCategorie/procurementCategorie.model';
import { IStaff } from '../account/account.model';
import { IEnterprise } from '../enterprise/enterprise.model';
import { IIndustry } from '../industry/industry.model';
import { ISelectionMethod } from '../selectionMethod/selectionMethod.model';
import { IFundingSource } from './../funding_source/funding_source.model';
import { IEvaluationCriteria } from '../evaluation/evaluation.model';
import { IAttachment } from '../attachment/attachment.model';
import { IBidBond } from '../bid_bond/bidBond.model';
import { IBiddingResult } from '../biddingResult/biddingResult.model';
import { IBidDocument } from '../bid_document/bid_document.model';
export interface ICompareProject {
    id: string;
    name: string;
    value: number;
    project_ids?: number[];
    total_amount: number;
    bidder_count: number;
    duration: number;
    funding_source?: IFundingSource[];
    tenderer?: IEnterprise[];
    investor?: IEnterprise[];
    staff?: IStaff[];
    selection_method?: ISelectionMethod[];
    bidding_result?: IBiddingResult[];
    bidding_document?: IBidDocument[],
    bidding_bond?: IBidBond[],
    industries?: IIndustry[];
    procurement_categories?: IProcurementCategorie[];
    attachments?: IAttachment;
    children: ICompareProject[];
    evaluation_criterias?: IEvaluationCriteria[];
    decision_number_issued?: string;
    is_domestic?: string;
    location?: string;
    amount?: string;
    description?: string | null;
    submission_method: string | null;
    receiving_place?: string | null;
    bid_submission_start?: string;
    bid_submission_end?: string;
    bid_opening_date?: string | null;
    start_time?: string;
    end_time?: string;
    approve_at?: string | null;
    decision_number_approve?: string | null;
    status?: string;
}
export interface IDifficultyOfProject {
    project: string;
    easy: number;
    medium: number;
    hard: number;
    very_hard: number;
    [key: string]: string | number; 
}