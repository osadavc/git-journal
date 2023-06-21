import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import Passage from "@passageidentity/passage-node";
import prisma from "@/lib/prisma";
import axios from "axios";

const router = createRouter<NextApiRequest, NextApiResponse>();

const passageConfig = {
  appID: process.env.NEXT_PUBLIC_PASSAGE_APP_ID!,
  apiKey: process.env.PASSAGE_API_KEY!,
};
const passage = new Passage(passageConfig);

router.get(async (req, res) => {
  const userID = await passage.authenticateRequest(req);
  if (!userID) return res.status(401).json({ message: "Unauthorized" });

  const { code } = req.query;
});

export default router.handler();
