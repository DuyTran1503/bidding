export interface IPost {
   id: string;
    // author_id: string;
    author_name?: string;
    post_catalog_id: number[];
    post_catalog_name: string[];
    short_title: string;
    title: string;
    content: string;
    thumbnail?: File | string;
    status: number;
}