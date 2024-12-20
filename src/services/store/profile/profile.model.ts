import { IIndustry } from "../industry/industry.model";

export interface IEditProfile{
    id: string;
    account_type: string;
    name: string;
    taxcode?: number;
    email?: string;
    profile?: IProfile[];
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
}

address: "70 Vân Canh"
avatar: "https://base.septenarysolution.site/uploads/images/676526c181ea3.png"
avg_document_rating: "0.00"
created_at: "2022-02-10T17:00:00.000000Z"
deleted_at: null
description: "<p>Quy mô doanh nghiệp 100 nhân viên</p>"
establish_date: "2024-11-27"
id: 5002
is_active: 1
is_blacklist: 0
organization_type: "2"
phone: "0702208708"
registration_date: "2024-11-26"
registration_number: "QD01-Q3-N24-ND100-NO1002"
representative: "huân hoàng"
updated_at: "2024-12-20T08:41:05.000000Z"
user_id: 5205
website: "https://ricons.vn"