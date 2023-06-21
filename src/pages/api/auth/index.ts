import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import Passage from "@passageidentity/passage-node";
import prisma from "@/lib/prisma";
import {
  NextApiRequestWithUser,
  auth,
  onError,
  onNoMatch,
} from "@/utils/apiUtils";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

const passageConfig = {
  appID: process.env.NEXT_PUBLIC_PASSAGE_APP_ID!,
  apiKey: process.env.PASSAGE_API_KEY!,
};
const passage = new Passage(passageConfig);

router.use(auth);

router.get(async (req, res) => {
  const passageUser = await passage.user.get(req.userID);

  const existingUser = await prisma.user.findUnique({
    where: {
      passageId: req.userID,
    },
  });

  if (existingUser)
    return res.status(200).json({ message: "User already exists" });

  await prisma.user.create({
    data: {
      passageId: req.userID,
      email: passageUser.email,
    },
  });

  res.status(200).json({ message: "User created" });
});

export default router.handler({
  onError: onError,
  onNoMatch: onNoMatch,
});
