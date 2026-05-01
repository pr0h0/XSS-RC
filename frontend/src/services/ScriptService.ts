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
    const host = window.location.hostname;
    const port = window.location.port === "5173" ? "3000" : window.location.port;
    const origin = port ? `${window.location.protocol}//${host}:${port}` : `${window.location.protocol}//${host}`;
    return `${origin}/scripts/${id}/script.js`;
  }
}

const scriptService = new ScriptService();
export default scriptService;
