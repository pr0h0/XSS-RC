import HttpService from "./HttpService";
import LogService from "./LogService";

class AuthService extends HttpService {
  constructor() {
    super();
  }

  login({ password, remember }: { password: string; remember: boolean }) {
    return this.post("/login", { password, remember });
  }

  async check() {
    return this.get("/check", {})
      .then((req) => {
        if (!req.ok || req.redirected || req.status !== 200) {
          throw new Error("No access");
        }
        return true;
      })
      .catch((e) => {
        LogService.error(e);
        return false;
      });
  }

  logout() {
    return this.get("/logout", {}).catch(LogService.error);
  }
}

const authService = new AuthService();
export default authService;
