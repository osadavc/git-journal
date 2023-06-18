import Header from "@/components/Login/Header";
import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    import("@passageidentity/passage-elements/passage-auth");
  });

  return (
    <div>
      <Header />

      <div>
        <passage-auth app-id={process.env.NEXT_PUBLIC_PASSAGE_APP_ID} />
      </div>
    </div>
  );
};

export default Login;
