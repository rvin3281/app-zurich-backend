import { SuccessBaseResponseWithData } from '../interfaces/successBaseResponse';

export function successResponseBuilder<T>(
  message: string,
  data?: T
): SuccessBaseResponseWithData<T> {
  return {
    status: 'success',
    timestamp: new Date().toISOString(),
    data,
    message,
  };
}
