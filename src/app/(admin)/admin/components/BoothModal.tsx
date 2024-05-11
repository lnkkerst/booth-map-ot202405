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
      minutes: 0,
      show: "count",
      card: {
        cover: "https://http.cat/404",
        info: "",
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
      await boothMutation.mutateAsync({
        data: form,
        password: localStorage.getItem("token")!,
      });
      onUpdated?.(form);
    }

    return (
      <dialog ref={ref} className="modal" {...extraProps}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">修改信息</h3>

          <form className="form-control mt-4 max-w-full my-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">展台名称</span>
              </div>
              <input
                className="input input-bordered"
                type="text"
                value={form.name}
                onChange={e =>
                  setForm(produce(draft => void (draft.name = e.target.value)))}
              />
            </label>

            <label className="form-control w-full mt-2 mb-0">
              <div className="label">
                <span className="label-text">显示信息</span>
              </div>
              <div className="flex flex-row items-center justify-around">
                {(
                  [
                    { value: "count", title: "人数" },
                    {
                      value: "minutes",
                      title: "等待时间（分钟）",
                    },
                  ] as { value: Booth["show"]; title: string; }[]
                ).map(option => (
                  <div className="form-control" key={option.value}>
                    <label className="label cursor-pointer gap-2">
                      <span className="label-text">{option.title}</span>
                      <input
                        type="radio"
                        name="booth-show"
                        checked={form.show === option.value}
                        className="radio checked:bg-primary"
                        onChange={() =>
                          setForm(
                            produce(draft =>
                              void (draft.show = option.value)
                            ),
                          )}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </label>

            {form.show === "count"
              ? (
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">人数</span>
                  </div>
                  <input
                    className="input input-bordered"
                    type="number"
                    value={form.count}
                    onChange={e =>
                      setForm(
                        produce(
                          draft =>
                            void (draft.count = Number.parseInt(
                              e.target.value,
                            )),
                        ),
                      )}
                  />
                </label>
              )
              : (
                <label className="form-control w-full my-2">
                  <div className="label">
                    <span className="label-text">等待时间（分钟）</span>
                  </div>
                  <input
                    className="input input-bordered"
                    type="number"
                    value={form.minutes}
                    onChange={e =>
                      setForm(
                        produce(
                          draft =>
                            void (draft.minutes = Number.parseInt(
                              e.target.value,
                            )),
                        ),
                      )}
                  />
                </label>
              )}
          </form>

          <div className="modal-action justify-between">
            <button className="btn btn-primary w-20" onClick={handleSubmit}>
              {boothMutation.isLoading
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
