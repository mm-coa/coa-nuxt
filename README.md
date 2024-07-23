# mm-coa-nuxt

[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![npm version](https://img.shields.io/npm/v/coa-nuxt.svg?style=flat-square)](https://www.npmjs.org/package/coa-nuxt)
[![npm downloads](https://img.shields.io/npm/dm/coa-nuxt.svg?style=flat-square)](http://npm-stat.com/charts.html?package=coa-nuxt)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/coajs/coa-nuxt/pulls)

一个基于 Nuxt 的前端集成框架，包含了 Nuxt 基本框架、常用方法、必要的第三方类库

## 使用说明

### 安装

```shell
yarn add mm-coa-nuxt
```

### 框架

🚧 文档建设中

### 组件

- [Gateway 接口网关](#Gateway)
- [storage 储存](#storage)
- [time 时间](#time)
- [echo 输出](#echo)
- [die 终止](#die)

#### Gateway 接口网关

🚧 文档建设中

#### storage 储存

```typescript
import { storage } from 'mm-coa-nuxt'

// 设置本地储存
storage.local.set('key1', { info: 'value1' }, 10 * 60 * 1000 /*10分钟有效期*/)
// 获取本地储存
storage.local.get('key1')

// 设置会话储存
storage.session.set('key2', { info: 'value2' }, 10 * 60 * 1000 /*10分钟有效期*/)
// 获取会话储存
storage.session.get('key2')
```

#### time 时间

time 包含了一些常用时间常量，单位为毫秒

```typescript
import { time } from 'mm-coa-nuxt'

// 1秒钟 1000
time.oneSecond
// 1分钟 60*1000
time.oneMinute
// 1小时 60*60*1000
time.oneHour
// 1天 24*60*60*1000
time.oneDay
// 1周 7*24*60*60*1000
time.oneWeek
// 1个月 30*24*60*60*1000
time.oneMonth
// 1年 365*24*60*60*1000
time.oneYear
// 1世纪 100*365*24*60*60*1000
time.oneCentury
// 永久（100世纪） 100*100*365*24*60*60*1000
time.forever
```

#### echo 输出

```typescript
import { echo } from 'mm-coa-nuxt'

// 输出一个信息
echo.log('this is message')

// 输出一个信息并报错
echo.error('this is message with error')
```

#### die 终止

```typescript
import { die } from 'mm-coa-nuxt'

// 终止代码运行并给出提示信息
die.hint('error message')
```

### 第三方库

包含以下第三方库

- [dayjs](https://day.js.org/zh-CN)
- [lodash](https://lodash.com)

```typescript
// 获取 dayjs 对象，dayjs的使用详见 https://day.js.org/zh-CN
import { dayjs } from 'mm-coa-nuxt'

// 获取 lodash 对象，lodash的使用详见 https://lodash.com
import { lodash } from 'mm-coa-nuxt'

// lodash 存在别名 _ ，也可以直接导入
import { _ } from 'mm-coa-nuxt'
```
