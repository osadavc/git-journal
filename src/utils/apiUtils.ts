import { NextApiRequest, NextApiResponse } from "next";
import Passage from "@passageidentity/passage-node";
import prisma from "@/lib/prisma";
import axios from "axios";

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

export const refreshGithubToken = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: Function
) => {
  const user = await prisma.user.findUnique({
    where: {
      passageId: req.userID,
    },
    select: {
      githubRefreshToken: true,
      accessTokenExpiration: true,
    },
  });

  if (user?.accessTokenExpiration!.getTime()! > Date.now()) return next();

  const { data } = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: user?.githubRefreshToken,
    }
  );

  const params = new URLSearchParams(data);

  const expirationTime =
    Math.floor(Date.now() / 1000) + parseInt(params.get("expires_in")!) - 1000;

  await prisma.user.update({
    where: {
      passageId: req.userID,
    },
    data: {
      githubAccessToken: params.get("access_token"),
      githubRefreshToken: params.get("refresh_token"),
      accessTokenExpiration: new Date(expirationTime * 1000),
    },
  });

  return next();
};

export const onError = (err: any, _: NextApiRequest, res: NextApiResponse) => {
  console.log(err);
  return res.status(500).json({ statusCode: 500, message: err.message });
};

export const onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(404).json({ statusCode: 404, message: "Not Found" });
};
