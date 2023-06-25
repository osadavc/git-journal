import { Passage } from "@passageidentity/passage-js";
import { useRouter } from "next/router";

const usePassage = () => {
  const router = useRouter();

  const logout = async () => {
    const passage = new Passage(process.env.NEXT_PUBLIC_PASSAGE_APP_ID!);
    const session = passage.getCurrentSession();
    session.signOut();
    router.push("/");
  };

  return { logout };
};

export default usePassage;
