export default new class {

  log (message?: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams)
  }

  error (message?: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams)
    throw new Error(message)
  }

}