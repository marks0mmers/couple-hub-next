/* eslint-disable @typescript-eslint/ban-types */
"use client";

import { Wedding, WeddingBudgetItem, WeddingVenue } from "@prisma/client";
import { WeddingGuestTierWithGuests } from "../util/guests-functions";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import parse from "date-fns/parse";
import { BanknotesIcon, CalendarDaysIcon, UserIcon } from "@heroicons/react/24/solid";

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

export default function ClientHomePage({ wedding }: Props) {
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
  );
}
