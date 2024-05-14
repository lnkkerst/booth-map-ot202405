import { Booth } from "@/schemas/booth";
import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { BoothCard } from "./BoothCard";

export type BoothCardModalProps = ComponentPropsWithoutRef<"dialog"> & {
  booth?: Booth;
};

export const BoothCardModal = forwardRef<
  HTMLDialogElement,
  BoothCardModalProps
>(function BoothCardModal({ booth, className, ...extraProps }, ref) {
  return (
    <dialog
      ref={ref}
      className={clsx("modal relative", className)}
      {...extraProps}
    >
      <BoothCard
        booth={booth}
        className="absolute bottom-20 w-[90%] max-w-sm mx-auto"
      >
      </BoothCard>

      <form method="dialog" className="modal-backdrop">
        <button></button>
      </form>
    </dialog>
  );
});
