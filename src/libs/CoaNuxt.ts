import { defaultsDeep } from 'lodash'

declare const process: { env: { NODE_ENV?: string } }

export type NuxtConfig = {
  [key: string]: any
  app?: {
    baseURL?: string
    buildAssetsDir?: string
    [key: string]: any
  }
  dir?: {
    assets?: string
    layouts?: string
    middleware?: string
    pages?: string
    public?: string
    [key: string]: any
  }
  hooks?: {
    [key: string]: any
    'pages:extend'?: (routes: any[]) => void
  }
  typescript?: {
    tsConfig?: {
      include?: string[]
      [key: string]: any
    }
    [key: string]: any
  }
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
  static config(config: NuxtConfig) {
    // 强行覆盖base
    if (config.app?.baseURL) {
      config.app.baseURL = `/${config.app.baseURL || ''}/`.replace(/\/+/g, '/')
    }

    // 默认配置
    const default_config: NuxtConfig = {
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
          dir: 'dist',
        },
      },
    }

    // 扩展默认配置
    defaultsDeep(config, default_config)

    return config
  }
}
