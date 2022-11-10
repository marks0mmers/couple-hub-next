import { prisma } from "../../../util/prisma";
import { notFound } from "next/navigation";
import ClientGuestsPage from "./guests-page";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

async function getWedding(email?: string | null) {
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
  const session = await unstable_getServerSession(authOptions);
  const wedding = await getWedding(session?.user?.email);

  if (!wedding) {
    notFound();
    return null;
  }

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
