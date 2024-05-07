import { Booth } from "@/schemas/booth";
import { trpc } from "@/utils/trpc";
import { produce } from "immer";
import { cloneDeep } from "lodash-es";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  MouseEvent,
  useEffect,
  useState,
} from "react";

export type BoothModalProps = ComponentPropsWithoutRef<"dialog"> & {
  booth?: Booth;
  onUpdated?: (booth: Booth) => void;
};

export const BoothModal = forwardRef<HTMLDialogElement, BoothModalProps>(
  function BoothModal({ booth, onUpdated, ...extraProps }, ref) {
    const [form, setForm] = useState<Booth>({
      id: "",
      name: "",
      count: 0,
      position: {
        x: 0,
        y: 0,
      },
    });

    useEffect(() => {
      if (booth) {
        setForm(cloneDeep(booth));
      }
    }, [booth]);

    const boothMutation = trpc.updateBooths.useMutation();

    async function handleSubmit(e: MouseEvent) {
      e.preventDefault();
      await boothMutation.mutateAsync(form);
      onUpdated?.(form);
    }

    return (
      <dialog
        ref={ref}
        className="modal"
        {...extraProps}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">修改信息</h3>

          <form className="form-control mt-4 max-w-full">
            <input
              className="input input-bordered my-2"
              type="text"
              value={form.name}
              onChange={e =>
                setForm(produce(draft => void (draft.name = e.target.value)))}
            />

            <input
              className="input input-bordered my-2"
              type="number"
              value={form.count}
              onChange={e =>
                setForm(
                  produce(
                    draft =>
                      void (draft.count = Number.parseInt(e.target.value)),
                  ),
                )}
            />
          </form>

          <div className="modal-action justify-between">
            <button
              className="btn btn-primary w-20"
              onClick={handleSubmit}
            >
              {boothMutation.isPending
                ? <span className="loading loading-spinner"></span>
                : <span>提交</span>}
            </button>

            <form method="dialog">
              <button className="btn w-20">关闭</button>
            </form>
          </div>
        </div>
      </dialog>
    );
  },
);
