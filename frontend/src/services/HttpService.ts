const BASE_URL = "";

type bodyType = Record<string, string | number | boolean | number[]>;

export default class HttpService {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  baseUrl: string;

  public get(path: string, query: bodyType) {
    const queryString = Object.entries(query)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
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
