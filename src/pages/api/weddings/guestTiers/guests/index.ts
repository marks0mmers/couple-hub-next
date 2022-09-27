import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../common/prisma";

const handlePost: NextApiHandler = async (req, res) => {
  const weddingGuestTierId = req.query.tierId;

  if (typeof weddingGuestTierId !== "string") {
    res.status(400).send("Invalid Tier ID");
    return;
  }

  const existingTierCount = await prisma.weddingGuest.count({ where: { weddingGuestTierId } });

  const created = await prisma.weddingGuest.create({
    data: {
      name: req.body.name,
      weddingGuestTierId,
      order: existingTierCount + 1,
    },
  });

  res.status(201).json(created);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
  case "POST":
    await handlePost(req, res);
    return;
  default:
    res.status(405).send("Invalid request method");
    return;
  }
}
