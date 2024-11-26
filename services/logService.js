class LogService {
  format(...message) {
    return [`${new Date().toISOString()}  - `, ...message];
  }

  log(...message) {
    console.log(...this.format(...message));
  }

  error(...message) {
    console.error(...this.format(...message));
  }

  warn(...message) {
    console.warn(...this.format(...message));
  }

  info(...message) {
    console.info(...this.format(...message));
  }

  debug(...message) {
    console.debug(...this.format(...message));
  }

  dir(...message) {
    console.dir(...message, { depth: null });
  }
}

module.exports = new LogService();
