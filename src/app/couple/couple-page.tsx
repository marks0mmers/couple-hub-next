"use client";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChangeEvent, useCallback, useEffect, useMemo } from "react";
import { Couple, CoupleType, User } from "@prisma/client";
import { usePageTitle } from "../(contexts)/page-title-context";

type Props = {
  couple:
    | (Omit<Couple, "relationshipStart"> & {
        relationshipStart: string | null;
        users: User[];
      })
    | null;
};

async function updateCouple(body: unknown) {
  const url = "/api/couples";
  const options = {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };

  await fetch(url, options);
}

export default function ClientCouplePage({ couple }: Props) {
  const router = useRouter();
  const [, setPageTitle] = usePageTitle();
  const { data: session } = useSession();

  useEffect(() => {
    setPageTitle("Couple Management");
  }, [setPageTitle]);

  const onRelationshipStartChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const newDate = e.currentTarget.value;

      await updateCouple({
        ...couple,
        relationshipStart: newDate,
      });

      router.reload();
    },
    [couple, router]
  );

  const onRelationshipTypeChange = useCallback(
    async (e: ChangeEvent<HTMLSelectElement>) => {
      const newType = e.currentTarget.value;

      await updateCouple({
        ...couple,
        coupleType: newType,
      });

      router.reload();
    },
    [couple, router]
  );

  const currentUser = useMemo(() => {
    return couple?.users.find((user) => user.email === session?.user?.email);
  }, [couple?.users, session?.user?.email]);

  const otherUser = useMemo(() => {
    return couple?.users.find((user) => user.email !== session?.user?.email);
  }, [couple?.users, session?.user?.email]);

  return (
    <>
      <div className="card w-72 shadow-xl bg-base-100">
        <article className="card-body prose">
          <h3>Current User</h3>
          <p>
            {currentUser?.name}
            <br />
            {currentUser?.email}
          </p>
        </article>
      </div>
      <div id="couple-info" className="flex flex-col justify-center">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Relationship Start</span>
          </label>
          <input
            id="relationshipStart"
            type="date"
            className="input"
            defaultValue={couple?.relationshipStart ?? undefined}
            onChange={onRelationshipStartChange}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Relationship Type</span>
          </label>
          <select
            id="relationshipType"
            className="select"
            value={couple?.coupleType}
            onChange={onRelationshipTypeChange}
          >
            {Object.keys(CoupleType).map((coupleType) => (
              <option key={coupleType} value={coupleType}>
                {coupleType}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="card w-72 shadow-xl bg-base-100">
        <article className="card-body prose">
          <h3>Partner</h3>
          <p>
            {otherUser?.name}
            <br />
            {otherUser?.email}
          </p>
        </article>
      </div>
    </>
  );
}
