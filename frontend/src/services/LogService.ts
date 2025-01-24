export default class LogService {
  static format(...messages: Array<object>) {
    return [
      new Date().toISOString().slice(0, -1).split("T").join(" "),
      "-",
      ...messages,
    ].join(" ");
  }
  static log(...messages: Array<object>) {
    console.log(LogService.format(...messages));
  }

  static error(...messages: Array<object>) {
    console.error(LogService.format(...messages));
  }
}
