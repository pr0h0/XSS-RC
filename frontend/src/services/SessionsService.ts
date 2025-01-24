import HttpService from "./HttpService";

class SessionsService extends HttpService {
  constructor() {
    super();
  }

  delete(ids: number[]) {
    return this.post("/api/sessions/delete", { ids }, { method: "DELETE" })
      .then((data) => data.json())
      .catch((e) => e.message);
  }

  getAll(searchParams:URLSearchParams) {
    return this.get("/api/sessions", Object.fromEntries(searchParams.entries()))
      .then((data) => data.json())
      .catch((e) => e.message);
  }
}

const sessionsService = new SessionsService();
export default sessionsService;
