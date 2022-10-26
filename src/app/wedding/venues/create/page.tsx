import { prisma } from "../../../../util/prisma";
import { customGetSession } from "../../../../util/auth-utils";
import { notFound } from "next/navigation";
import ClientCreateVenuePage from "./create-page";

async function getWeddingId(email?: string) {
  const result = await prisma.wedding.findFirst({
    select: { id: true },
    where: { couple: { users: { some: { email } } } },
  });

  return result?.id;
}

export default async function ServerCreateVenuePage() {
  const session = await customGetSession();
  const weddingId = await getWeddingId(session?.user?.email);

  if (!weddingId) return notFound();

  return <ClientCreateVenuePage weddingId={weddingId} />;
}
