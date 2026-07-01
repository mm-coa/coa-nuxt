import { defaultsDeep } from 'lodash'
import type { NuxtConfig } from 'nuxt/schema'
import type { NitroConfig } from 'nitropack/types'

declare const process: { env: { NODE_ENV?: string } }

export type CoaNuxtConfig = NuxtConfig & {
  nitro?: NitroConfig
}

const toSnake = (str: string) =>
  str
    .replace(/[-\/]@pages/g, '')
    .replace(/([^-:\/A-Z])([A-Z])/g, '$1_$2')
    .toLowerCase()

const extendRoutes = (routes: any[]) => {
  for (const route of [...routes]) {
    if (route.path.indexOf('@') >= 0 && route.path.indexOf('@pages') < 0) {
      routes.splice(routes.indexOf(route), 1)
      continue
    }

    route.path = toSnake(route.path)
    if (route.name) route.name = toSnake(String(route.name))
    if (route.children) extendRoutes(route.children)
  }
}

const includeAppPageTypes = ({ tsConfig }: { tsConfig: { include?: string[] } }) => {
  tsConfig.include ||= []
  if (!tsConfig.include.includes('../apps/**/*')) {
    tsConfig.include.push('../apps/**/*')
  }
}

const defaultBuildAssetsDir = () => (process.env.NODE_ENV === 'production' ? '/rd/' : '/_nuxt/')

export class CoaNuxt {
  // 设置配置
  static config(config: CoaNuxtConfig) {
    // 强行覆盖base
    if (config.app?.baseURL) {
      config.app.baseURL = `/${config.app.baseURL || ''}/`.replace(/\/+/g, '/')
    }

    // 默认配置
    const default_config: CoaNuxtConfig = {
      ssr: false,
      app: {
        baseURL: '/',
        buildAssetsDir: defaultBuildAssetsDir(),
      },
      dir: {
        assets: 'assets',
        layouts: 'layouts',
        middleware: 'middleware',
        pages: '../apps',
        plugins: 'plugins',
        public: 'static',
      },
      buildDir: '.nuxt',
      typescript: {
        tsConfig: {
          include: ['../apps/**/*', '../typings.ts'],
        },
      },
      hooks: {
        'pages:extend': extendRoutes,
        'prepare:types': includeAppPageTypes,
      },
      nitro: {
        output: {
          dir: '.output',
          publicDir: 'dist',
        },
      },
    }

    // 扩展默认配置
    defaultsDeep(config, default_config)

    return config
  }
}
