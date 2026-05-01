import HttpService from "./HttpService";

class HistoryService extends HttpService {
  constructor() {
    super();
  }

  getAll(searchParams: URLSearchParams) {
    return this.get("/api/history", Object.fromEntries(searchParams.entries()))
      .then((data) => data.json())
      .catch((e) => e.message);
  }

  delete(ids: number[]) {
    return this.post("/api/history/delete", { ids }, { method: "DELETE" })
      .then((x) => x.json())
      .catch((x) => x);
  }
}

const historyService = new HistoryService();
export default historyService;
