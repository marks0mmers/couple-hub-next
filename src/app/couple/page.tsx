import ClientCouplePage from "./couple-page";
import { prisma } from "../../util/prisma";
import { dateToString } from "../../util/date-utils";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

async function getCouple(email?: string | null) {
  return await prisma.couple.findFirst({
    include: { users: true },
    where: {
      users: {
        some: {
          email,
        },
      },
    },
  });
}

export default async function ServerCouplePage() {
  const session = await unstable_getServerSession(authOptions);
  const couple = await getCouple(session?.user?.email);

  if (!couple) {
    return <ClientCouplePage couple={null} />;
  }

  return (
    <main id="couple-page" className="flex-1 p-4 bg-base-200">
      <div className="flex justify-around">
        <ClientCouplePage
          couple={{
            ...couple,
            relationshipStart: dateToString(couple.relationshipStart),
          }}
        />
      </div>
    </main>
  );
}
