export interface IPost {
    id: string;
    author_id: string;
    short_title: string;
    title: string;
    content: string;
    thumbnail?: File;
    document?: File;
    is_active: string;
}