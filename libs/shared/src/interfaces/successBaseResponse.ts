export interface SuccessBaseResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface SuccessBaseResponseWithData<T> extends SuccessBaseResponse {
  data?: T;
}
