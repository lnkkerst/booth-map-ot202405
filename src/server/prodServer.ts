import type { Socket } from "net";
import next from "next";
import { createServer } from "node:http";
import { parse } from "node:url";

import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { EventEmitter } from "events";
import { WebSocketServer } from "ws";

import { appRouter } from "@/trpc/routers";
import { globalForWss } from "./wss";

EventEmitter.defaultMaxListeners = 65536;

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    if (!req.url) {
      return;
    }
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  });
  const wss = new WebSocketServer({ server });
  globalForWss.wss = wss;
  const handler = applyWSSHandler({ wss, router: appRouter });

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
  });

  server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket as Socket, head, ws => {
      wss.emit("connection", ws, req);
    });
  });

  // Keep the next.js upgrade handler from being added to our custom server
  // so sockets stay open even when not HMR.
  const originalOn = server.on.bind(server);
  server.on = function(event, listener) {
    return event !== "upgrade" ? originalOn(event, listener) : server;
  };
  server.listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`,
  );
});
