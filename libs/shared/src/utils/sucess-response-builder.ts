import {
  SuccessBaseResponseWithData,
  SuccessPaginatedBaseResponse,
} from '../interfaces/successBaseResponse';

export function successResponseBuilder<T>(
  message: string,
  data?: T,
): SuccessBaseResponseWithData<T> {
  return {
    status: 'success',
    timestamp: new Date().toISOString(),
    data,
    message,
  };
}

export function successResponsePaginatedBuilder<T>(
  message: string,
  totalRecords: number,
  totalPages: number,
  page: number,
  data?: T[],
): SuccessPaginatedBaseResponse<T> {
  return {
    message,
    data,
    status: 'success',
    timestamp: new Date().toISOString(),
    meta: {
      totalRecords,
      page,
      totalPages,
    },
  };
}
