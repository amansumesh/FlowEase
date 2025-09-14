import React, { useState } from "react";
import CalendarView from "./CalendarView";
import EventsComponents from "./EventsComponent";
import events from "./events"; 

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="flex-1 p-6">
      <CalendarView
        events={events}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <EventsComponents selectedDate={selectedDate} events={events} />
    </div>
  );
};

export default CalendarPage;
