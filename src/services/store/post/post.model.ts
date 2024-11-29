import { IUserProfile } from "../auth/auth.model";
import { IPostCatalog } from "../postCatalog/postCatalog.model";

export interface IPost {
   id: string;
    // author_id: string;
    post_catalog_id: number[];
    post_catalog_name: string[];
    author?: IUserProfile[];
    catalog?: IPostCatalog[];
    short_title: string;
    title: string;
    content: string;
    thumbnail?: File | string;
    status: number;
    created_at?: string;
}