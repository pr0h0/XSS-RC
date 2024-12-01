class LogService {
  constructor() {
    const logLevels = ["log", "error", "warn", "info", "debug", "dir"];
    this.enabledLogs = process.env.ENABLED_LOGS?.split(",") || logLevels;
    if (!this.enabledLogs.includes("error")) {
      console.warn(
        "We suggest you to enable error logs to get notified about errors in your application.",
      );
    }
  }

  format(...message) {
    return [`${new Date().toISOString()}  - `, ...message];
  }

  log(...message) {
    if (!this.enabledLogs.includes("log")) return;
    console.log(...this.format(...message));
  }

  error(...message) {
    if (!this.enabledLogs.includes("error")) return;
    console.error(...this.format(...message));
  }

  warn(...message) {
    if (!this.enabledLogs.includes("warn")) return;
    console.warn(...this.format(...message));
  }

  info(...message) {
    if (!this.enabledLogs.includes("info")) return;
    console.info(...this.format(...message));
  }

  debug(...message) {
    if (!this.enabledLogs.includes("debug")) return;
    console.debug(...this.format(...message));
  }

  dir(...message) {
    console.dir(...message, { depth: null });
  }
}

module.exports = new LogService();
