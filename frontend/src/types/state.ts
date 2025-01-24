import History from "./history";
import Script from "./script";
import Session from "./session";

export interface State {
  sessions: Array<Session>;
  sessionsCount: number;
  history: Array<History>;
  historyCount: number;
  screenshotsCount: number;
  scripts: Array<Script>;
  scriptsCount: number;
  hasAccess: boolean;
}

export interface StateContext {
  value: State;
  update: (value: Partial<State>) => Promise<State>;
}
