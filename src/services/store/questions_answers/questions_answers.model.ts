export interface IQuestionsAnswers {
    id: string,
    project_id?: string,
    question_content: string,
    answer_content: string,
    asked_by: string,
    answer_by: string,
    is_active?: string
}