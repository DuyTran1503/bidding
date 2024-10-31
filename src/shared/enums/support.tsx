export enum SUPPORT {
    SENT = "sent",
    PROCESSING = "processing",
    RESPONDED = "responded",
}

export const statusEnumArray: SUPPORT[] = [SUPPORT.SENT, SUPPORT.PROCESSING, SUPPORT.RESPONDED];

export const mappingSupport: { [key in SUPPORT]: string } = {
    [SUPPORT.SENT]: "Đã gửi",
    [SUPPORT.PROCESSING]: "Đang xử lý",
    [SUPPORT.RESPONDED]: "Đã xử lý",
};