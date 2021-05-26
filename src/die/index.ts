export default new (class {
  hint(message: string) {
    setTimeout(() => {
      throw new Error(message)
    }, 0)
  }
})()
