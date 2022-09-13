import { User, Wedding } from "@prisma/client";
import { GetServerSideProps } from "next";
import { prisma } from "../../common/prisma";
import format from "date-fns/format";
import { NextPageWithLayout } from "../_app";
import { ChangeEvent, ReactElement, useCallback, useState } from "react";
import WeddingLayout from "../../components/WeddingLayout";
import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import debounce from "lodash.debounce";
import { goToSignIn } from "../../util/auth-utils";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return goToSignIn();
  }

  const couple = await prisma.couple.findFirst({
    where: {
      users: {
        some: {
          email: session.user?.email,
        },
      },
    },
    select: {
      id: true,
      users: true,
      wedding: {
        select: {
          id: true,
          weddingDate: true,
          coupleId: true,
          plannedNumberOfGuests: true,
          plannedTotalCost: true,
        },
      },
    },
  });

  if (!couple) {
    return {
      redirect: {
        destination: "/couple",
        permanent: false,
      },
    };
  }

  const { wedding } = couple;

  if (!wedding) {
    return {
      props: {
        coupleId: couple.id,
      },
    };
  }

  return {
    props: {
      coupleId: couple.id,
      wedding: {
        ...wedding,
        weddingDate: wedding.weddingDate ? format(wedding.weddingDate, "yyyy-MM-dd") : null,
        users: couple.users,
      },
    },
  };
};

type Props = {
  coupleId: string;
  wedding?: Omit<Wedding, "weddingDate"> & {
    weddingDate: string | null;
    users: User[]
  }
};

const WeddingPage: NextPageWithLayout<Props> = ({ coupleId, wedding: weddingProp }) => {
  const [wedding, setWedding] = useState(weddingProp);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateWeddingState = useCallback((wedding: any) => {
    setWedding(prev => ({
      ...prev,
      ...wedding,
      weddingDate: wedding.weddingDate ? format(new Date(wedding.weddingDate), "yyyy-MM-dd") : null,
    }));
  }, []);

  const onCreateClick = useCallback(async () => {
    const { data: createdWedding } = await axios.post("/api/weddings", {
      coupleId,
    });
    updateWeddingState(createdWedding);
  }, [coupleId, updateWeddingState]);

  const onWeddingDateChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const { data: updatedWedding } = await axios.put("/api/weddings", {
      ...wedding,
      weddingDate: newDate,
    });
    updateWeddingState(updatedWedding);
  }, [wedding, updateWeddingState]);

  const onNumberOfGuestsChanged = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const newNumberOfGuests = +e.target.value;
    const { data: updatedWedding } = await axios.put("/api/weddings", {
      ...wedding,
      plannedNumberOfGuests: newNumberOfGuests,
    });
    updateWeddingState(updatedWedding);
  }, [wedding, updateWeddingState]);

  const onTotalCostChanged = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const newTotalCost = +e.target.value;
    const { data: updatedWedding } = await axios.put("/api/weddings", {
      ...wedding,
      plannedTotalCost: newTotalCost,
    });
    updateWeddingState(updatedWedding);
  }, [wedding, updateWeddingState]);

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
};

WeddingPage.getLayout = (page: ReactElement) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};

export default WeddingPage;
