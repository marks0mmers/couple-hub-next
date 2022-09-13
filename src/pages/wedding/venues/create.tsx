import { NextPageWithLayout } from "../../_app";
import WeddingLayout from "../../../components/WeddingLayout";
import { WeddingVenuePriceType } from "@prisma/client";
import { useState } from "react";
import { STATES } from "../../../util/constants";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { prisma } from "../../../common/prisma";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  const result = await prisma.wedding.findFirst({
    where: {
      couple: {
        users: {
          some: {
            email: session?.user?.email,
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!result) {
    return {
      redirect: {
        destination: "/wedding",
        permanent: false,
      },
    };
  }

  return {
    props: {
      weddingId: result.id,
    },
  };
};

type Props = {
  weddingId: string;
}

const CreateWeddingVenue: NextPageWithLayout<Props> = ({ weddingId }) => {
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
          <input
            name="name"
            className="input input-bordered"
            required={true}
          />
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
              className={`btn ${priceType === WeddingVenuePriceType.FLAT_FEE ? "btn-active" : ""} no-animation`}
              onClick={() => setPriceType(WeddingVenuePriceType.FLAT_FEE)}
            >
              Flat Fee
            </button>
            <button
              type="button"
              className={`btn ${priceType === WeddingVenuePriceType.PER_HOUR ? "btn-active" : ""} no-animation`}
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
        <div className={`form-control col-start-5 col-span-${priceType === WeddingVenuePriceType.PER_HOUR ? 2 : 6}`}>
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
        { priceType === WeddingVenuePriceType.PER_HOUR &&
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
        }
        <div className="form-control col-start-3 col-span-4">
          <label className="label">
            <span className="label-text">Street Name</span>
          </label>
          <input
            name="street"
            className="input input-bordered"
            required={true}
          />
        </div>
        <div className="form-control col-start-7 col-span-2">
          <label className="label">
            <span className="label-text">City</span>
          </label>
          <input
            name="city"
            className="input input-bordered"
            required={true}
          />
        </div>
        <div className="form-control col-start-9 col-span-1">
          <label className="label">
            <span className="label-text">State</span>
          </label>
          <select
            name="state"
            className="input input-bordered"
            required={true}
          >
            <option></option>
            {STATES.map(state => <option key={state} value={state}>{state}</option> )}
          </select>
        </div>
        <div className="form-control col-start-10 col-span-1">
          <label className="label">
            <span className="label-text">Zip</span>
          </label>
          <input
            name="zipCode"
            className="input input-bordered"
            type="number"
            required={true}
          />
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
};

CreateWeddingVenue.getLayout = (page) => {
  return (
    <WeddingLayout>
      {page}
    </WeddingLayout>
  );
};

export default CreateWeddingVenue;
