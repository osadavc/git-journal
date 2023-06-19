import { PassageUser } from "@passageidentity/passage-elements/passage-user";
import { useEffect, useState } from "react";

const usePassage = () => {
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
  return result;
};

export default usePassage;
