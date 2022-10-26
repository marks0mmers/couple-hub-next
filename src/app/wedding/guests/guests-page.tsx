"use client";

import { useCallback, useState } from "react";
import { WeddingGuest } from "@prisma/client";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import GuestColumn from "./guest-column";
import { reorderGuests, WeddingGuestTierWithGuests } from "../../../util/guests-functions";

type Props = {
  wedding: {
    id: string;
    plannedNumberOfGuests: number;
  };
  tiers: WeddingGuestTierWithGuests[];
};

export default function ClientGuestsPage({ wedding, tiers }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [newGuestTierName, setNewGuestTierName] = useState("");

  const [visualGuestTierModel, setVisualGuestTierModel] = useState(tiers);

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

        const url = "/api/weddings/guestTiers/guests/reorder";
        const options = {
          method: "PUT",
          body: JSON.stringify(reorderObject),
          headers: {
            "Content-Type": "application/json",
          },
        };

        const res = await fetch(url, options);
        const moved: WeddingGuest = await res.json();

        setVisualGuestTierModel((prevModel) => {
          return reorderGuests(prevModel, moved, reorderObject);
        });
      }
    }
  }, []);

  const handleCreateGuestListTier = useCallback(async () => {
    if (newGuestTierName) {
      const url = `/api/weddings/guestTiers?weddingId=${wedding.id}`;
      const options = {
        method: "POST",
        body: JSON.stringify({
          name: newGuestTierName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await fetch(url, options);
      const createdTier: WeddingGuestTierWithGuests = await res.json();

      setVisualGuestTierModel((prevModel) => {
        const newModel = [
          ...prevModel.map((tier) => ({
            ...tier,
            weddingGuests: tier.weddingGuests.sort((a, b) => a.order - b.order),
          })),
          createdTier,
        ];
        return newModel.sort((a, b) => a.order - b.order);
      });
      setIsCreating(false);
      setNewGuestTierName("");
    }
  }, [wedding.id, newGuestTierName]);

  const handleCreateGuest = useCallback((guest: WeddingGuest) => {
    setVisualGuestTierModel((prevModel) => {
      const updatedTier = prevModel.find((tier) => tier.id === guest.weddingGuestTierId);
      if (!updatedTier) {
        return prevModel;
      }
      const newModel = [
        ...prevModel.filter((tier) => tier.id !== guest.weddingGuestTierId),
        {
          ...updatedTier,
          weddingGuests: [...updatedTier.weddingGuests, guest].sort((a, b) => a.order - b.order),
        },
      ];
      return newModel.sort((a, b) => a.order - b.order);
    });
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="TIER" direction="horizontal">
        {(boardDropContext) => (
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
            {isCreating && (
              <ul className="menu rounded-box p-2 flex-1 bg-base-200 h-full">
                <li className="menu-title flex flex-row">
                  <input
                    className="input input-xs flex-1"
                    autoFocus={true}
                    value={newGuestTierName}
                    onChange={(e) => setNewGuestTierName(e.target.value)}
                    onBlur={handleCreateGuestListTier}
                    onKeyUp={async (e) => {
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
                    <XMarkIcon className="w-4 h-4 text-base-content" />
                  </button>
                </li>
              </ul>
            )}
            <button
              className="btn h-full bg-base-200 border-none hover:bg-base-300"
              onClick={() => setIsCreating(true)}
            >
              <PlusIcon className="w-4 h-4 text-base-content" />
            </button>
            {tiers.length === 0 && (
              <>
                <ArrowLeftIcon className="h-10 w-10" />
                <article className="prose flex items-center">
                  <h2>Click to add a Guest List Tier</h2>
                </article>
              </>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
