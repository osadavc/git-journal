import { useEffect } from "react";

const WiredElements = () => {
  useEffect(() => {
    import("wired-elements");
  }, []);

  return <></>;
};

export default WiredElements;
