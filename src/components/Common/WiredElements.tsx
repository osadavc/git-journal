import { useEffect } from "react";

const WiredElements = () => {
  useEffect(() => {
    // import("wired-elements");
    import("wired-elements/lib/wired-card");
    import("wired-elements/lib/wired-button");
    import("wired-elements/lib/wired-calendar");
  }, []);

  return <></>;
};

export default WiredElements;
