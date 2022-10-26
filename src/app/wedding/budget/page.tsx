import { prisma } from "../../../util/prisma";
import { dateToString } from "../../../util/date-utils";
import { customGetSession } from "../../../util/auth-utils";
import ClientWeddingBudgetPage from "./budget-page";
import { notFound } from "next/navigation";

async function getWedding(email?: string) {
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
  const session = await customGetSession();
  const wedding = await getWedding(session?.user?.email);

  if (!wedding) return notFound();

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
