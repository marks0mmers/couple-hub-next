import { WeddingGuest, WeddingGuestTier } from "@prisma/client";

export type WeddingGuestTierWithGuests = WeddingGuestTier & { weddingGuests: WeddingGuest[] };

type ReorderObject = {
  guestId: string;
  fromTierId: string;
  fromOrder: number;
  toTierId: string;
  toOrder: number;
};

export const reorderGuests = (
  prevModel: WeddingGuestTierWithGuests[],
  movedGuest: WeddingGuest,
  reorderObject: ReorderObject
): WeddingGuestTierWithGuests[] => {
  const { guestId, fromTierId, fromOrder, toTierId, toOrder } = reorderObject;
  const fromTier = prevModel.find((tier) => tier.id === fromTierId);
  if (!fromTier) {
    return prevModel;
  }
  if (fromTierId === toTierId) {
    // Same Column
    if (fromOrder < toOrder) {
      // Moved down
      const newModel = [
        ...prevModel.filter((tier) => tier.id !== fromTierId),
        {
          ...fromTier,
          weddingGuests: [
            ...fromTier.weddingGuests.filter(
              (guest) => guest.id !== guestId && (guest.order <= fromOrder || guest.order > toOrder)
            ),
            ...fromTier.weddingGuests
              .filter(
                (guest) => guest.id !== guestId && guest.order > fromOrder && guest.order <= toOrder
              )
              .map((guest) => ({
                ...guest,
                order: guest.order - 1,
              })),
            movedGuest,
          ].sort((a, b) => a.order - b.order),
        },
      ];

      return newModel.sort((a, b) => a.order - b.order);
    } else {
      // Moved up
      const newModel = [
        ...prevModel.filter((tier) => tier.id !== fromTierId),
        {
          ...fromTier,
          weddingGuests: [
            ...fromTier.weddingGuests.filter(
              (guest) => guest.id !== guestId && (guest.order < toOrder || guest.order >= fromOrder)
            ),
            ...fromTier.weddingGuests
              .filter(
                (guest) => guest.id !== guestId && guest.order >= toOrder && guest.order < fromOrder
              )
              .map((guest) => ({
                ...guest,
                order: guest.order + 1,
              })),
            movedGuest,
          ].sort((a, b) => a.order - b.order),
        },
      ];

      return newModel.sort((a, b) => a.order - b.order);
    }
  } else {
    const toTier = prevModel.find((tier) => tier.id === toTierId);
    if (!toTier) {
      return prevModel;
    }
    const newModel = [
      ...prevModel.filter((tier) => tier.id !== fromTierId && tier.id !== toTierId),
      {
        ...fromTier,
        weddingGuests: [
          ...fromTier.weddingGuests.filter(
            (guest) => guest.id !== guestId && guest.order < fromOrder
          ),
          ...fromTier.weddingGuests
            .filter((guest) => guest.id !== guestId && guest.order >= fromOrder)
            .map((guest) => ({
              ...guest,
              order: guest.order - 1,
            })),
        ].sort((a, b) => a.order - b.order),
      },
      {
        ...toTier,
        weddingGuests: [
          ...toTier.weddingGuests.filter((guest) => guest.id !== guestId && guest.order < toOrder),
          ...toTier.weddingGuests
            .filter((guest) => guest.id !== guestId && guest.order >= toOrder)
            .map((guest) => ({
              ...guest,
              order: guest.order + 1,
            })),
          movedGuest,
        ].sort((a, b) => a.order - b.order),
      },
    ];

    return newModel.sort((a, b) => a.order - b.order);
  }
};
