import { _, Dic } from '..'
import { $axios } from '../app'
import tool from './tool'

export type Option = Partial<typeof default_option>
export type Params = Dic<any>
export type Data = Dic<any>
export type Headers = Dic<string>
export type Methods = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'

const default_option = {
  checkAuth: true,
  toastError: true,
}

// 基础工具
export class CgiBin {

  async get<T = any> (url: string, params: Params = {}, option: Option = {}) {
    return await this.request<T>('get', url, params, {}, option, {})
  }

  async get_body<T = any> (url: string, params: Params = {}, option: Option = {}) {
    const data = await this.get<T>(url, params, option)
    return data.body
  }

  async post<T = any> (url: string, data: Data = {}, option: Option = {}) {
    return this.request<T>('post', url, {}, data, option)
  }

  async put<T = any> (url: string, data: Data = {}, option: Option = {}) {
    return this.request<T>('put', url, {}, data, option)
  }

  async del<T = any> (url: string, data: Data = {}, option: Option = {}) {
    return this.request<T>('delete', url, {}, data, option)
  }

  async request<T = any> (method: Methods, url: string, params: Params = {}, data: Data = {}, option: Option = {}, headers: Headers = {}) {
    _.defaults(option, default_option)
    this.handleHeaders(headers)
    const raw = await $axios({ url, params, data, method, headers })
    return this.handleResponse<T>(raw, option)
  }

  // 错误弹框提示
  protected toastError (message: string): void {}

  // 用户授权信息过期时，需要重新登录
  protected handle401 (): void {}

  // 处理头部数据
  protected handleHeaders (headers: Headers): void { }

  // 处理响应数据
  private handleResponse<T> ({ data, status }: any, option: Option) {

    if (status !== 200) {
      data = { code: 500, message: '网络异常' }
    }

    const { code = 400, mark, body, message } = data

    // 服务端往客户端存储的数据
    if (data.state) {
      const { storage, store, local, session } = data.state
      storage && tool.handleStorageLocal(storage)
      local && tool.handleStorageLocal(local)
      store && tool.handleStorageSession(store)
      session && tool.handleStorageSession(session)
    }

    // 处理非正常响应状态
    if (code === 400 || code === 500) {
      if (option.toastError)
        this.toastError(message)
    } else if (code === 401) {
      if (option.checkAuth)
        this.handle401()
    }

    // 返回完整数据
    return { code, mark, body, message } as { code: number, mark: string | number, body: T, message: string }
  }

}

