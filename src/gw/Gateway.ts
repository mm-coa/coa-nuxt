import { _, Dic, time } from '..'
import { $axios } from '../app'

export namespace Gateway {
  export type Error = { code: string, message: string }
  export type Option = Partial<typeof default_option>
  export type Param = Dic<any>
  export type Header = Dic<string>
  export type Methods = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
}

const default_option = {
  checkLogin: true,
  handleError: true,
}

// 基础工具
export class Gateway {

  async request<T = { [key: string]: any }> (method: Gateway.Methods, url: string, param: Gateway.Param = {}, option: Gateway.Option = {}, header: Gateway.Header = {}) {
    _.defaults(option, default_option)
    this.handleHeader(header, option)
    const key = method === 'get' ? 'params' : 'data'
    const raw = await $axios({ method, url, [key]: param, headers: header })
    return this.handleResponse<T>(raw, option)
  }

  // 处理错误
  protected handleError (error: Gateway.Error): void {}

  // 处理登录
  protected handleLogin (): void {}

  // 处理头部数据
  protected handleHeader (header: Gateway.Header, option: Gateway.Option): void { }

  // 处理响应数据
  private handleResponse<T> ({ data, status }: any, option: Gateway.Option) {

    if (status !== 200) {
      data = { error: { code: 'Gateway.RequestError', message: '服务器请求异常' } }
    }

    // 服务端往客户端存储的数据
    if (data.storage)
      handleStorage(data.storage)

    // 处理非正常响应状态
    if (data.error) {
      if (data.error.code === 'Auth.NoLogin')
        this.handleLogin()
      else if (option.handleError)
        this.handleError(data.error)
    }

    // 返回完整数据
    return data as { error?: Gateway.Error } & T
  }

}

function handleStorage (storage: any) {
  storage.local && _.forEach(storage.local, (item, key) => {
    const { action, value = null, ms = 0 } = item
    if (action === 'set')
      storage.local.set(key, value, ms < 1 ? time.forever : ms)
    else if (action === 'remove')
      storage.local.remove(key)
  })
  storage.session && _.forEach(storage.session, (item, key) => {
    const { action, value = null, ms = 0 } = item
    if (action === 'set')
      storage.session.set(key, value, ms < 1 ? time.forever : ms)
    else if (action === 'remove')
      storage.session.remove(key)
  })
}