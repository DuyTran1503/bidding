export enum POST {
    SHOW = 1,
    HIDE = 2,
    DRAFT = 3,
}

export const statusEnumArray: POST[] = [POST.SHOW, POST.HIDE, POST.DRAFT];

export const mappingPost: { [key in POST]: string } = {
    [POST.SHOW]: "Công khai",
    [POST.HIDE]: "Ẩn",
    [POST.DRAFT]: "Bản nháp",
};