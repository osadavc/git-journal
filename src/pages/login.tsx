import Header from "@/components/Login/Header";
import usePassage from "@/hooks/usePassage";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const { isAuthorized, isLoading } = usePassage();
  const router = useRouter();

  useEffect(() => {
    import("@passageidentity/passage-elements/passage-auth");

    if (!isLoading && isAuthorized) {
      router.push("/journal");
    }
  }, [isLoading]);

  return (
    <div>
      <Header />

      <div className="text-center mt-28 mb-10">
        <h1 className="text-4xl font-semibold">Login / Sign Up</h1>
        <h2 className="text-xl mt-6">
          Login if you already have an account or sign up to experience the
          magic
        </h2>
      </div>

      <div>
        <passage-auth app-id={process.env.NEXT_PUBLIC_PASSAGE_APP_ID} />
      </div>
    </div>
  );
};

export default Login;
