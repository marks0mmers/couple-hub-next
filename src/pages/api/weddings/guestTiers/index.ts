import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../common/prisma";

const handlePost: NextApiHandler = async (req, res) => {
  const weddingId = req.query.weddingId;
  if (typeof weddingId !== "string") {
    res.status(400).send("Invalid Wedding ID");
    return;
  }
  const existingTiersCount = await prisma.weddingGuestTier.count({ where: { weddingId } });
  const created = await prisma.weddingGuestTier.create({
    data: {
      weddingId,
      name: req.body.name,
      order: existingTiersCount + 1,
    },
    include: { weddingGuests: true },
  });
  res.status(201).json(created);
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      await handlePost(req, res);
      return;
    default:
      res.status(405).send("Method not supported");
      return;
  }
}

export default handler;
