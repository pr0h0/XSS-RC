import { io, Socket } from "socket.io-client";
import LogService from "./LogService";

type HistoryItem = {
  id: number;
  type: string;
  sessionId: string;
  content: string;
  response: string;
  createdAt: string;
  updatedAt: string;
};

type Command = {
  type: string;
  payload: string;
  commandId?: number;
};

class SocketService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private onResult: ((item: HistoryItem) => void) | null = null;
  private onStatusChange: ((connected: boolean) => void) | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(sessionId: string) {
    if (this.socket?.connected && this.sessionId === sessionId) return;

    this.disconnect();
    this.sessionId = sessionId;

    const url = window.location.origin;
    this.socket = io(url, { reconnection: false });

    this.socket.on("connect", () => {
      LogService.log("Socket connected");
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      this.socket?.emit("admin:join", { id: sessionId } as object);
      this.onStatusChange?.(true);
    });

    this.socket.on("disconnect", () => {
      LogService.log("Socket disconnected");
      this.onStatusChange?.(false);
      this.reconnectTimer = setTimeout(() => {
        this.socket?.connect();
      }, 2500);
    });

    this.socket.on("result", (data: HistoryItem) => {
      this.onResult?.(data);
    });
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.off();
      this.socket.disconnect();
      this.socket = null;
    }
    this.sessionId = null;
  }

  sendCommand(message: Command) {
    if (!this.socket?.connected || !this.sessionId) {
      LogService.error("Cannot send command: not connected");
      return;
    }
    this.socket.emit("admin:command", {
      id: this.sessionId,
      message,
    });
  }

  setOnResult(callback: (item: HistoryItem) => void) {
    this.onResult = callback;
  }

  setOnStatusChange(callback: (connected: boolean) => void) {
    this.onStatusChange = callback;
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

const socketService = new SocketService();
export default socketService;
