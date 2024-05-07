import type { AppRouter } from "@/trpc/routers";
import { createWSClient, TRPCClientError, wsLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";

const createClient = () =>
  createTRPCNext<AppRouter>({
    config(_opts) {
      return {
        links: [
          wsLink({
            client: createWSClient({
              url: process.env.NODE_ENV === "production"
                ? "/"
                : "ws://localhost:3001",
            }),
          }),
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
