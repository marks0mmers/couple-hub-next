import { WeddingBudgetItem } from "@prisma/client";

type Props = {
  budget?: Omit<WeddingBudgetItem, "dueDate"> & {
    dueDate: string | null;
  };
  onFormDoneClick: (isEditing: boolean) => void;
};

export default function BudgetForm({ budget, onFormDoneClick }: Props) {
  return (
    <tr>
      <td>
        {budget && (
          <input name="id" className="hidden" form="upsert-form" defaultValue={budget.id} />
        )}
        <input
          className="input input-bordered input-sm w-full"
          name="name"
          form="upsert-form"
          defaultValue={budget?.name}
        />
      </td>
      <td>
        <label className="input-group">
          <span>$</span>
          <input
            className="input input-bordered input-sm w-[calc(100%_-_32px)]"
            name="goalAmount"
            type="number"
            min={0}
            form="upsert-form"
            defaultValue={budget?.goalAmount}
          />
        </label>
      </td>
      <td>
        <label className="input-group">
          <span>$</span>
          <input
            className="input input-bordered input-sm w-[calc(100%_-_32px)]"
            name="actualAmount"
            type="number"
            min={0}
            form="upsert-form"
            defaultValue={budget?.actualAmount ?? 0}
          />
        </label>
      </td>
      <td />
      <td>
        <label className="input-group">
          <span>$</span>
          <input
            className="input input-bordered input-sm w-[calc(100%_-_32px)]"
            name="actualPaid"
            type="number"
            min={0}
            form="upsert-form"
            defaultValue={budget?.actualPaid ?? 0}
          />
        </label>
      </td>
      <td>
        <input
          className="input input-bordered input-sm"
          name="dueDate"
          type="date"
          form="upsert-form"
          defaultValue={budget?.dueDate ?? 0}
        />
      </td>
      <td>
        <button
          className="btn btn-sm"
          onClick={() => onFormDoneClick(!!budget)}
          type="submit"
          form="upsert-form"
        >
          Done
        </button>
      </td>
    </tr>
  );
}
