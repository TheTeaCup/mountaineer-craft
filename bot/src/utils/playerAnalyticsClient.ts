import logger from "./logger";
import { config } from "../config";

class PlayerAnalyticsClient {
  private cookie: string | null = null;

  private baseUrl = config.PLAYER_ANALYTICS_URL!;
  private user = config.PLAYER_ANALYTICS_USERNAME!;
  private password = config.PLAYER_ANALYTICS_PASSWORD!;

  async login() {
    logger.info("Logging into Plan API...");

    const res = await fetch(
      `${this.baseUrl}/auth/login?user=${this.user}&password=${this.password}`,
      { method: "GET" },
    );

    if (res.status === 502) {
      logger.error("Plan API is down (502 Bad Gateway)");
      throw new Error("Plan API is down");
    }

    const cookie = res.headers.get("set-cookie");

    if (!cookie) {
      logger.error("Plan API login failed: no auth cookie received");
      console.log(res);
      throw new Error("Failed to obtain auth cookie");
    }

    this.cookie = cookie.split(";")[0];
  }

  async request(endpoint: string) {
    if (!this.cookie) {
      await this.login();
    }

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        cookie: this.cookie!,
      },
    });

    if (res.status === 502) {
      logger.error("Plan API is down (502 Bad Gateway)");
      throw new Error("Plan API is down");
    }

    if (res.status === 401 || res.status === 403) {
      // cookie expired → relogin
      await this.login();

      return fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          cookie: this.cookie!,
        },
      });
    }

    return res;
  }
}

export default new PlayerAnalyticsClient();
