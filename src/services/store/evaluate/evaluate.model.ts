export interface IEvaluate {
    id: string;
    project_id: number[];
    enterprise_id: number[];
    title: string;
    score: number;
    evaluate: string;
    project?: string;
    enterprise?: string;
}