export default new class {

  name = 'web'

  set (config: { name: string }) {
    this.name = config.name || this.name
  }
}