import type { AppRouter } from "@/trpc/routers";
import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import WebSocket from "ws";

let connected = 0;
let message = 0;
let disconnected = 0;
let error = 0;

async function connect() {
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      wsLink({
        client: createWSClient({
          url: "wss://alt-booth-map-202405.0nline.tech/",
          WebSocket: WebSocket as any,
        }),
      }),
    ],
  });
  trpc.onUpdate.subscribe(undefined, {
    onStarted: () => {
      console.log(`started ${++connected}`);
    },
    onData: e => {
      console.log(`message ${++message}`);
    },
    onStopped: () => {
      console.log(`message ${++disconnected}`);
    },
    onError: () => {
      console.log(`error ${++error}`);
    },
  });
}

async function main() {
  for (let i = 1; i <= 1000; ++i) {
    connect();
  }
}

main();
