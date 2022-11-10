import { prisma } from "../../../util/prisma";
import { dateToString } from "../../../util/date-utils";
import ClientWeddingBudgetPage from "./budget-page";
import { notFound } from "next/navigation";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

async function getWedding(email?: string | null) {
  return await prisma.wedding.findFirst({
    where: { couple: { users: { some: { email } } } },
    select: {
      id: true,
      plannedTotalCost: true,
      budgetItems: true,
    },
  });
}

export default async function ServerWeddingBudgetPage() {
  const session = await unstable_getServerSession(authOptions);
  const wedding = await getWedding(session?.user?.email);

  if (!wedding) {
    notFound();
    return null;
  }

  return (
    <ClientWeddingBudgetPage
      wedding={{
        id: wedding.id,
        plannedTotalCost: wedding.plannedTotalCost,
      }}
      budgetItems={wedding.budgetItems.map((item) => ({
        ...item,
        dueDate: dateToString(item.dueDate),
      }))}
    />
  );
}
