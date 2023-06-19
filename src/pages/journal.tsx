import usePassage from "@/hooks/usePassage";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Journal = () => {
  const { isAuthorized, isLoading } = usePassage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.push("/login");
    }
  }, [isLoading]);

  return <div></div>;
};

export default Journal;
