import { IncomingMessage, ServerResponse } from "http";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { prisma } from "./prisma";

export const getCoupleId = async (
  req: IncomingMessage & { cookies: Partial<{ [p: string]: string }> },
  res: ServerResponse
): Promise<{ coupleId: string; redirect?: never } | { coupleId?: never; redirect: string }> => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: "/api/auth/signin",
    };
  }

  const coupleIdQuery = await prisma.couple.findFirst({
    select: { id: true },
    where: {
      users: {
        some: {
          email: session.user?.email,
        },
      },
    },
  });

  if (!coupleIdQuery) {
    return {
      redirect: "/couple",
    };
  }

  return {
    coupleId: coupleIdQuery.id,
  };
};
