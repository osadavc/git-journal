import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import JournalEditor from "./JournalEditor";
import axios from "axios";
import { formatDate } from "@/utils/dateUtils";

const MainJournal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMonthEntries, setSelectedMonthEntries] = useState<string[]>(
    []
  );
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null);

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
        console.log(error);
        if (error?.response?.status == 404) {
          setContent("");
          setLoading(false);
        }
      }
    })();
  }, [selectedDate]);

  useEffect(() => {
    getMonthlyEntries(activeStartDate || selectedDate);
  }, [selectedDate]);

  const getMonthlyEntries = async (startDate: Date | null) => {
    try {
      const { data } = await axios.get("/api/github/month", {
        params: {
          date: startDate!.toDateString(),
        },
      });

      setSelectedMonthEntries(data.entries);
    } catch (error: any) {
      if (error.response.status == 404) {
        console.log("No data found");
      } else {
        console.log(error);
      }
    }
  };

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
              onActiveStartDateChange={async ({ activeStartDate, view }) => {
                if (view == "month") {
                  await getMonthlyEntries(activeStartDate);
                }
                setActiveStartDate(activeStartDate);
              }}
              tileClassName={({ date, view }) => {
                if (view == "month") {
                  if (
                    selectedMonthEntries.find(
                      (x) => x === formatDate(date.toString()).file
                    )
                  ) {
                    return "days-with-entries";
                  }
                } else {
                  return "null";
                }
              }}
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
