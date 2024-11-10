export interface IWorkProgress {
    id: string | number,
    project_id: string,
    task_ids: string
    name: string,
    expense: number,
    progress: string,
    start_date: Date,
    end_date: Date,
    feedback: string,
    description: string,
    project?: { id: string; name: string }
    task?: { id: string; name: string }
}