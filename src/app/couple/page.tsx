import ClientCouplePage from "./couple-page";
import { prisma } from "../../util/prisma";
import format from "date-fns/format";
import { customGetSession } from "../../util/auth-utils";

async function getCouple(email?: string) {
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
  const session = await customGetSession();
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
            relationshipStart: couple.relationshipStart
              ? format(couple.relationshipStart, "yyyy-MM-dd")
              : null,
          }}
        />
      </div>
    </main>
  );
}
