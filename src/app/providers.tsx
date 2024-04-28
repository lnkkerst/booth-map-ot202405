"use client";
import { trpc } from "@/utils/trpc";
import { Provider as JotaiProvider } from "jotai";
import { ReactNode } from "react";

function InnerProviders({ children }: { children: ReactNode; }) {
  return <JotaiProvider>{children}</JotaiProvider>;
}

export const Providers = trpc.withTRPC(InnerProviders) as typeof InnerProviders;
