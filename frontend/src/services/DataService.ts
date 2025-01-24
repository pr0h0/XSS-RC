import { State } from "../types/state";
import HttpService from "./HttpService";

class DataService extends HttpService {
  constructor() {
    super();
  }

  getInitialData(): Promise<Partial<State>> {
    return this.get("/api/initialData", {}).then((data) => data.json());
  }

  convertObjectToQuery(obj: Record<string, string>): string {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }
}

const dataService = new DataService();
export default dataService;
