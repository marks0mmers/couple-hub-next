"use client";

import { WeddingVenuePriceType } from "@prisma/client";
import { useState } from "react";
import { STATES } from "../../../../util/constants";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  weddingId: string;
};

export default function ClientCreateVenuePage({ weddingId }: Props) {
  const [priceType, setPriceType] = useState<WeddingVenuePriceType>(WeddingVenuePriceType.FLAT_FEE);

  return (
    <div id="form-container" className="p-4">
      <form
        action={`/api/weddings/venues?weddingId=${weddingId}`}
        method="post"
        className="grid grid-cols-12 gap-2"
      >
        <article className="prose col-start-3 col-span-8 max-w-none text-center">
          <h3>Add a New Venue</h3>
        </article>
        <div className="form-control col-start-3 col-span-6">
          <label className="label">
            <span className="label-text">Name of Venue</span>
          </label>
          <input name="name" className="input input-bordered" required={true} />
        </div>
        <div className="form-control col-start-9 col-span-2">
          <label className="label">
            <span className="label-text">Capacity</span>
          </label>
          <input
            name="capacity"
            className="input input-bordered"
            type="number"
            min={0}
            required={true}
          />
        </div>
        <div className="form-control col-start-3 col-span-2">
          <label className="label">
            <span className="label-text">Price Type</span>
          </label>
          <div className="btn-group">
            <button
              type="button"
              className={clsx("btn", "no-animation", {
                "btn-active": priceType === WeddingVenuePriceType.FLAT_FEE,
              })}
              onClick={() => setPriceType(WeddingVenuePriceType.FLAT_FEE)}
            >
              Flat Fee
            </button>
            <button
              type="button"
              className={clsx("btn", "no-animation", {
                "btn-active": priceType === WeddingVenuePriceType.PER_HOUR,
              })}
              onClick={() => setPriceType(WeddingVenuePriceType.PER_HOUR)}
            >
              Per Hour
            </button>
            <input
              name="priceType"
              type="radio"
              className="hidden"
              value={WeddingVenuePriceType.PER_HOUR}
              defaultChecked={priceType === WeddingVenuePriceType.PER_HOUR}
            />
            <input
              name="priceType"
              type="radio"
              className="hidden"
              value={WeddingVenuePriceType.FLAT_FEE}
              defaultChecked={priceType === WeddingVenuePriceType.FLAT_FEE}
            />
          </div>
        </div>
        <div
          className={clsx("form-control", "col-start-5", {
            "col-span-2": priceType === WeddingVenuePriceType.PER_HOUR,
            "col-span-6": priceType === WeddingVenuePriceType.FLAT_FEE,
          })}
        >
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <label className="input-group flex">
            <span>$</span>
            <input
              name="price"
              className="input input-bordered flex-1"
              type="number"
              min={0}
              required={true}
            />
          </label>
        </div>
        {priceType === WeddingVenuePriceType.PER_HOUR && (
          <>
            <div className="form-control col-start-7 col-span-2">
              <label className="label">
                <span className="label-text">Rental Start</span>
              </label>
              <input
                name="rentalStart"
                className="input input-bordered"
                type="time"
                required={true}
              />
            </div>
            <div className="form-control col-start-9 col-span-2">
              <label className="label">
                <span className="label-text">Rental End</span>
              </label>
              <input
                name="rentalEnd"
                className="input input-bordered"
                type="time"
                required={true}
              />
            </div>
          </>
        )}
        <div className="form-control col-start-3 col-span-4">
          <label className="label">
            <span className="label-text">Street Name</span>
          </label>
          <input name="street" className="input input-bordered" required={true} />
        </div>
        <div className="form-control col-start-7 col-span-2">
          <label className="label">
            <span className="label-text">City</span>
          </label>
          <input name="city" className="input input-bordered" required={true} />
        </div>
        <div className="form-control col-start-9 col-span-1">
          <label className="label">
            <span className="label-text">State</span>
          </label>
          <select name="state" className="input input-bordered" required={true}>
            <option></option>
            {STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control col-start-10 col-span-1">
          <label className="label">
            <span className="label-text">Zip</span>
          </label>
          <input name="zipCode" className="input input-bordered" type="number" required={true} />
        </div>
        <div id="spacer" className="btn col-start-3 col-span-2 opacity-0" />
        <Link href="/wedding/venues">
          <button className="btn col-start-3 col-span-4" type="button">
            Go Back
          </button>
        </Link>
        <button className="btn btn-secondary col-start-7 col-span-4" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
