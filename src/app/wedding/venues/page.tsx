import { prisma } from "../../../util/prisma";
import { dateToString } from "../../../util/date-utils";
import { customGetSession } from "../../../util/auth-utils";
import ClientVenuesPage from "./venue-page";
import { notFound } from "next/navigation";

async function getWedding(email?: string) {
  return await prisma.wedding.findFirst({
    where: { couple: { users: { some: { email } } } },
    select: {
      id: true,
      plannedNumberOfGuests: true,
      venues: true,
    },
  });
}

export default async function ServerVenuePage() {
  const session = await customGetSession();
  const wedding = await getWedding(session?.user?.email);

  if (!wedding) return notFound();

  return (
    <ClientVenuesPage
      wedding={{
        id: wedding.id,
        plannedNumberOfGuests: wedding.plannedNumberOfGuests,
      }}
      venues={wedding.venues.map((venue) => ({
        ...venue,
        rentalStart: dateToString(venue.rentalStart),
        rentalEnd: dateToString(venue.rentalEnd),
      }))}
    />
  );
}
