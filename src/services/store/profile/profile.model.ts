import { IIndustry } from "../industry/industry.model";

export interface IEditProfile{
    id: string;
    account_type: string;
    name: string;
    taxcode?: number;
    email?: string;
    profile?: IProfile;
    phone?: string;
    avatar?: File;
    birthday?: Date;
    gender?: string;
    address?: string;
    avg_document_rating?: string;
    deleted_at?: string;
    description?: string;
    establish_date?: Date;
    is_blacklist?: string;
    organization_type?: string;
    registration_date?: Date
    registration_number?: string;
    representative?: string;
    website?: string;
    industry_id?:number[];
    industries?:IIndustry | IIndustry[];
}

export interface IProfile{
    id: string;
    user_id: string;
    phone: string;
    avatar: File;
    birthday: Date;
    gender: boolean;
    created_at: Date;
    updated_at: Date;
    address: string;
    avg_document_rating: string;
    deleted_at: string;
    description: string;
    establish_date: Date;
    is_blacklist: string;
    organization_type: string;
    registration_date: Date
    registration_number: string;
    representative: string;
    website: string;
    industry_id:number[];
    industries?:IIndustry[];
}