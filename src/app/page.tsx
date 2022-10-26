import ClientHomePage from "./home-page";
import { prisma } from "../util/prisma";
import { dateToString } from "../util/date-utils";
import { customGetSession } from "../util/auth-utils";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getWedding(email?: string) {
  await sleep(5000);
  return await prisma.wedding.findFirst({
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
  const session = await customGetSession();
  const wedding = await getWedding(session?.user.email);
  console.log("Server Home Page");
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
