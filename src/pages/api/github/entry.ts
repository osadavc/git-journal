import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import {
  NextApiRequestWithUser,
  onError,
  onNoMatch,
  auth,
  refreshGithubToken,
} from "@/utils/apiUtils";
import prisma from "@/lib/prisma";
import { Octokit } from "octokit";
import { formatDate } from "@/utils/dateUtils";
import { decryptMessage, encryptMessage } from "@/utils/encryptionUtils";
import { default_message } from "@/config";

const router = createRouter<NextApiRequestWithUser, NextApiResponse>();

router.use(auth);
router.use(refreshGithubToken);

router
  .get(async (req, res) => {
    let keys: {
      secretKey?: string;
      initKey?: string;
    } = {};
    const { secretKey, initKey, mode, date } = req.query as {
      secretKey: string;
      initKey: string;
      mode: "Custodial" | "NonCustodial";
      date: string;
    };

    if (!date || !mode)
      return res.status(400).json({ error: "Missing date or mode" });

    const user = await prisma.user.findUnique({
      where: {
        passageId: req.userID,
      },
    });
    if (!user || user.journalRepoName === null) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (mode === "Custodial") {
      keys = {
        secretKey: user.secretKey!,
        initKey: user.initKey!,
      };
    } else {
      if (!secretKey || !initKey) {
        res.status(400).json({ error: "Missing keys" });
        return;
      }

      keys = {
        secretKey,
        initKey,
      };
    }
    const octokit = new Octokit({
      auth: user?.githubAccessToken,
    });

    if (!keys.secretKey || !keys.initKey)
      return res.status(400).json({ error: "Missing keys" });

    octokit
      .request("GET /repos/{owner}/{repo}/contents/{path}", {
        owner: user.journalRepoName?.split("/")[0],
        repo: user.journalRepoName?.split("/")[1],
        path: `${formatDate(date)}.md`,
      })
      .then((res: any) => {
        const decoded = atob(res.data.content);
        const decrypted = decryptMessage(
          decoded,
          keys.secretKey!,
          keys.initKey!
        );

        return res.status(200).json({ content: decrypted });
      })
      .catch(() => {
        return res.status(404).json({ error: "File not found" });
      });
  })
  .post(async (req, res) => {
    let keys: {
      secretKey?: string;
      initKey?: string;
    } = {};
    const { secretKey, initKey, mode, date } = req.query as {
      secretKey: string;
      initKey: string;
      mode: "Custodial" | "NonCustodial";
      date: string;
    };

    if (!date || !mode)
      return res.status(400).json({ error: "Missing date or mode" });

    const user = await prisma.user.findUnique({
      where: {
        passageId: req.userID,
      },
    });
    if (!user || user.journalRepoName === null) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (mode === "Custodial") {
      keys = {
        secretKey: user.secretKey!,
        initKey: user.initKey!,
      };
    } else {
      if (!secretKey || !initKey) {
        res.status(400).json({ error: "Missing keys" });
        return;
      }

      keys = {
        secretKey,
        initKey,
      };
    }
    const octokit = new Octokit({
      auth: user?.githubAccessToken,
    });

    if (!keys.secretKey || !keys.initKey)
      return res.status(400).json({ error: "Missing keys" });

    const { data }: { data: any } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: user.journalRepoName?.split("/")[0],
        repo: user.journalRepoName?.split("/")[1],
        path: "welcome.md",
      }
    );

    const decoded = atob(data.content);
    const decrypted = decryptMessage(decoded, keys.secretKey!, keys.initKey!);

    if (decrypted != default_message)
      return res.status(400).json({ error: "Invalid keys" });

    const encrypted = btoa(
      encryptMessage(req.body.content, keys.secretKey!, keys.initKey!)
    );

    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: user.journalRepoName?.split("/")[0],
      repo: user.journalRepoName?.split("/")[1],
      path: `${formatDate(date)}.md`,
      message: `Journal Updated ${new Date().toISOString()}`,
      content: encrypted,
    });

    return res.status(200).json({ success: true });
  });

export default router.handler({
  onError: onError,
  onNoMatch: onNoMatch,
});