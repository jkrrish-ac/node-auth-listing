export interface ApiPageResponse {
    page: number;
    size: number;
    numberOfElements: number;
    totalPages: number;
    totalElements: number;

    first: boolean;
    last: boolean;
    empty: boolean;
    data: any[];
}