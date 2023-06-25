import toast from "react-hot-toast";
import { BiError, BiCheck } from "react-icons/bi";

export const displayToast = (text: string, error: boolean = false) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 mb-10`}
      style={{
        backgroundColor: "#fff",
      }}
    >
      <div className="toast-card-wrapper">
        <wired-card>
          <div className="flex justify-between items-center px-3">
            {error ? <BiError /> : <BiCheck />}
            <p>Hey</p>
          </div>
        </wired-card>
      </div>
    </div>
  ));
};
