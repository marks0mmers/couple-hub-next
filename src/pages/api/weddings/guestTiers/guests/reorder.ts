import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../../common/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.status(405).send("Invalid Method");
  }
  const {
    guestId,
    fromTierId,
    fromOrder,
    toTierId,
    toOrder,
  } = req.body;

  const fromTier = await prisma.weddingGuestTier.findFirst({
    where: { id: fromTierId },
    include: { weddingGuests: true },
  });

  if (!fromTier) {
    res.status(404).send("Cannot find the fromTier");
    return;
  }

  if (fromTierId === toTierId) {
    // Same Column
    if (fromOrder < toOrder) {
      // Moving down
      const guestsToMove = fromTier.weddingGuests
        .filter(guest => guest.id !== guestId && guest.order > fromOrder && guest.order <= toOrder)
        .map(guest => [guest.id, guest.order] as const);
      await Promise.all(guestsToMove.map(([id, order]) => prisma.weddingGuest.update({
        where: { id },
        data: { order: order - 1 },
      })));
      const moved = await prisma.weddingGuest.update({
        where: { id: guestId },
        data: {
          order: toOrder,
        },
      });
      res.status(200).json(moved);
    } else {
      // Moving Up
      const guestsToMove = fromTier.weddingGuests
        .filter(guest => guest.id !== guestId && guest.order >= toOrder && guest.order < fromOrder)
        .map(guest => [guest.id, guest.order] as const);
      await Promise.all(guestsToMove.map(([id, order]) => prisma.weddingGuest.update({
        where: { id },
        data: { order: order + 1 },
      })));
      const moved = await prisma.weddingGuest.update({
        where: { id: guestId },
        data: {
          order: toOrder,
        },
      });
      res.status(200).json(moved);
    }
  } else {
    const toTier = await prisma.weddingGuestTier.findFirst({
      where: { id: toTierId },
      include: { weddingGuests: true },
    });

    if (!toTier) {
      res.status(404).send("Cannot find toTier");
      return;
    }

    const fromGuestsToMove = fromTier.weddingGuests
      .filter(guest => guest.id !== guestId && guest.order > fromOrder)
      .map(guest => [guest.id, guest.order] as const);

    const toGuestsToMove = toTier.weddingGuests
      .filter(guest => guest.id !== guestId && guest.order >= toOrder)
      .map(guest => [guest.id, guest.order] as const);

    await Promise.all([
      ...fromGuestsToMove.map(([id, order]) => prisma.weddingGuest.update({
        where: { id },
        data: { order: order - 1 },
      })),
      ...toGuestsToMove.map(([id, order]) => prisma.weddingGuest.update({
        where: { id },
        data: { order: order + 1 },
      })),
    ]);
    const moved = await prisma.weddingGuest.update({
      where: { id: guestId },
      data: {
        weddingGuestTierId: toTierId,
        order: toOrder,
      },
    });
    res.status(200).json(moved);
  }
}
