import BackupRequired from "@/components/Journal/BackupRequired";
import ConnectGithub from "@/components/Journal/ConnectGithub";
import CreateRepo from "@/components/Journal/CreateRepo";
import Header from "@/components/Journal/Header";
import MainJournal from "@/components/Journal/MainJournal";
import NoKeys from "@/components/Journal/NoKeys";
import prisma from "@/lib/prisma";
import Passage from "@passageidentity/passage-node";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

interface JournalProps {
  isLoggedIntoGithub: boolean;
  isRepoCreated: boolean;
  mode: "Custodial" | "NonCustodial";
}

const Journal: NextPage<JournalProps> = ({
  isLoggedIntoGithub,
  isRepoCreated,
  mode,
}) => {
  const [isBackupRequired, setIsBackupRequired] = useState(false);
  const [isKeys, setIsKeys] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const isBackupRequired = localStorage.getItem("isBackupRequired");

    const keys = JSON.parse(
      localStorage.getItem("keys")?.length! > 0
        ? localStorage.getItem("keys")!
        : "{}"
    );

    if ((keys.secret && keys.vector) || mode == "Custodial") {
      setIsKeys(true);
    } else {
      setIsKeys(false);
    }

    setIsLoading(false);

    if (isBackupRequired) {
      setIsBackupRequired(true);
    } else {
      setIsBackupRequired(false);
    }
  }, [reload]);

  return (
    <div>
      <Header />

      {isBackupRequired && <BackupRequired setReload={setReload} />}

      {isLoggedIntoGithub ? (
        isRepoCreated ? (
          isKeys ? (
            <MainJournal />
          ) : (
            !isLoading && <NoKeys setReload={setReload} />
          )
        ) : (
          <CreateRepo />
        )
      ) : (
        <ConnectGithub />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const passageConfig = {
    appID: process.env.NEXT_PUBLIC_PASSAGE_APP_ID!,
    apiKey: process.env.PASSAGE_API_KEY!,
    authStrategy: "HEADER",
  };
  const passage = new Passage(passageConfig as any);

  const authToken = context.req.cookies["psg_auth_token"];
  const req = {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const userID = await passage.authenticateRequest(req);

    const user = await prisma.user.findUnique({
      where: {
        passageId: userID,
      },
      select: {
        githubAccessToken: true,
        journalRepoName: true,
        mode: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      props: {
        isLoggedIntoGithub: !!user?.githubAccessToken,
        isRepoCreated: !!user?.journalRepoName,
        mode: user.mode,
      },
    };
  } catch (error) {
    return {
      props: {},
      redirect: {
        destination: "/login",
      },
    };
  }
};

export default Journal;
