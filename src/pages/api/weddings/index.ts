import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../util/prisma";

const handlePost: NextApiHandler = async (req, res) => {
  const { coupleId } = req.body;
  const wedding = await prisma.wedding.create({
    data: { coupleId },
  });
  res.status(201).json(wedding);
};

const handlePut: NextApiHandler = async (req, res) => {
  const [year, month, date] = req.body.weddingDate.split("-");
  const weddingDate = new Date(year, month - 1, date);
  const updated = await prisma.wedding.update({
    where: { id: req.body.id },
    data: {
      weddingDate,
      plannedNumberOfGuests: req.body.plannedNumberOfGuests,
      plannedTotalCost: req.body.plannedTotalCost,
    },
  });
  res.status(200).json(updated);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      await handlePost(req, res);
      return;
    case "PUT":
      await handlePut(req, res);
      return;
    default:
      res.status(405).send({ message: "Unsupported method" });
      return;
  }
}
