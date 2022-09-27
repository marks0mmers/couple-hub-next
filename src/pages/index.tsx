/* eslint-disable @typescript-eslint/ban-types */
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getCoupleId } from "../common/get-couple-id";
import { prisma } from "../common/prisma";
import format from "date-fns/format";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import parse from "date-fns/parse";
import { BanknotesIcon, CalendarDaysIcon, UserIcon } from "@heroicons/react/24/solid";
import { Wedding, WeddingBudgetItem, WeddingVenue } from "@prisma/client";
import { WeddingGuestTierWithGuests } from "../util/guests-functions";
import { dateToString } from "../util/date-utils";

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const { coupleId, redirect } = await getCoupleId(req, res);

  if (redirect) {
    return {
      redirect: {
        destination: redirect,
        permanent: false,
      },
    };
  }

  const wedding = await prisma.wedding.findFirst({
    where: { coupleId },
    include: {
      venues: true,
      guestTiers: {
        include: {
          weddingGuests: true,
        },
      },
      budgetItems: true,
    },
  });

  return {
    props: {
      wedding: wedding
        ? {
            ...wedding,
            weddingDate: wedding.weddingDate ? format(wedding.weddingDate, "yyyy-MM-dd") : null,
            venues: wedding.venues.map((venue) => ({
              ...venue,
              rentalStart: dateToString(venue.rentalStart),
              rentalEnd: dateToString(venue.rentalEnd),
            })),
            budgetItems: wedding.budgetItems.map((item) => ({
              ...item,
              dueDate: dateToString(item.dueDate),
            })),
          }
        : null,
    },
  };
};

type Venue = Omit<WeddingVenue, "rentalStart" | "rentalEnd"> & {
  rentalStart: string | null;
  rentalEnd: string | null;
};

type Budget = Omit<WeddingBudgetItem, "dueDate"> & {
  dueDate: string | null;
};

type Props = {
  wedding:
    | (Omit<Wedding, "weddingDate"> & {
        weddingDate: string | null;
        venues: Venue[];
        guestTiers: WeddingGuestTierWithGuests[];
        budgetItems: Budget[];
      })
    | null;
};

export default function Home({ wedding }: Props) {
  const daysUntilWedding = useMemo(() => {
    if (!wedding?.weddingDate) {
      return "-";
    }
    const today = new Date();
    return differenceInDays(parse(wedding.weddingDate, "yyyy-MM-dd", new Date()), today).toString();
  }, [wedding]);

  const weddingGuestsAdded = useMemo(() => {
    if (!wedding) return "-";
    const guestsAdded = wedding.guestTiers
      .map((tier) => tier.weddingGuests.length)
      .reduce((sum, val) => sum + val, 0);
    return ((guestsAdded / wedding.plannedNumberOfGuests) * 100).toFixed(0);
  }, [wedding]);

  const weddingBudgetPlanned = useMemo(() => {
    if (!wedding) return "-";
    const totalPlanned = wedding.budgetItems.reduce((total, val) => total + val.goalAmount, 0);

    return ((totalPlanned / wedding.plannedTotalCost) * 100).toFixed(0);
  }, [wedding]);

  return (
    <main className="flex h-full">
      <Head>
        <title>Couple Planner</title>
      </Head>
      <section className="bg-base-200 flex-1 p-4">
        <div id="wedding-stats" className="stats">
          <div className="stat">
            <div className="stat-figure">
              <CalendarDaysIcon className="w-8 h-8 text-error" />
            </div>
            <div className="stat-title">Days until Wedding</div>
            <div className="stat-value">{daysUntilWedding}</div>
          </div>
          <div className="stat">
            <div className="stat-figure">
              <div
                className="radial-progress text-secondary"
                style={{ "--value": weddingGuestsAdded } as {}}
              >
                <UserIcon className="w-8 h-8 text-secondary" />
              </div>
            </div>
            <div className="stat-title">Guests Added</div>
            <div className="stat-value">{weddingGuestsAdded}%</div>
          </div>
          <div className="stat">
            <div className="stat-figure">
              <div
                className="radial-progress text-success"
                style={{ "--value": weddingBudgetPlanned } as {}}
              >
                <BanknotesIcon className="w-8 h-8 text-success" />
              </div>
            </div>
            <div className="stat-title">Budget Planned</div>
            <div className="stat-value">{weddingBudgetPlanned}%</div>
          </div>
        </div>
      </section>
    </main>
  );
}
