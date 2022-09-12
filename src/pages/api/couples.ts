import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../common/prisma";
import setHours from "date-fns/setHours";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const relationshipStart = new Date(req.body.relationshipStart);

  const couple = await prisma.couple.update({
    where: {
      id: req.body.id,
    },
    data: {
      relationshipStart: setHours(relationshipStart, 12),
      coupleType: req.body.coupleType,
    },
    include: {
      users: true,
    },
  });

  return res.status(200).json(couple);
};

export default handler;
