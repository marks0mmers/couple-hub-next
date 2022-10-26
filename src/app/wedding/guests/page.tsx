import { prisma } from "../../../util/prisma";
import { customGetSession } from "../../../util/auth-utils";
import { notFound } from "next/navigation";
import ClientGuestsPage from "./guests-page";

async function getWedding(email?: string) {
  return await prisma.wedding.findFirst({
    where: { couple: { users: { some: { email } } } },
    select: {
      id: true,
      plannedNumberOfGuests: true,
      guestTiers: {
        include: {
          weddingGuests: true,
        },
      },
    },
  });
}

export default async function ServerGuestPage() {
  const session = await customGetSession();
  const wedding = await getWedding(session?.user?.email);

  if (!wedding) return notFound();

  return (
    <ClientGuestsPage
      wedding={{
        id: wedding.id,
        plannedNumberOfGuests: wedding.plannedNumberOfGuests,
      }}
      tiers={wedding.guestTiers.map((tier) => ({
        ...tier,
        weddingGuests: tier.weddingGuests.sort((a, b) => a.order - b.order),
      }))}
    />
  );
}
