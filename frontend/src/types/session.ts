export default interface Session {
  id: number;
  name: string;
  status: "Active" | "Closed";
  description: string;
  time: string;
  ua: string;
  ip: string;
  scriptId: number;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
}
