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
}