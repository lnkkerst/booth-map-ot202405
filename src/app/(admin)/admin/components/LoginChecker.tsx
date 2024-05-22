"use client";

import { trpc } from "@/utils/trpc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginChecker() {
  const mutation = trpc.auth.useMutation();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const fn = async () => {
      const token = localStorage.getItem("token");
      if (
        !await (async () => {
          if (pathname?.endsWith("login")) {
            return true;
          }
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
  }, [mutation, router, pathname]);
  return <></>;
}
