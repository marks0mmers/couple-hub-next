import { prisma } from "../../../util/prisma";
import { dateToString } from "../../../util/date-utils";
import ClientVenuesPage from "./venue-page";
import { notFound } from "next/navigation";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

async function getWedding(email?: string | null) {
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
  const session = await unstable_getServerSession(authOptions);
  const wedding = await getWedding(session?.user?.email);

  if (!wedding) {
    notFound();
    return null;
  }

  return (
    <div id="venues" className="p-4 flex-1 flex flex-col">
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
    </div>
  );
}
