import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../common/prisma";
import parse from "date-fns/parse";
import subMinutes from "date-fns/subMinutes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (typeof req.query.weddingId !== "string") {
    return res.status(400).send({ message: "Wedding ID is Invalid" });
  }

  const rentalStart = req.body.rentalStart
    ? parse(req.body.rentalStart, "HH:mm", new Date())
    : null;
  const rentalEnd = req.body.rentalEnd ? parse(req.body.rentalEnd, "HH:mm", new Date()) : null;
  console.log(rentalStart, rentalEnd);

  const created = await prisma.weddingVenue.create({
    data: {
      ...req.body,
      capacity: Number(req.body.capacity),
      price: Number(req.body.price),
      zipCode: Number(req.body.zipCode),
      rentalStart: rentalStart ? subMinutes(rentalStart, rentalStart.getTimezoneOffset()) : null,
      rentalEnd: rentalEnd ? subMinutes(rentalEnd, rentalEnd.getTimezoneOffset()) : null,
      weddingId: req.query.weddingId,
    },
  });

  res.status(200).json(created);
}
