import * as dayjs from 'dayjs'
import * as _ from 'lodash'
import { Die } from './libs/Die'
import { Echo } from './libs/Echo'

export { CgiBin } from './libs/CgiBin'
export { CoaNuxt } from './libs/CoaNuxt'
export { Die } from './libs/Die'
export { Gateway } from './libs/Gateway'
export { Stat } from './libs/Stat'
export { Storage } from './libs/Storage'
export { time } from './tools/time'
export * from './typing'
export { _, dayjs }

export const die = new Die()
export const echo = new Echo()
export const storage = new Storage()
