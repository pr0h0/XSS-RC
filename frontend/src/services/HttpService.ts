const BASE_URL = "http://localhost:3000";

type bodyType = Record<string, string | number | boolean | number[]>;

export default class HttpService {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  baseUrl: string;

  public get(path: string, query: bodyType) {
    const queryString = Object.entries(query)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    const finalUrl = `${BASE_URL}${path}${
      queryString ? `?${queryString}` : ""
    }`;

    return fetch(finalUrl, { credentials: "include" });
  }

  public post(path: string, body: bodyType, options?: RequestInit) {
    const finalUrl = `${BASE_URL}${path}`;
    return fetch(finalUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
      ...options,
    });
  }
}
