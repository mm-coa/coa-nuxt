import { $axios } from '../app'
import { Dic } from '../typing'

export class Stat {

  private host: string = ''
  private name: string = ''
  private queue: Dic<string>[] = []
  private wait: number | boolean = false

  set ({ host, name }: { host: string, name?: string }) {
    this.host = host || ''
    this.name = name || 'event'
  }

  // 触发事件
  track (event: string, raw: Dic<string>) {

    // 如果host不存在，则不处理
    if (!this.host)
      return

    // 加入队列
    raw.event = event
    this.onTrack(raw)
    this.queue.push(raw)

    // 只保留最新100条
    if (this.queue.length > 100) {
      this.queue = this.queue.slice(-100)
    }

    // 如果已经在等待中，则不触发
    if (this.wait !== false)
      return

    // 新增等待定时
    this.wait = window.setTimeout(() => {
      this.upload()
      this.wait = false
    }, 1e3)
  }

  protected onUpload (raw: Dic<string>) {

  }

  protected onTrack (raw: Dic<string>) {

  }

  // 上报
  private upload () {

    const logs = this.queue.slice()
    this.queue = []

    if (logs.length < 1)
      return

    logs.forEach(v => this.onUpload(v))

    const data = { '__logs__': logs }
    const headers = { 'x-log-apiversion': '0.6.0', 'x-log-bodyrawsize': JSON.stringify(data).length }

    // 上报
    $axios.post(`https://${this.host}/logstores/${this.name}/track`, data, { headers })
      .then(() => this.queue.length > 0 && this.upload())
      .catch(e => 404 !== e.status && this.queue.unshift(...logs))
  }
}