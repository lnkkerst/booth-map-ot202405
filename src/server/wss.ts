import { WebSocketServer } from "ws";

export const globalForWss = global as unknown as { wss: WebSocketServer; };

export function getWss() {
  if (!globalForWss.wss) {
    throw new Error("Failed to init wss");
  }
  return globalForWss.wss;
}
