export interface SuccessBaseResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface SuccessBaseResponseWithData<T> extends SuccessBaseResponse {
  data?: T;
}

export interface SuccessPaginatedBaseResponse<T> extends SuccessBaseResponse {
  data?: T[];
  meta: metatags;
}

interface metatags {
  totalRecords: number;
  totalPages: number;
  page: number;
}
