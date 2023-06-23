import { useState } from "react";
import Calendar from "react-calendar";

const MainJournal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="max-w-7xl mx-auto flex mt-10 px-4 space-x-5">
      <div className="flex-1">
        <wired-card>
          <Calendar
            onChange={(e) => {
              setSelectedDate(e as Date);
            }}
            value={selectedDate}
          />
        </wired-card>
      </div>
      <div className="flex-[3]">o
        <div className="wired-card-container journal-writer-container">
          <wired-card></wired-card>
        </div>
      </div>
    </div>
  );
};

export default MainJournal;
