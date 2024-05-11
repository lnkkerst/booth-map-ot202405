import type { AppRouter } from "@/trpc/routers";
import {
  createWSClient,
  httpBatchLink,
  TRPCClientError,
  TRPCLink,
  wsLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { NextPageContext } from "next";

function getProdWsEndpoint() {
  let protocol = "ws";
  if (window.location.protocol === "https:") {
    protocol = "wss";
  }
  let host = window.location.host;
  return `${protocol}://${host}/`;
}

function getEndingLink(ctx: NextPageContext | undefined): TRPCLink<AppRouter> {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `/api/trpc`,
      headers() {
        if (!ctx?.req?.headers) {
          return {};
        }
        // on ssr, forward client's headers to the server
        return {
          ...ctx.req.headers,
          "x-ssr": "1",
        };
      },
    });
  }
  const client = createWSClient({
    url: process.env.NODE_ENV === "production"
      ? getProdWsEndpoint()
      : "ws://localhost:3001",
  });
  return wsLink({
    client,
  });
}

const createClient = () =>
  createTRPCNext<AppRouter>({
    config({ ctx }) {
      return {
        links: [
          getEndingLink(ctx),
        ],
      };
    },
    ssr: false,
  });

export const trpc = createClient();

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
