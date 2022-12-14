"use client";

import { useCallback, useMemo } from "react";
import { WeddingVenue, WeddingVenuePriceType } from "@prisma/client";
import parse from "date-fns/parse";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { PlusIcon } from "@heroicons/react/24/solid";
import type { Theme } from "@nivo/core";
import Link from "next/link";
import { useTheme } from "../../(contexts)/theme-context";
import ResponsiveBar from "../../../util/charts/responsive-bar";

type Props = {
  wedding: {
    id: string;
    plannedNumberOfGuests: number;
  };
  venues: Array<
    Omit<WeddingVenue, "rentalStart" | "rentalEnd"> & {
      rentalStart: string | null;
      rentalEnd: string | null;
    }
  >;
};

export default function ClientVenuesPage({ wedding, venues }: Props) {
  const [themeString] = useTheme();

  const theme = useMemo(() => {
    if (typeof document !== "undefined") {
      const root = document.querySelector(":root");
      if (root) {
        const styles = getComputedStyle(root);
        const theme = new Map<string, string>();
        ["--a", "--bc", "--su", "--er"].map((cssVar) => {
          theme.set(cssVar, `hsl(${styles.getPropertyValue(cssVar)})`);
        });
        return theme;
      }
    }
    return new Map<string, string>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeString]);

  const barChartTheme: Theme = useMemo(
    () => ({
      axis: {
        ticks: {
          text: {
            fill: theme.get("--bc"),
          },
        },
      },
    }),
    [theme]
  );

  const getTotalPrice = useCallback(
    ({
      price,
      rentalStart,
      rentalEnd,
    }: {
      price: number;
      rentalStart: string | null;
      rentalEnd: string | null;
    }) =>
      (price / 60 / 60) *
      differenceInSeconds(
        parse(rentalEnd ?? "", "h:mm a", new Date()),
        parse(rentalStart ?? "", "h:mm a", new Date())
      ),
    []
  );

  const priceChartData = useMemo(() => {
    return venues.map((venue) => ({
      label: venue.name,
      price:
        venue.priceType === WeddingVenuePriceType.PER_HOUR ? getTotalPrice(venue) : venue.price,
      color: theme.get("--a") ?? "",
    }));
  }, [venues, getTotalPrice, theme]);

  const capacityChartData = useMemo(() => {
    return venues.map((venue) => ({
      label: venue.name,
      capacity: venue.capacity,
      plannedCapacity: wedding.plannedNumberOfGuests,
      color:
        (venue.capacity < wedding.plannedNumberOfGuests ? theme.get("--er") : theme.get("--su")) ??
        "",
    }));
  }, [venues, wedding, theme]);

  return (
    <>
      <div className="flex justify-between">
        <article className="prose">
          <h3>Venue Options</h3>
        </article>
        <Link href="/wedding/venues/create">
          <button className="btn btn-secondary gap-2">
            <PlusIcon className="w-6 h-6" />
            Add Venue
          </button>
        </Link>
      </div>
      <div className="divider" />
      <div className="overflow-x-auto flex-1">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Price</th>
              <th>Rental Start</th>
              <th>Rental End</th>
              <th>Total</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <tr key={venue.id}>
                <td>{venue.name}</td>
                <td>{venue.capacity}</td>
                <td>
                  {venue.priceType === WeddingVenuePriceType.PER_HOUR
                    ? `$${venue.price.toFixed(2)}/hr`
                    : `$${venue.price.toFixed(2)}`}
                </td>
                <td>{venue.rentalStart ?? ""}</td>
                <td>{venue.rentalEnd ?? ""}</td>
                <td>
                  {venue.priceType === WeddingVenuePriceType.PER_HOUR
                    ? `$${getTotalPrice(venue).toFixed(2)}`
                    : `$${venue.price.toFixed(2)}`}
                </td>
                <td>{`${venue.street}, ${venue.city}, ${venue.state} ${venue.zipCode}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divider" />
      <div className="flex-1 flex">
        <ResponsiveBar
          theme={barChartTheme}
          data={priceChartData}
          colors={({ data }) => data.color.toString()}
          indexBy="label"
          keys={["price"]}
          valueFormat={(value) => {
            const format = Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "usd",
            });
            return format.format(value);
          }}
          margin={{ top: 20, bottom: 20, left: 50 }}
          enableLabel={false}
        />
        <ResponsiveBar
          theme={barChartTheme}
          data={capacityChartData}
          colors={({ data }) => data.color.toString()}
          indexBy="label"
          keys={["capacity"]}
          margin={{ top: 20, bottom: 20, left: 50 }}
          enableLabel={false}
          markers={[
            {
              axis: "y",
              value: wedding.plannedNumberOfGuests,
              lineStyle: { strokeDasharray: "3 3" },
            },
          ]}
        />
      </div>
    </>
  );
}
