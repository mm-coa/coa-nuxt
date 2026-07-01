import { Dic } from './typing'

export type HttpMethod = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
export type HttpRequestConfig = {
  method?: HttpMethod
  url: string
  params?: Dic<any>
  data?: any
  headers?: Dic<string>
}
export type HttpResponse<T = any> = { data: T; status: number }
export type HttpClient = {
  <T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>
  request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>
}
export type FetchClient = {
  (url: string, options?: Dic<any>): Promise<any>
  raw?: (url: string, options?: Dic<any>) => Promise<{ _data?: any; status: number }>
}
export type NuxtContext = Dic<any> & {
  $axios?: HttpClient
  $fetch?: FetchClient
}

const createMissingHttpClient = () => {
  const request = async () => {
    throw new Error('Http client is not initialized. Pass $axios or $fetch to the coa-nuxt app plugin.')
  }

  return Object.assign(request, { request }) as HttpClient
}

const createFetchHttpClient = ($fetch: FetchClient) => {
  const request = async <T = any>({ method = 'get', url, params, data, headers }: HttpRequestConfig) => {
    const options = { method, query: params, body: data, headers }
    if ($fetch.raw) {
      const response = await $fetch.raw(url, options)
      return { data: response._data as T, status: response.status }
    }

    return { data: (await $fetch(url, options)) as T, status: 200 }
  }

  return Object.assign(request, { request }) as HttpClient
}

const resolveHttpClient = (context: NuxtContext) => {
  if (context.$axios) return context.$axios
  const $fetch = context.$fetch || ((globalThis as any).$fetch as FetchClient | undefined)
  return $fetch ? createFetchHttpClient($fetch) : createMissingHttpClient()
}

let $context = {} as NuxtContext,
  $axios = createMissingHttpClient()

export default (context: NuxtContext = {}) => {
  $context = context
  $axios = resolveHttpClient(context)
}

export { $context, $axios }
