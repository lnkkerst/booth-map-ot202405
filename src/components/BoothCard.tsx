import { Booth } from "@/schemas/booth";
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { MdClose } from "react-icons/md";

export type BoothCardProps = ComponentPropsWithoutRef<"div"> & {
  showClose?: boolean;
  booth?: Booth;
  onClose?: () => void;
};

export function BoothCard({
  booth,
  className,
  showClose = false,
  onClose,
  ...extraProps
}: BoothCardProps) {
  return (
    <div
      className={clsx("card card-side bg-base-100 relative", className)}
      {...extraProps}
    >
      {booth && (
        <figure>
          <img src={booth.card.cover} alt="Cover" className="w-40" />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">{booth?.name}</h2>
        <p>{booth?.card?.info}</p>
      </div>

      {showClose && (
        <div className="absolute top-2 right-2">
          <button className="btn btn-circle btn-sm" onClick={() => onClose?.()}>
            <MdClose></MdClose>
          </button>
        </div>
      )}
    </div>
  );
}
