import { useState } from "react";
import Calendar from "react-calendar";
import JournalEditor from "./JournalEditor";

const MainJournal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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
              <JournalEditor date={selectedDate} />
            </wired-card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainJournal;
