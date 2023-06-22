import type { NextApiResponse } from "next";
import * as encryptionUtils from "@/utils/encryptionUtils";
import { createRouter } from "next-connect";
import prisma from "@/lib/prisma";
import {
  NextApiRequestWithUser,
  onError,
  onNoMatch,
  auth,
  refreshGithubToken,
} from "@/utils/apiUtils";
import { Octokit } from "octokit";
import nanoid from "@/utils/nanoid";
import { default_message } from "@/config";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth);
router.use(refreshGithubToken);

router.post(async (req, res) => {
  const { keyMode } = req.body;
  let keys;

  const user = await prisma.user.findUnique({
    where: {
      passageId: req.userID,
    },
    select: {
      githubAccessToken: true,
    },
  });

  const octokit = new Octokit({
    auth: user?.githubAccessToken,
  });

  const repoName = nanoid();

  const result = await octokit.request("POST /user/repos", {
    name: repoName,
    private: true,
  });

  const initVector = encryptionUtils.generateInitVector();
  const secret = encryptionUtils.generateSecret();

  const encryptedSecret = encryptionUtils.encryptMessage(
    default_message,
    secret.toString("hex"),
    initVector.toString("hex")
  );

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: result.data.owner.login,
    repo: result.data.name,
    path: "welcome.md",
    message: "Journal Created 🎉",
    content: btoa(encryptedSecret),
  });

  const isCloud = keyMode === "cloud";

  if (!isCloud) {
    keys = {
      vector: initVector.toString("hex"),
      secret: secret.toString("hex"),
    };
  }

  await prisma.user.update({
    where: {
      passageId: req.userID,
    },
    data: {
      secretKey: isCloud ? secret.toString("hex") : null,
      initKey: isCloud ? initVector.toString("hex") : null,
      mode: keyMode === "cloud" ? "Custodial" : "NonCustodial",
      journalRepoName: result.data.full_name,
    },
  });

  res.status(200).json({ message: "Repo created", keys });
});

export default router.handler({
  onError: onError,
  onNoMatch: onNoMatch,
});
