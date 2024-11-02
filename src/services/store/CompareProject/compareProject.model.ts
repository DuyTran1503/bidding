export interface ICompareProject {
    id?: number;
    name: string;
    value: number;
    project_ids?: number[];
    total_amount: number;
    bidder_count: number;
    duration: number;
    children?: ICompareProject[]; // Thêm thuộc tính children
}
