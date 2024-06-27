export type ApiPaginatedResponse<T> = {
  data: T[];
  links: PaginatedLinks;
  meta: PaginatedMeta;
};

export type ApiSingleResponse<T> = {
  success?: boolean;
  data?: T;
  errors?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSingleResponse<T> | ApiPaginatedResponse<T>;
export type PaginatedLinks = {
  first: string;
  last: string;
  prev: string;
  next: string;
};

export type PaginatedMeta = {
  firstPage: number;
  lastPage: number;
  total: number;
  currentPage: number;
};

export type RequestQuery = {
  page: number;
  limit: number;
};
