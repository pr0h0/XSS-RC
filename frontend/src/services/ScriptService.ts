import HttpService from "./HttpService";

class ScriptService extends HttpService {
  constructor() {
    super();
  }

  createNewScript({ name, site }: { name: string; site: string }) {
    return this.post("/api/scripts", { name, site }).then((data) =>
      data.json()
    );
  }

  deleteScript(id: number) {
    return this.post(`/api/scripts/${id}`, {}, { method: "DELETE" }).then(
      (data) => data.json()
    );
  }

  getScriptUrl(id: number) {
    return `${this.baseUrl}/scripts/${id}/script.js`;
  }
}

const scriptService = new ScriptService();
export default scriptService;
