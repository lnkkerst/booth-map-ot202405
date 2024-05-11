import { Booth } from "@/schemas/booth";
import clsx from "clsx";
import Image from "next/image";
import { ComponentPropsWithoutRef, forwardRef } from "react";

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
      <div className="absolute bottom-20 w-[90%] max-w-sm mx-auto card card-side bg-base-100">
        {booth
          && (
            <figure>
              <img
                src={booth.card.cover}
                alt="Cover"
                className="w-40"
              />
            </figure>
          )}
        <div className="card-body">
          <h2 className="card-title">{booth?.name}</h2>
          <p>{booth?.card?.info}</p>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button></button>
      </form>
    </dialog>
  );
});
