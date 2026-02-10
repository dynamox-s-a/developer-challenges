export interface BaseResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: any
}

export class ResponseBase<T = any> implements BaseResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: any

  constructor(success: boolean, message?: string, data?: T, error?: any) {
    this.success = success
    this.message = message
    this.data = data
    this.error = error
  }

  static success<T>(data: T, message?: string): ResponseBase<T> {
    return new ResponseBase<T>(true, message, data)
  }

  static error(error: any, message?: string): ResponseBase {
    return new ResponseBase(false, message, undefined, error)
  }
}
