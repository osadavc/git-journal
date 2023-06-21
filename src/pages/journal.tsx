import ConnectGithub from "@/components/Journal/ConnectGithub";
import Header from "@/components/Journal/Header";
import usePassage from "@/hooks/usePassage";
import prisma from "@/lib/prisma";
import Passage from "@passageidentity/passage-node";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface JournalProps {
  isLoggedIntoGithub: boolean;
}

const Journal: NextPage<JournalProps> = ({ isLoggedIntoGithub }) => {
  const { isAuthorized, isLoading } = usePassage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push("/login");
    }
  }, [isLoading]);

  return (
    <div>
      <Header />
      {isLoggedIntoGithub ? <div>Logged in</div> : <ConnectGithub />}
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

  const userID = await passage.authenticateRequest(req);

  const user = await prisma.user.findUnique({
    where: {
      passageId: userID,
    },
    select: {
      githubAccessToken: true,
    },
  });

  return {
    props: {
      isLoggedIntoGithub: !!user?.githubAccessToken,
    },
  };
};

export default Journal;
