import { FaGithub } from "react-icons/fa";

const ConnectGithub = () => {
  return (
    <div className="max-w-7xl mx-auto mt-16 px-4">
      <div className="wired-card-container">
        <wired-card>
          <div className="px-3 flex justify-center items-center py-4 flex-col text-center">
            <h1 className="text-2xl font-bold">Connect Github</h1>
            <p className="mt-3 text-xl">
              Connect your github account to store your journal entries
            </p>

            <div className="mt-5">
              <wired-button
                elevation="1"
                onClick={() => {
                  window.location.href = `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`;
                }}
              >
                <div className="flex justify-center items-center">
                  <FaGithub className="text-xl" />
                  <p className="capitalize text-lg px-3">Connect Github</p>
                </div>
              </wired-button>
            </div>
          </div>
        </wired-card>
      </div>
    </div>
  );
};

export default ConnectGithub;
