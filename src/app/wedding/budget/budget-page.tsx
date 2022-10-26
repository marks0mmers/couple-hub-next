"use client";

/* eslint-disable react/no-unknown-property */
import { useCallback, useState, MouseEvent, useRef } from "react";
import { WeddingBudgetItem } from "@prisma/client";
import { PlusIcon } from "@heroicons/react/24/solid";
import BudgetForm from "./budget-form";

type Props = {
  budgetItems: (Omit<WeddingBudgetItem, "dueDate"> & {
    dueDate: string | null;
  })[];
  wedding: {
    id: string;
    plannedTotalCost: number;
  };
};

export default function ClientWeddingBudgetPage({ budgetItems, wedding }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const onEditClick = useCallback(
    (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setEditingId(id);
    },
    []
  );

  const onFormDoneClick = useCallback((isEditing: boolean) => {
    if (isEditing) {
      setEditingId(null);
    } else {
      setIsCreating(false);
    }
    formRef.current?.submit();
  }, []);

  const getDifference = useCallback((goalAmount: number, actualAmount: number | null) => {
    if (!actualAmount) {
      return "-";
    }
    const difference = goalAmount - actualAmount;
    return difference >= 0 ? `$${difference.toFixed(2)}` : `$(${(difference * -1).toFixed(2)})`;
  }, []);

  return (
    <div id="budget-container" className="p-4 flex flex-col flex-1">
      <div className="flex justify-between items-center">
        <div className="stats border-[1px]">
          <div className="stat">
            <div className="stat-title">Budgeted</div>
            <div className="stat-value">${wedding.plannedTotalCost}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Planned Total</div>
            <div className="stat-value">
              ${budgetItems.reduce((acc, val) => acc + val.goalAmount, 0)}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Planned Actual</div>
            <div className="stat-value">
              ${budgetItems.reduce((acc, val) => acc + (val.actualAmount ?? 0), 0)}
            </div>
          </div>
        </div>
        <button
          className="btn btn-success gap-2 text-primary-content"
          onClick={() => setIsCreating((prev) => !prev)}
        >
          <PlusIcon className="w-6 h-6" />
          Add Item
        </button>
      </div>
      <div className="divider" />
      <div className="flex-1">
        <form
          ref={formRef}
          id="upsert-form"
          className="hidden"
          action={`/api/weddings/budgets?weddingId=${wedding.id}`}
          method="post"
        />
        <table className="table w-full table-fixed">
          <thead>
            <tr>
              <td>Name</td>
              <td>Goal</td>
              <td>Actual</td>
              <td>Difference</td>
              <td>Amount Paid</td>
              <td>Payment Due</td>
              <td align="center" className="w-24">
                Edit
              </td>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map((item) =>
              editingId !== item.id ? (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{`$${item.goalAmount.toFixed(2)}`}</td>
                  <td>{`$${item.actualAmount?.toFixed(2) ?? "-"}`}</td>
                  <td>{getDifference(item.goalAmount, item.actualAmount)}</td>
                  <td>{`$${item.actualPaid?.toFixed(2) ?? "-"}`}</td>
                  <td>{item.dueDate}</td>
                  <td align="center">
                    <button className="btn btn-sm" onClick={onEditClick(item.id)} type="button">
                      Edit
                    </button>
                  </td>
                </tr>
              ) : (
                <BudgetForm budget={item} onFormDoneClick={onFormDoneClick} />
              )
            )}
            {isCreating && <BudgetForm onFormDoneClick={onFormDoneClick} />}
          </tbody>
        </table>
      </div>
    </div>
  );
}
