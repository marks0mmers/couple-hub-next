"use client";

import { User, Wedding } from "@prisma/client";
import format from "date-fns/format";
import { ChangeEvent, useCallback, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import debounce from "lodash/debounce";

async function updateWedding(body: unknown): Promise<WeddingProp> {
  const url = "/api/weddings";
  const options = {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(url, options);
  return res.json();
}

type WeddingProp = Omit<Wedding, "weddingDate"> & {
  weddingDate: string | null;
  users: User[];
};

type Props = {
  coupleId: string;
  wedding?: WeddingProp;
};

export default function ClientWeddingPage({ coupleId, wedding: weddingProp }: Props) {
  const [wedding, setWedding] = useState(weddingProp);

  const updateWeddingState = useCallback((wedding: WeddingProp) => {
    setWedding((prev) => ({
      ...prev,
      ...wedding,
      weddingDate: wedding.weddingDate ? format(new Date(wedding.weddingDate), "yyyy-MM-dd") : null,
    }));
  }, []);

  const onCreateClick = useCallback(async () => {
    const url = "/api/weddings";
    const options = {
      method: "POST",
      body: JSON.stringify({
        coupleId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(url, options);
    const createdWedding: WeddingProp = await res.json();

    updateWeddingState(createdWedding);
  }, [coupleId, updateWeddingState]);

  const onWeddingDateChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value;
      const updatedWedding = await updateWedding({
        ...wedding,
        weddingDate: newDate,
      });
      updateWeddingState(updatedWedding);
    },
    [wedding, updateWeddingState]
  );

  const onNumberOfGuestsChanged = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newNumberOfGuests = +e.target.value;
      const updatedWedding = await updateWedding({
        ...wedding,
        plannedNumberOfGuests: newNumberOfGuests,
      });
      updateWeddingState(updatedWedding);
    },
    [wedding, updateWeddingState]
  );

  const onTotalCostChanged = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newTotalCost = +e.target.value;
      const updatedWedding = await updateWedding({
        ...wedding,
        plannedTotalCost: newTotalCost,
      });
      updateWeddingState(updatedWedding);
    },
    [wedding, updateWeddingState]
  );

  if (!wedding) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <article className="prose max-w-none">
          <h3 className="text-center">Click to start planning your wedding!</h3>
        </article>
        <button className="btn btn-secondary gap-2" onClick={onCreateClick}>
          <PlusIcon className="h-6 w-6" />
          Create
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4">
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Wedding Date</span>
        </label>
        <input
          id="wedding-date"
          type="date"
          className="input input-bordered"
          defaultValue={wedding.weddingDate ?? undefined}
          onChange={debounce(onWeddingDateChange, 500)}
        />
      </div>
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Number of Guests</span>
        </label>
        <input
          id="number-of-guests"
          type="number"
          className="input input-bordered"
          defaultValue={wedding.plannedNumberOfGuests}
          onChange={debounce(onNumberOfGuestsChanged, 500)}
          min={0}
        />
      </div>
      <div className="form-control flex-1">
        <label className="label">
          <span className="label-text">Estimated Budget</span>
        </label>
        <label className="input-group flex">
          <span>$</span>
          <input
            id="estimated-cost"
            type="number"
            className="input input-bordered flex-1"
            defaultValue={wedding.plannedTotalCost}
            onChange={debounce(onTotalCostChanged, 500)}
            min={0}
            step={0.01}
          />
        </label>
      </div>
    </div>
  );
}