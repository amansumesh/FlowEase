import React from "react";
import dayjs from "dayjs";

const Events = ({ selectedDate, events }) => {
  const selectedEvents =
    selectedDate &&
    events.filter((e) => dayjs(e.date).isSame(selectedDate, "day"));

  return (
    <div className="mt-4 p-2 border rounded-[20px] bg-gray-50 min-h-32 flex items-center justify-center font-inter">
      {selectedDate ? (
        selectedEvents.length > 0 ? (
          <div className="w-full">
            <h3 className="font-semibold mb-2">
              Events on {dayjs(selectedDate).format("DD MMM YYYY")}:
            </h3>
            <ul className="list-disc pl-5">
              {selectedEvents.map((ev, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: ev.color }}
                  ></span>
                  {ev.title || "Untitled Event"}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No tasks scheduled for this date
          </p>
        )
      ) : (
        <p className="text-gray-500 text-center">
          Click a date to see its events
        </p>
      )}
    </div>
  );
};

export default Events;
