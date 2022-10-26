import { Draggable, Droppable } from "@hello-pangea/dnd";
import { WeddingGuest, WeddingGuestTier } from "@prisma/client";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useCallback, FormEvent, useState } from "react";
import clsx from "clsx";

type Props = {
  tier: WeddingGuestTier & { weddingGuests: WeddingGuest[] };
  index: number;
  onGuestCreated: (guest: WeddingGuest) => void;
};

const GuestColumn = ({ tier, index, onGuestCreated }: Props) => {
  const [newGuestName, setNewGuestName] = useState("");

  const addGuestToTier = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const url = `/api/weddings/guestTiers/guests?tierId=${tier.id}`;

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newGuestName,
        }),
      };

      const response = await fetch(url, options);

      const created: WeddingGuest = await response.json();

      onGuestCreated(created);

      setNewGuestName("");
    },
    [tier.id, newGuestName, onGuestCreated]
  );

  return (
    <Draggable draggableId={tier.id} index={index}>
      {(tierDragContext) => (
        <div
          {...tierDragContext.draggableProps}
          {...tierDragContext.dragHandleProps}
          ref={tierDragContext.innerRef}
          className="flex flex-col rounded-box p-2 flex-1 bg-base-200 h-full overflow-hidden"
        >
          <div className="w-full bg-base-100 rounded-t-box py-1 border-b-base-300 border-b-[1px]">
            <span className="text-2xs py-1 px-4 font-bold w-full">{tier.name}</span>
          </div>
          <Droppable droppableId={tier.id} type="GUEST">
            {(tierDropContext) => (
              <ul
                {...tierDropContext.droppableProps}
                ref={tierDropContext.innerRef}
                className="text-base-content overflow-y-scroll flex-1 bg-base-100"
              >
                {tier.weddingGuests.map((guest, index) => (
                  <Draggable draggableId={guest.id} index={index} key={guest.id}>
                    {(dragContext, dragSnapshot) => (
                      <li
                        {...dragContext.draggableProps}
                        {...dragContext.dragHandleProps}
                        ref={dragContext.innerRef}
                        className={clsx("bg-base-100", "border-b-base-300", "border-b-[1px]", {
                          "border-base-300": dragSnapshot.isDragging,
                          "border-[1px]": dragSnapshot.isDragging,
                        })}
                      >
                        <p className="px-4 py-1">{guest.name}</p>
                      </li>
                    )}
                  </Draggable>
                ))}
                {tierDropContext.placeholder}
              </ul>
            )}
          </Droppable>
          <form
            onSubmit={addGuestToTier}
            className="bg-base-100 rounded-b-box flex gap-2 px-3 py-3 border-t-base-300 border-t-[1px]"
          >
            <input
              name="name"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="input input-xs input-bordered rounded-md flex-1"
            />
            <button
              className={clsx(
                "btn",
                "btn-xs",
                "px-1",
                "bg-transparent",
                "border-transparent",
                "hover:border-transparent",
                "hover:bg-base-200",
                "active:bg-base-300"
              )}
            >
              <PlusIcon className="w-4 h-4 text-base-content" />
            </button>
          </form>
        </div>
      )}
    </Draggable>
  );
};

export default GuestColumn;
