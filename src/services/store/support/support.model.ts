export interface ISupport {
    id: string;
<<<<<<< HEAD
=======
    // user_id: string;
>>>>>>> c9843c114bb21f52324f28d188c3ec3bcb431663
    sender?: { id: number; name: string };
    title: string;
    email: string;
    phone: string;
    content: string;
    document?: File| string;
    type: number;
    status: string;
}