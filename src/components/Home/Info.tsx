const Info = () => {
  return (
    <div className="max-w-7xl mx-auto py-20 px-4 mt-10">
      <div className="text-center">
        <h1 className="text-3xl">
          Why GitJournal Over Traditional Journaling Tools ?
        </h1>
        <p className="mt-7 text-xl">
          With GitJournal, you store your journal entries in your github
          encrypted. <br />{" "}
          <span className="text-blue-600">
            we have no control over your data
          </span>
        </p>
      </div>

      <div className="flex mt-20 space-x-10">
        <div className="flex-1">
          <div className="wired-card-container">
            <div className="flex justify-center items-center">
              <img src="/images/info.png" alt="" />
            </div>
          </div>
        </div>

        <div className="flex-col flex-1 flex space-y-5">
          <div className="wired-card-container info-card-container h-full">
            <wired-card>
              <div className="px-4 py-2 flex flex-col justify-center">
                <h2 className="text-3xl bg-gray-200 rounded-full aspect-square w-[50px] flex justify-center items-center pr-1 mb-3">
                  1
                </h2>

                <p className="text-xl">
                  You hold your data, as long as github keeps running, your data
                  will be safe
                </p>
              </div>
            </wired-card>
          </div>
          <div className="wired-card-container info-card-container h-full">
            <wired-card>
              <div className="px-4 py-2 flex flex-col justify-center">
                <h2 className="text-3xl bg-gray-200 rounded-full aspect-square w-[50px] flex justify-center items-center mb-3">
                  2
                </h2>

                <p className="text-xl">
                  Your data is encrypted with a military grade encryption.
                </p>
              </div>
            </wired-card>
          </div>
          <div className="wired-card-container info-card-container h-full">
            <wired-card>
              <div className="px-4 py-2 flex flex-col justify-center">
                <h2 className="text-3xl bg-gray-200 rounded-full aspect-square w-[50px] flex justify-center items-center mb-3">
                  3
                </h2>

                <p className="text-xl">
                  You will be holding your key. Not us, not github but YOU !
                </p>
              </div>
            </wired-card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
