import { prisma } from "../../../../util/prisma";
import { notFound } from "next/navigation";
import ClientCreateVenuePage from "./create-page";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

async function getWeddingId(email?: string | null) {
  const result = await prisma.wedding.findFirst({
    select: { id: true },
    where: { couple: { users: { some: { email } } } },
  });

  return result?.id;
}

export default async function ServerCreateVenuePage() {
  const session = await unstable_getServerSession(authOptions);
  const weddingId = await getWeddingId(session?.user?.email);

  if (!weddingId) {
    notFound();
    return null;
  }

  return <ClientCreateVenuePage weddingId={weddingId} />;
}
