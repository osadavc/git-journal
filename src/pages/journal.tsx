import ConnectGithub from "@/components/Journal/ConnectGithub";
import CreateRepo from "@/components/Journal/CreateRepo";
import Header from "@/components/Journal/Header";
import prisma from "@/lib/prisma";
import Passage from "@passageidentity/passage-node";
import { GetServerSideProps, NextPage } from "next";

interface JournalProps {
  isLoggedIntoGithub: boolean;
  isRepoCreated: boolean;
}

const Journal: NextPage<JournalProps> = ({
  isLoggedIntoGithub,
  isRepoCreated,
}) => {
  return (
    <div>
      <Header />
      {isLoggedIntoGithub ? (
        isRepoCreated ? (
          <div>Done</div>
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
      },
    });

    return {
      props: {
        isLoggedIntoGithub: !!user?.githubAccessToken,
        isRepoCreated: !!user?.journalRepoName,
      },
    };
  } catch (error) {
    return { props: {}, redirect: "/login" };
  }
};

export default Journal;
