import { NextApiRequest, NextApiResponse } from "next";
import Passage from "@passageidentity/passage-node";

const passageConfig = {
  appID: process.env.NEXT_PUBLIC_PASSAGE_APP_ID!,
  apiKey: process.env.PASSAGE_API_KEY!,
};
const passage = new Passage(passageConfig);

export interface NextApiRequestWithUser extends NextApiRequest {
  userID: string;
}

export const auth = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: Function
) => {
  const userID = await passage.authenticateRequest(req);
  if (!userID) return res.status(401).json({ message: "Unauthorized" });

  req.userID = userID;
  return next();
};

export const onError = (err: any, _: NextApiRequest, res: NextApiResponse) => {
  console.log(err);
  return res.status(500).json({ statusCode: 500, message: err.message });
};

export const onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(404).json({ statusCode: 404, message: "Not Found" });
};
