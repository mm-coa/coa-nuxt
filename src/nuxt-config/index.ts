import { Configuration } from '@nuxt/types'
import { defaultsDeep } from 'lodash'

const toSnake = (str: string) => str
  .replace(/[-\/]@pages/g, '')
  .replace(/([^-:\/A-Z])([A-Z])/g, '$1_$2')
  .toLowerCase()

const extendRoutes = (routes: any[]) => {
  const new_routes = [] as any[]
  routes.forEach(v => {
    if (v.path.indexOf('@') < 0 || v.path.indexOf('@pages') > -1) {
      v.path = toSnake(v.path)
      v.chunkName = toSnake(v.chunkName)
      if (v.name) v.name = toSnake(v.name)
      if (v.children) v.children = extendRoutes(v.children)
      new_routes.push(v)
    }
  })
  return new_routes
}

const isProd = process.env.NODE_ENV === 'production'

export default function (config: Configuration) {

  // 强行覆盖base
  if (config.router.base) {
    config.router.base = `/${config.router?.base || ''}/`.replace(/\/+/g, '/')
  }

  // 默认配置
  const default_config: Configuration = {
    ssr: false,
    target: 'static',
    globalName: 'site',
    dir: {
      app: 'app/app',
      assets: 'app/assets',
      layouts: 'app/layouts',
      middleware: 'app/middleware',
      store: 'app/store',
      pages: 'apps',
      static: 'static'
    },
    router: {
      extendRoutes
    },
    generate: {
      dir: 'dist'
    },
    buildDir: 'dist-nuxt',
    build: {
      hardSource: !isProd,
      publicPath: '/rd/',
    },
    render: {
      resourceHints: false
    },
    loaders: {
      ts: {
        silent: true
      },
      tsx: {
        silent: true
      }
    },
    loading: {
      color: '#000',
      continuous: true,
    },
    loadingIndicator: {
      name: 'wandering-cubes',
      color: '#000',
      background: '#eee'
    },
    axios: {
      browserBaseURL: '/',
      proxy: !isProd,
      progress: false,
    },
  }

  // 扩展默认配置
  defaultsDeep(config, default_config)

  return config
}