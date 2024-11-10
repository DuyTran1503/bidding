export interface IWorkProgress {
    id: string ,
    project_id: number[],
    task_ids: number[],
    name: string,
    expense: number | string,
    progress: string,
    start_date: string | Date,
    end_date: string | Date,
    feedback: string,
    description: string,

    project?: string
    task?: { id: string; name: string }
}