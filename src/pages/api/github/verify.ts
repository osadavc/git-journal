import type { NextApiResponse } from "next";
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
import { formatDate } from "@/utils/dateUtils";
import { decryptMessage } from "@/utils/encryptionUtils";
import { default_message } from "@/config";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth);
router.use(refreshGithubToken);

router.get(async (req, res) => {
  const { secretKey, initKey } = req.query as {
    secretKey: string;
    initKey: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      passageId: req.userID,
    },
    select: {
      githubAccessToken: true,
      journalRepoName: true,
    },
  });

  if (!user || user.journalRepoName === null) {
    return res.status(404).json({ error: "User not found" });
  }

  const octokit = new Octokit({
    auth: user?.githubAccessToken,
  });

  const { data }: { data: any } = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: user.journalRepoName?.split("/")[0],
      repo: user.journalRepoName?.split("/")[1],
      path: "welcome.md",
    }
  );

  const decoded = atob(data.content);
  const decrypted = decryptMessage(decoded, secretKey, initKey);

  if (decrypted != default_message)
    return res.status(400).json({ error: "Invalid keys" });

  res.status(200).json({ success: true });
});

export default router.handler({
  onError: onError,
  onNoMatch: onNoMatch,
});
