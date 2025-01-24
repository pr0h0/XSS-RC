import HttpService from "./HttpService";

class HistoryService extends HttpService {
  constructor() {
    super();
  }

  delete(ids: number[]) {
    return this.post("/api/history/delete", { ids }, { method: "DELETE" })
      .then((x) => x.json())
      .catch((x) => x);
  }
}

const historyService = new HistoryService();
export default historyService;
