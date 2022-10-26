import { prisma } from "../../util/prisma";
import { dateToString } from "../../util/date-utils";
import ClientWeddingPage from "./wedding-page";
import { customGetSession } from "../../util/auth-utils";
import { notFound } from "next/navigation";

async function getCoupleId(email?: string) {
  const res = await prisma.couple.findFirst({
    where: { users: { some: { email } } },
    select: { id: true },
  });
  return res?.id;
}

async function getWedding(coupleId: string) {
  return await prisma.wedding.findFirst({
    where: { coupleId },
    select: {
      id: true,
      weddingDate: true,
      plannedTotalCost: true,
      plannedNumberOfGuests: true,
      coupleId: true,
      couple: {
        select: { users: true },
      },
    },
  });
}

export default async function WeddingPage() {
  const session = await customGetSession();
  const coupleId = await getCoupleId(session?.user?.email);

  if (!coupleId) return notFound();

  const wedding = await getWedding(coupleId);

  if (!wedding) return <ClientWeddingPage coupleId={coupleId} />;

  return (
    <ClientWeddingPage
      coupleId={coupleId}
      wedding={{
        ...wedding,
        weddingDate: dateToString(wedding.weddingDate),
        users: wedding.couple.users,
      }}
    />
  );
}
