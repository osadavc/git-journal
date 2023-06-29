import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import prisma from "@/lib/prisma";
import axios from "axios";
import {
  NextApiRequestWithUser,
  onError,
  onNoMatch,
  auth,
} from "@/utils/apiUtils";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth);

router.get(async (req, res) => {
  const { code } = req.query;

  if (!code) return res.redirect("/");

  const { data } = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_REDIRECT_URL,
    }
  );

  const params = new URLSearchParams(data);

  console.log(params.get("expires_in"));

  const expirationTime =
    Math.floor(Date.now() / 1000) + parseInt(params.get("expires_in")!) - 1000;

  console.log(expirationTime);

  console.log(new Date(expirationTime * 1000));

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

  res.redirect("/journal");
});

export default router.handler({
  onError: onError,
  onNoMatch: onNoMatch,
});
