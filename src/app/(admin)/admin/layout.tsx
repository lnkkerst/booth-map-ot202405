import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import { MdOpenInNew } from "react-icons/md";
import { LoginChecker } from "./components/LoginChecker";

export type AdminLayoutProps = {
  children?: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <LoginChecker></LoginChecker>
      <header className={clsx("navbar", "shadow")}>
        <div className="flex-1">
          <Link
            className="btn btn-ghost text-xl"
            href="/admin"
            prefetch={false}
          >
            展台地图
          </Link>
        </div>

        <div className="flex-none">
          <Link prefetch={false} className="btn btn-ghost" href="/">
            用户地图
            <MdOpenInNew></MdOpenInNew>
          </Link>
        </div>
      </header>

      <main>{children}</main>
    </>
  );
}
