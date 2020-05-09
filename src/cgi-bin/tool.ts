import { storage, time } from '..'

export default new class {

  handleStorageLocal (state: any[]) {
    for (let item of state) {
      const [type, key = '', value = null, ms = 0] = item
      if (type === 'set') {
        storage.local.set(key, value, ms < 1 ? time.forever : ms)
      } else if (type === 'remove') {
        storage.local.remove(key)
      }
    }
  }

  handleStorageSession (state: any[]) {
    for (let item of state) {
      const [type, key = '', value = null, ms = 0] = item
      if (type === 'set') {
        storage.session.set(key, value, ms < 1 ? time.forever : ms)
      } else if (type === 'remove') {
        storage.session.remove(key)
      }
    }
  }
}