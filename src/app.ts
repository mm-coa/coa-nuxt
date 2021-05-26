import { Context } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

let $context = {} as Context,
  $axios = {} as NuxtAxiosInstance

export default (context: Context) => {
  $context = context
  $axios = context.$axios
}

export { $context, $axios }
