import { appRouter } from "@/trpc/routers";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import * as dotenv from "dotenv";
import { WebSocketServer } from "ws";

dotenv.config({
  path: [".env.local", ".env"],
});

const wss = new WebSocketServer({
  port: 3001,
});
const handler = applyWSSHandler({ wss, router: appRouter });

wss.on("connection", ws => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
