import React, { FC } from "react";

interface BackupRequiredProps {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const BackupRequired: FC<BackupRequiredProps> = ({ setReload }) => {
  const downloadBackup = () => {
    const keys = JSON.parse(localStorage.getItem("keys")!);

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(keys)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "journal.json";
    document.body.appendChild(element);
    element.click();

    localStorage.removeItem("isBackupRequired");

    setTimeout(() => {
      setReload((prev) => !prev);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="wired-card-container">
        <wired-card>
          <div className="px-3 flex justify-center py-4 flex-col">
            <h1 className="text-xl mb-2">Attention Required</h1>
            <p className="text-lg">
              You have chosen to store the keys of your journal yourself. They
              are currently stored in your local storage. Please backup them
              from here for future use otherwise you might lose access to your
              journal. Keep the downloaded file secure in-order to use it in the
              future
            </p>

            <div className="mt-3">
              <wired-button elevation="1" onClick={downloadBackup}>
                <div className="flex justify-center items-center">
                  <p className="capitalize px-3">Download Backup</p>
                </div>
              </wired-button>
            </div>
          </div>
        </wired-card>
      </div>
    </div>
  );
};

export default BackupRequired;
