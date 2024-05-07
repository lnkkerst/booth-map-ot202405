"use client";
import { isTRPCClientError, trpc } from "@/utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const loginMutation = trpc.auth.useMutation();
  const router = useRouter();
  const [routing, setRouting] = useState(false);

  return (
    <div
      className={clsx(
        "card w-[90%] max-w-[720px] mt-36 bg-base-100 drop-shadow-md mx-auto",
      )}
    >
      <div className="card-body">
        <div className="card-title">验证身份</div>

        <form className="form-control mt-4">
          <input
            type="password"
            placeholder="请输入密码"
            className="input input-bordered w-full"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            className={clsx("btn w-24 mx-auto mt-4 btn-primary")}
            onClick={async e => {
              e.preventDefault();

              try {
                await loginMutation.mutateAsync({ password });
                localStorage.setItem("token", password);
                setRouting(true);
                router.replace("/admin");
              } catch (e) {
                if (isTRPCClientError(e) && e.data?.code === "UNAUTHORIZED") {
                  alert("密码错误");
                } else {
                  alert("未知错误");
                }
              }
            }}
          >
            {loginMutation.isPending || routing
              ? <span className="loading loading-spinner"></span>
              : <span>登录</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
