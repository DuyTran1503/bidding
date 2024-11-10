export interface ISupport {
    id: string;
    sender?: { id: number; name: string };
    title: string;
    email: string;
    phone: string;
    content: string;
    document?: File| string;
    type: number;
    status: string;
}