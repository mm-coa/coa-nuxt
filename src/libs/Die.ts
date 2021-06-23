export class Die {
  hint(message: string) {
    setTimeout(() => {
      throw new Error(message)
    }, 0)
  }
}
