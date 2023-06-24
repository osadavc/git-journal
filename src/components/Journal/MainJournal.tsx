import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import JournalEditor from "./JournalEditor";
import axios from "axios";

const MainJournal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const keys = JSON.parse(localStorage.getItem("keys")!);

      try {
        setLoading(true);
        const { data } = await axios.get("/api/github/entry", {
          params: {
            secretKey: keys.secret,
            initKey: keys.vector,
            date: selectedDate.toDateString(),
            mode: "NonCustodial",
          },
        });

        setContent(data.content);
        setLoading(false);
      } catch (error: any) {
        if (error.response.status == 404) {
          setContent("");
          setLoading(false);
        }
      }
    })();
  }, [selectedDate]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col mt-7 px-4">
      <h2 className="mb-2 p-3 text-lg">
        Hey there ! Welcome to your Journal 👋🏻
      </h2>

      <div className="flex flex-col lg:flex-row lg:space-x-5 space-y-5 lg:space-y-0">
        <div className="flex-1 wired-card-container">
          <wired-card>
            <Calendar
              onChange={(e) => {
                setSelectedDate(e as Date);
              }}
              value={selectedDate}
            />
          </wired-card>
        </div>
        <div className="flex-[3]">
          <div className="wired-card-container journal-writer-container">
            <wired-card>
              <JournalEditor
                date={selectedDate}
                content={content}
                loading={loading}
              />
            </wired-card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainJournal;
