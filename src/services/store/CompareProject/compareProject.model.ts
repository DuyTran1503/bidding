export interface ICompareProject {
    id?: string;
    name: string;
    value: number;
    project_ids?: number[];
    total_amount: number;
    bidder_count: number;
    duration: number;
    children?: ICompareProject[]; // Thêm thuộc tính children để chứa các dự án con

    // Các thuộc tính mới từ detailProjectByIds
    funding_source?: {
        id: number;
        name: string;
        description?: string;
        code?: string;
        type?: string;
        is_active?: boolean;
        deleted_at?: string | null;
        created_at?: string;
        updated_at?: string;
    };
    tenderer?: {
        id: number;
        user_id: string;
        industry_id?: any[];
        name: string;
        email: string;
        taxcode: string;
        account_ban_at?: string | null;
        representative?: string;
        avatar?: string;
        phone?: string;
        address?: string;
        website?: string;
        description?: string | null;
        establish_date?: string;
        avg_document_rating?: string;
        registration_date?: string;
        registration_number?: string;
        organization_type?: string;
        reputation?: string;
        is_active?: string;
        is_blacklist?: string;
        created_at?: string;
        updated_at?: string;
    };
    investor?: {
        id: number;
        user_id: string;
        industry_id?: any[];
        name: string;
        email: string;
        taxcode: string;
        account_ban_at?: string | null;
        representative?: string;
        avatar?: string;
        phone?: string;
        address?: string;
        website?: string;
        description?: string | null;
        establish_date?: string;
        avg_document_rating?: string;
        registration_date?: string;
        registration_number?: string;
        organization_type?: string;
        reputation?: string;
        is_active?: string;
        is_blacklist?: string;
        created_at?: string;
        updated_at?: string;
    };
    staff?: {
        id: number;
        user_id: string;
        name: string;
        taxcode: string;
        avatar?: string;
        email: string;
        phone?: string;
        gender?: string;
        birthday?: string;
        account_ban_at?: string | null;
        created_at?: string;
        updated_at?: string;
        roles?: {
            id: number;
            name: string;
        }[];
    };
    selection_method?: {
        id: number;
        method_name: string;
        description?: string;
        is_active?: boolean;
        deleted_at?: string | null;
        created_at?: string;
        updated_at?: string;
    };
    industries?: any[]; // Các ngành công nghiệp liên quan, dạng mảng
    procurement_categories?: any[]; // Danh mục đấu thầu, dạng mảng
    attachments?: any[]; // Tài liệu đính kèm, dạng mảng
    evaluation_criterias?: {
        id: number;
        project_id: string;
        name: string;
        weight: string;
        description?: string;
        is_active?: string;
        created_at?: string;
        updated_at?: string;
    }[]; // Tiêu chí đánh giá
    decision_number_issued?: string;
    is_domestic?: string;
    location?: string;
    amount?: string;
    description?: string | null;
    submission_method?: string | null;
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
