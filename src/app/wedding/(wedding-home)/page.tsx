import { prisma } from "../../../util/prisma";
import { dateToString } from "../../../util/date-utils";
import ClientWeddingPage from "./wedding-page";
import { notFound } from "next/navigation";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

async function getCoupleId(email?: string | null) {
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
  const session = await unstable_getServerSession(authOptions);
  const coupleId = await getCoupleId(session?.user?.email);

  if (!coupleId) {
    notFound();
    return null;
  }

  const wedding = await getWedding(coupleId);

  if (!wedding) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        <article className="prose max-w-none">
          <h3 className="text-center">Click to start planning your wedding!</h3>
        </article>
        <ClientWeddingPage coupleId={coupleId} />
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4">
      <ClientWeddingPage
        coupleId={coupleId}
        wedding={{
          ...wedding,
          weddingDate: dateToString(wedding.weddingDate),
          users: wedding.couple.users,
        }}
      />
    </div>
  );
}
