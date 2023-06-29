import axios from "axios";
import nProgress from "nprogress";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";

const CreateRepo = () => {
  const [keyMode, setKeyMode] = useState<"cloud" | "local" | "">("");
  const router = useRouter();

  const createRepo = async () => {
    if (keyMode === "") {
      alert("Please choose a key mode");
      return;
    }

    nProgress.start();

    const {
      data: { keys },
    } = await axios.post("/api/github/createRepo", {
      keyMode,
    });
    localStorage.setItem("keys", JSON.stringify(keys));

    if (keyMode === "local") {
      localStorage.setItem("isBackupRequired", "true");
    }

    nProgress.done();
    location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4">
      <div className="wired-card-container">
        <wired-card>
          <div className="px-3 flex justify-center items-center py-4 flex-col text-center">
            <h1 className="text-2xl font-bold">
              Create The Journal Repository
            </h1>
            <div className="mt-3 text-xl">
              Create a repository to store your journal entries. Your journal
              entries will be encrypted and you need to choose if you store your
              encryption key in the cloud or locally.{" "}
              <span className="text-blue-600">
                Didn't understand anything ?
              </span>
            </div>

            <div className="mt-5 flex">
              <div className="flex justify-center items-center mr-5 space-x-3">
                <wired-button
                  elevation={keyMode === "cloud" ? "4" : "1"}
                  onClick={() => setKeyMode("cloud")}
                >
                  <p className="capitalize text-lg">Cloud</p>
                </wired-button>

                <wired-button
                  elevation={keyMode === "local" ? "4" : "1"}
                  onClick={() => setKeyMode("local")}
                >
                  <p className="capitalize text-lg">Local</p>
                </wired-button>
              </div>

              <div>
                <wired-button elevation="1" onClick={createRepo}>
                  <div className="flex justify-center items-center">
                    <FaPlus className="text-xl" />
                    <p className="capitalize text-lg px-3">Create Repository</p>
                  </div>
                </wired-button>
              </div>
            </div>
          </div>
        </wired-card>
      </div>
    </div>
  );
};

export default CreateRepo;
