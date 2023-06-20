import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import Passage from "@passageidentity/passage-node";
import prisma from "@/lib/prisma";

const router = createRouter<NextApiRequest, NextApiResponse>();

const passageConfig = {
  appID: process.env.NEXT_PUBLIC_PASSAGE_APP_ID!,
  apiKey: process.env.PASSAGE_API_KEY!,
};
const passage = new Passage(passageConfig);

router.get(async (req, res) => {
  const userID = await passage.authenticateRequest(req);
  const passageUser = await passage.user.get(userID);

  const existingUser = await prisma.user.findUnique({
    where: {
      passageId: userID,
    },
  });

  if (existingUser)
    return res.status(200).json({ message: "User already exists" });

  await prisma.user.create({
    data: {
      passageId: userID,
      email: passageUser.email,
    },
  });

  res.status(200).json({ message: "User created" });
});

export default router.handler();
