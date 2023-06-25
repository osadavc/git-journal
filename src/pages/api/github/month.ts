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

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth);
router.use(refreshGithubToken);

router.get(async (req, res) => {
  const { date } = req.query as {
    date: string;
  };

  console.log(date);

  const { folder: formattedFolderName } = formatDate(date);
  console.log(formattedFolderName);

  const user = await prisma.user.findUnique({
    where: {
      passageId: req.userID,
    },
    select: {
      githubAccessToken: true,
      journalRepoName: true,
    },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const octokit = new Octokit({
    auth: user?.githubAccessToken,
  });

  try {
    const { data }: { data: any } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: user.journalRepoName?.split("/")[0]!,
        repo: user.journalRepoName?.split("/")[1]!,
        path: formattedFolderName,
      }
    );

    res
      .status(200)
      .json({ entries: data.map((item: any) => item.name.split(".")[0]) });
  } catch (error: any) {
    if (error.response.status == 404) {
      return res.status(404).json({ error: "Folder not found" });
    }
  }
});

export default router.handler({
  onError: onError,
  onNoMatch: onNoMatch,
});
