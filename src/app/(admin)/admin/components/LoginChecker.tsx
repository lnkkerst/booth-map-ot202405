"use client";

import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginChecker() {
  const mutation = trpc.auth.useMutation();
  const router = useRouter();
  useEffect(() => {
    const fn = async () => {
      const token = localStorage.getItem("token");
      if (
        !await (async () => {
          if (!token) {
            return false;
          }
          try {
            await mutation.mutateAsync({
              password: token,
            });
            return true;
          } catch (_e) {
            return false;
          }
        })()
      ) {
        router.push("/admin/login");
      }
    };

    fn();
  }, [mutation, router]);
  return <></>;
}