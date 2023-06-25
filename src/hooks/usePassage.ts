import { Passage } from "@passageidentity/passage-js";
import { useRouter } from "next/router";
import { PassageUser } from "@passageidentity/passage-elements/passage-user";
import { useEffect, useState } from "react";

const usePassage = () => {
  const router = useRouter();

  const [result, setResult] = useState({
    isLoading: true,
    isAuthorized: false,
  });

  useEffect(() => {
    let cancelRequest = false;
    try {
      new PassageUser().authGuard().then((res) => {
        if (cancelRequest) {
          return;
        }
        if (res === false) {
          setResult({
            isLoading: false,
            isAuthorized: false,
          });
          return;
        }
        setResult({
          isLoading: false,
          isAuthorized: true,
        });
      });
    } catch (error) {
      setResult({
        isLoading: false,
        isAuthorized: false,
      });
    }
    return () => {
      cancelRequest = true;
    };
  }, []);

  const logout = async () => {
    const passage = new Passage(process.env.NEXT_PUBLIC_PASSAGE_APP_ID!);
    const session = passage.getCurrentSession();
    session.signOut();
    router.push("/");
  };

  return { logout, ...result };
};

export default usePassage;
