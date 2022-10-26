import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../util/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  const { weddingId } = req.query;

  if (typeof weddingId !== "string") {
    res.status(400).send("Invalid Wedding ID");
    return;
  }

  const [year, month, date] = req.body.dueDate.split("-");
  const dueDate = new Date(year, month - 1, date);

  await prisma.weddingBudgetItem.upsert({
    where: { id: id ?? "" },
    create: {
      weddingId,
      name: req.body.name,
      goalAmount: +req.body.goalAmount,
      actualAmount: +req.body.actualAmount,
      actualPaid: +req.body.actualPaid,
      dueDate: dueDate,
    },
    update: {
      name: req.body.name,
      goalAmount: +req.body.goalAmount,
      actualAmount: +req.body.actualAmount,
      actualPaid: +req.body.actualPaid,
      dueDate: dueDate,
    },
  });

  res.redirect("/wedding/budget");
}
