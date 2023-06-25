import { displayToast } from "@/utils/toastUtils";
import axios from "axios";
import React, { FC, useRef, useState, useEffect } from "react";

interface NoKeysProps {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoKeys: FC<NoKeysProps> = ({ setReload }) => {
  const fileUploader = useRef<HTMLInputElement>(null);
  const [verifying, setVerifying] = useState(false);

  const uploadBackup = () => {
    if (!verifying) {
      fileUploader.current?.click();
    }
  };

  useEffect(() => {
    (async () => {
      fileUploader.current?.addEventListener("change", (e) => {
        const file = fileUploader.current?.files![0];
        const reader = new FileReader();

        reader.onload = async (e) => {
          const keys = JSON.parse(e.target?.result as string);

          setVerifying(true);
          await axios
            .get("/api/github/verify", {
              params: {
                secretKey: keys.secret,
                initKey: keys.vector,
              },
            })
            .then(() => {
              localStorage.setItem("keys", JSON.stringify(keys));
              localStorage.removeItem("isBackupRequired");

              setReload(true);
            })
            .catch(() => {
              displayToast("Invalid Keys", true);
            })
            .finally(() => {
              setVerifying(false);
            });
        };

        reader.readAsText(file!);
      });
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4">
      <div className="wired-card-container">
        <input
          type="file"
          ref={fileUploader}
          className="hidden"
          accept="application/json"
        />

        <wired-card>
          <div className="px-3 flex justify-center py-4 flex-col">
            <h1 className="text-xl mb-2">Attention Required</h1>
            <p className="text-lg">
              You have chosen to store the keys of your journal yourself. As
              you're logging in to a new device, you need to upload the backup
              of your keys. If you have lost your keys, unfortunately, you will
              no way to access your journal.
            </p>

            <div className="mt-3">
              <wired-button elevation="1" onClick={uploadBackup}>
                <div className="flex justify-center items-center">
                  <p className="capitalize px-3">
                    {verifying ? "Loading" : "Upload Backup"}
                  </p>
                </div>
              </wired-button>
            </div>
          </div>
        </wired-card>
      </div>
    </div>
  );
};

export default NoKeys;
