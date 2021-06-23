import { Dic, storage, time, _ } from '..'
import { $axios } from '../app'

export namespace Gateway {
  export type Error = { code: string; message: string; retry?: boolean }
  export type Result<T> = { error?: Gateway.Error } & T
  export type Option = { [key: string]: number | boolean | undefined }
  export type Param = Dic<any>
  export type Header = Dic<string>
  export type Methods = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
}

// 基础工具
export class Gateway {
  async request<T = { [key: string]: any }>(
    method: Gateway.Methods,
    url: string,
    param: Gateway.Param = {},
    option: Gateway.Option = {},
    header: Gateway.Header = {}
  ) {
    let result = { error: { retry: true } } as Gateway.Result<T>,
      retryTimes = 0

    while (result.error?.retry && retryTimes < 2) {
      retryTimes++
      result = await this.handleRequest<T>(method, url, param, option, header)
    }

    return result
  }

  // 处理错误
  protected handleError(error: Gateway.Error, option: Gateway.Option): void {}

  // 处理头部数据
  protected handleHeader(header: Gateway.Header, option: Gateway.Option): void {}

  // 处理响应数据
  private async handleRequest<T>(method: Gateway.Methods, url: string, param: Gateway.Param = {}, option: Gateway.Option = {}, header: Gateway.Header = {}) {
    this.handleHeader(header, option)
    const key = method === 'get' ? 'params' : 'data'
    const raw = await $axios.request({ method, url, [key]: param, headers: header })
    return this.handleResponseResult<T>(raw, option)
  }

  // 处理响应数据
  private handleResponseResult<T>({ data, status }: any, option: Gateway.Option) {
    if (status !== 200) {
      data = { error: { code: 'Gateway.RequestError', message: '服务器请求异常', retry: true } }
    }

    // 服务端往客户端存储的数据
    if (data.storage) handleStorage(data.storage)

    // 处理非正常响应状态
    if (data.error) {
      this.handleError(data.error, option)
    }

    // 返回完整数据
    return data as Gateway.Result<T>
  }
}

function handleStorage(storageData: any) {
  storageData.local &&
    _.forEach(storageData.local as any, (item, key) => {
      const { action, data = null, ms = 0 } = item
      if (action === 'set') storage.local.set(key, data, ms < 1 ? time.forever : ms)
      else if (action === 'remove') storage.local.remove(key)
    })
  storageData.session &&
    _.forEach(storageData.session as any, (item, key) => {
      const { action, data = null, ms = 0 } = item
      if (action === 'set') storage.session.set(key, data, ms < 1 ? time.forever : ms)
      else if (action === 'remove') storage.session.remove(key)
    })
}
