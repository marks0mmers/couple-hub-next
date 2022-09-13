import { NextPageWithLayout, useTheme } from "../../_app";
import { useCallback, useMemo, Suspense } from "react";
import WeddingLayout from "../../../components/WeddingLayout";
import { GetServerSideProps } from "next";
import { goToSignIn } from "../../../util/auth-utils";
import { prisma } from "../../../common/prisma";
import { WeddingVenue, WeddingVenuePriceType } from "@prisma/client";
import format from "date-fns/format";
import addMinutes from "date-fns/addMinutes";
import parse from "date-fns/parse";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { PlusIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import type { Theme } from "@nivo/core";
import Link from "next/link";

const ResponsiveBar = dynamic(
  () => import("../../../util/charts/responsive-bar"),
  { suspense: true }
);

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
      wedding: {
        select: {
          id: true,
          plannedNumberOfGuests: true,
          venues: true,
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

  if (!couple.wedding) {
    return {
      redirect: {
        destination: "/wedding",
        permanent: false,
      },
    };
  }

  return {
    props: {
      wedding: {
        id: couple.wedding.id,
        plannedNumberOfGuests: couple.wedding.plannedNumberOfGuests,
      },
      venues: couple.wedding.venues.map(venue => ({
        ...venue,
        rentalStart: venue.rentalStart
          ? format(addMinutes(venue.rentalStart, venue.rentalStart.getTimezoneOffset()), "hh:mm a")
          : null,
        rentalEnd: venue.rentalEnd
          ? format(addMinutes(venue.rentalEnd, venue.rentalEnd.getTimezoneOffset()), "hh:mm a")
          : null,
      })),
    },
  };
};

type Props = {
  wedding: {
    id: string;
    plannedNumberOfGuests: number;
  }
  venues: Array<Omit<WeddingVenue, "rentalStart" | "rentalEnd"> & {
    rentalStart: string | null;
    rentalEnd: string | null;
  }>;
}

const Venues: NextPageWithLayout<Props> = ({ wedding, venues }) => {
  const [themeString] = useTheme();

  const theme = useMemo(() => {
    if (typeof document !== "undefined") {
      const root = document.querySelector(":root");
      if (root) {
        const styles = getComputedStyle(root);
        const theme = new Map<string, string>();
        ["--a", "--bc", "--su", "--er"].map(cssVar => {
          theme.set(cssVar, `hsl(${styles.getPropertyValue(cssVar)})`);
        });
        return theme;
      }
    }
    return new Map<string, string>();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeString]);

  const barChartTheme: Theme = useMemo(() => ({
    axis: {
      ticks: {
        text: {
          fill: theme.get("--bc"),
        },
      },
    },
  }), [theme]);

  const getTotalPrice = useCallback(
    (
      { price, rentalStart, rentalEnd }: { price: number, rentalStart: string | null, rentalEnd: string | null}
    ) =>
      (price / 60 / 60) * differenceInSeconds(
        parse(rentalEnd ?? "", "h:mm a", new Date()),
        parse(rentalStart ?? "", "h:mm a", new Date())
      ),
    []
  );

  const priceChartData = useMemo(() => {
    return venues.map(venue => ({
      label: venue.name,
      price: venue.priceType === WeddingVenuePriceType.PER_HOUR ? getTotalPrice(venue) : venue.price,
      color: theme.get("--a") ?? "",
    }));
  }, [venues, getTotalPrice, theme]);

  const capacityChartData = useMemo(() => {
    return venues.map(venue => ({
      label: venue.name,
      capacity: venue.capacity,
      plannedCapacity: wedding.plannedNumberOfGuests,
      color: (venue.capacity < wedding.plannedNumberOfGuests ? theme.get("--er") : theme.get("--su")) ?? "",
    }));
  }, [venues, wedding, theme]);

  return (
    <div id="venues" className="p-4 flex-1 flex flex-col gap-2">
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
            {venues.map(venue => (
              <tr key={venue.id}>
                <td>{venue.name}</td>
                <td>{venue.capacity}</td>
                <td>{
                  venue.priceType === WeddingVenuePriceType.PER_HOUR
                    ? `$${venue.price.toFixed(2)}/hr`
                    : `$${venue.price.toFixed(2)}`
                }</td>
                <td>{venue.rentalStart ?? ""}</td>
                <td>{venue.rentalEnd ?? ""}</td>
                <td>{
                  venue.priceType === WeddingVenuePriceType.PER_HOUR
                    ? `$${getTotalPrice(venue).toFixed(2)}`
                    : `$${venue.price.toFixed(2)}`
                }</td>
                <td>{`${venue.street}, ${venue.city}, ${venue.state} ${venue.zipCode}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex-1 flex">
        <Suspense fallback="Charts Loading...">
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
        </Suspense>

      </div>
    </div>

  );
};

Venues.getLayout = (page) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};

export default Venues;
