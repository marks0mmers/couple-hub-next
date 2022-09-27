import { ReactElement, useCallback, useEffect, useState } from "react";
import WeddingLayout from "../../components/WeddingLayout";
import { WeddingGuest } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getCoupleId } from "../../common/get-couple-id";
import { prisma } from "../../common/prisma";
import { DragDropContext, Droppable, DropResult, resetServerContext } from "@hello-pangea/dnd";
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import GuestColumn from "../../components/wedding/guests/guest-column";
import { reorderGuests, WeddingGuestTierWithGuests } from "../../util/guests-functions";

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const { coupleId, redirect } = await getCoupleId(req, res);

  if (redirect) {
    return {
      redirect: {
        destination: redirect,
        permanent: false,
      },
    };
  }

  const wedding = await prisma.wedding.findFirst({
    where: { coupleId },
    select: {
      id: true,
      plannedNumberOfGuests: true,
      guestTiers: {
        include: {
          weddingGuests: true,
        },
      },
    },
  });

  if (!wedding) {
    return {
      redirect: {
        destination: "/wedding",
        permanent: false,
      },
    };
  }

  resetServerContext();

  return {
    props: {
      wedding: {
        id: wedding.id,
        plannedNumberOfGuests: wedding.plannedNumberOfGuests,
      },
      tiers: wedding.guestTiers.map(tier => ({
        ...tier,
        weddingGuests: tier.weddingGuests.sort((a, b) => a.order - b.order),
      })),
    },
  };
};

type Props = {
  wedding: {
    id: string;
    plannedNumberOfGuests: number;
  };
  tiers: WeddingGuestTierWithGuests[]
}

export default function Guests({ wedding, tiers }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [newGuestTierName, setNewGuestTierName] = useState("");

  const [visualGuestTierModel, setVisualGuestTierModel] = useState(tiers);

  useEffect(() => {
    setIsBrowser(typeof window !== "undefined");
  }, []);

  const handleDragEnd = useCallback(async (result: DropResult) => {
    if (result.destination) {
      if (result.type === "GUEST") {
        const reorderObject = {
          guestId: result.draggableId,
          fromTierId: result.source.droppableId,
          fromOrder: result.source.index + 1,
          toTierId: result.destination.droppableId,
          toOrder: result.destination.index + 1,
        };
        const { data: moved } = await axios.put<WeddingGuest>("/api/weddings/guestTiers/guests/reorder", reorderObject);
        setVisualGuestTierModel(prevModel => {
          return reorderGuests(prevModel, moved, reorderObject);
        });
      }
    }
  }, []);

  const handleCreateGuestListTier = useCallback(async () => {
    if (newGuestTierName) {
      const { data: createdTier } = await axios.post<WeddingGuestTierWithGuests>(`/api/weddings/guestTiers?weddingId=${wedding.id}`, {
        name: newGuestTierName,
      });
      setVisualGuestTierModel(prevModel => {
        const newModel = [
          ...prevModel.map(tier => ({
            ...tier,
            weddingGuests: tier.weddingGuests.sort((a, b) => a.order - b.order),
          })),
          createdTier,
        ];
        return newModel.sort((a, b) => a.order - b.order);
      });
      console.log(createdTier);
      setIsCreating(false);
      setNewGuestTierName("");
    }
  }, [wedding.id, newGuestTierName]);

  const handleCreateGuest = useCallback((guest: WeddingGuest) => {
    setVisualGuestTierModel(prevModel => {
      const updatedTier = prevModel.find(tier => tier.id === guest.weddingGuestTierId);
      if (!updatedTier) {
        return prevModel;
      }
      const newModel = [
        ...prevModel.filter(tier => tier.id !== guest.weddingGuestTierId),
        {
          ...updatedTier,
          weddingGuests: [
            ...updatedTier.weddingGuests,
            guest,
          ].sort((a, b) => a.order - b.order),
        },
      ];
      return newModel.sort((a, b) => a.order - b.order);
    });
  }, []);

  return isBrowser ? (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable
        droppableId="board"
        type="TIER"
        direction="horizontal"
      >
        {boardDropContext => (
          <div
            id="guest-list-container"
            className="flex-1 flex p-4 gap-4 items-center overflow-hidden"
            {...boardDropContext.droppableProps}
            ref={boardDropContext.innerRef}
          >
            {visualGuestTierModel.map((tier, index) => (
              <GuestColumn
                key={tier.id}
                tier={tier}
                index={index}
                onGuestCreated={handleCreateGuest}
              />
            ))}
            {boardDropContext.placeholder}
            {isCreating &&
              <ul className="menu rounded-box p-2 flex-1 bg-base-200 h-full">
                <li className="menu-title flex flex-row">
                  <input
                    className="input input-xs flex-1"
                    autoFocus={true}
                    value={newGuestTierName}
                    onChange={e => setNewGuestTierName(e.target.value)}
                    onBlur={handleCreateGuestListTier}
                    onKeyUp={async e => {
                      if (e.key === "Enter") {
                        await handleCreateGuestListTier();
                      }
                    }}
                  />
                  <button
                    className="btn btn-xs bg-transparent border-none hover:bg-transparent"
                    onClick={() => {
                      setIsCreating(false);
                      setNewGuestTierName("");
                    }}
                  >
                    <XMarkIcon className="w-4 h-4 text-base-content"/>
                  </button>
                </li>
              </ul>
            }
            <button
              className="btn h-full bg-base-200 border-none hover:bg-base-300"
              onClick={() => setIsCreating(true)}
            >
              <PlusIcon className="w-4 h-4 text-base-content"/>
            </button>
            {tiers.length === 0 &&
              <>
                <ArrowLeftIcon className="h-10 w-10"/>
                <article className="prose flex items-center">
                  <h2>Click to add a Guest List Tier</h2>
                </article>
              </>
            }
          </div>
        )}
      </Droppable>
    </DragDropContext>) : null;
}

Guests.getLayout = (page: ReactElement) => {
  return (
    <WeddingLayout>
      <>{page}</>
    </WeddingLayout>
  );
};
