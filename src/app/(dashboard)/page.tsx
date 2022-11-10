import ClientHomePage from "./home-page";
import { prisma } from "../../util/prisma";
import { dateToString } from "../../util/date-utils";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

async function getWedding(email?: string | null) {
  if (!email) return null;

  return await prisma.wedding.findFirstOrThrow({
    where: {
      couple: {
        users: {
          some: { email },
        },
      },
    },
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
}

export default async function ServerHomePage() {
  const session = await unstable_getServerSession(authOptions);
  const wedding = await getWedding(session?.user?.email);

  return (
    <main className="flex flex-1 h-full">
      <section className="bg-base-200 flex-1 p-4">
        <ClientHomePage
          wedding={
            wedding
              ? {
                  ...wedding,
                  weddingDate: dateToString(wedding.weddingDate),
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
              : null
          }
        />
      </section>
    </main>
  );
}
