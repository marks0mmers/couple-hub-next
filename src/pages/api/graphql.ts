import "reflect-metadata";
import { buildSchemaSync } from "type-graphql";
import { resolvers } from "@generated/type-graphql";
import { ApolloServer } from "apollo-server-micro";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../common/prisma";

const apolloServer = new ApolloServer({
  schema: buildSchemaSync({ resolvers }),
  context: {
    prisma,
  },
});

const serverStart = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await serverStart;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
