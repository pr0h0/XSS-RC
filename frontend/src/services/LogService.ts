export default class LogService {
  static format(...messages: Array<unknown>) {
    return [
      new Date().toISOString().slice(0, -1).split("T").join(" "),
      "-",
      ...messages,
    ].join(" ");
  }
  static log(...messages: Array<unknown>) {
    console.log(LogService.format(...messages));
  }

  static error(...messages: Array<unknown>) {
    console.error(LogService.format(...messages));
  }
}
