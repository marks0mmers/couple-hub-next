import { GetServerSideProps } from "next";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Couple, CoupleType } from "@prisma/client";
import { prisma } from "../../common/prisma";
import { ChangeEvent, useCallback, useMemo } from "react";
import axios from "axios";
import format from "date-fns/format";
import Head from "next/head";
import { useRouter } from "next/router";
import { goToSignIn } from "../../util/auth-utils";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return goToSignIn();
  }

  const couple = await prisma.couple.findFirst({
    include: { users: true },
    where: {
      users: {
        some: {
          email: session.user?.email,
        },
      },
    },
  });

  if (!couple) {
    return {
      props: { couple: null },
    };
  }

  return {
    props: {
      couple: {
        ...couple,
        relationshipStart: couple.relationshipStart ? format(couple.relationshipStart, "yyyy-MM-dd") : null,
      },
    },
  };
};

type Props = {
  couple: Omit<Couple, "relationshipStart"> & {
    relationshipStart: string | null;
    users: User[];
  } | null;
}

export default function CouplePage({ couple }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const onRelationshipStartChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.currentTarget.value;
    await axios.put("/api/couples", {
      ...couple,
      relationshipStart: newDate,
    });
    router.reload();
  }, [couple, router]);

  const onRelationshipTypeChange = useCallback(async (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.currentTarget.value;
    await axios.put("/api/couples", {
      ...couple,
      coupleType: newType,
    });
    router.reload();
  }, [couple, router]);

  const currentUser = useMemo(() => {
    return couple?.users.find(user => user.email === session?.user?.email);
  }, [couple?.users, session?.user?.email]);

  const otherUser = useMemo(() => {
    return couple?.users.find(user => user.email !== session?.user?.email);
  }, [couple?.users, session?.user?.email]);

  return (
    <main id="couple-page" className="flex-1 p-4 bg-base-200">
      <Head>
        <title>Couple Management</title>
      </Head>
      <div className="flex justify-around">
        <div className="card w-72 shadow-xl bg-base-100">
          <article className="card-body prose">
            <h3>Current User</h3>
            <p>{currentUser?.name}<br/>{currentUser?.email}</p>
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
              {Object.keys(CoupleType).map(coupleType => (
                <option key={coupleType} value={coupleType}>{coupleType}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card w-72 shadow-xl bg-base-100">
          <article className="card-body prose">
            <h3>Partner</h3>
            <p>{otherUser?.name}<br/>{otherUser?.email}</p>
          </article>
        </div>
      </div>
    </main>
  );
}
