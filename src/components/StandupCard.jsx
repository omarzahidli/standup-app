import dayjs from "dayjs"
import { AiOutlineClockCircle } from "react-icons/ai"
import { MdOutlineToday, MdOutlineHistory } from "react-icons/md"
import { BiBlock } from "react-icons/bi"

function StandupCard({ standup }) {
  const { userName, userId, date, timestamp, yesterday, today, blockers } = standup

  const bakuTime = dayjs(timestamp)
  const hour = bakuTime.hour()

  let badgeBg = "bg-gray-200 text-gray-800"
  if (hour < 10) badgeBg = "bg-green-100 text-green-900"
  else if (hour >= 10 && hour <= 11) badgeBg = "bg-yellow-100 text-yellow-900"
  else badgeBg = "bg-red-100 text-red-900"

  return (
    <div className={`${blockers ? "border-2 border-red-500" : ""} bg-white rounded-xl shadow-md overflow-hidden flex flex-col justify-between transition hover:shadow-lg`}>
      <div>
        <div className="flex justify-between items-center p-4 bg-indigo-50">
            <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-base">{userName}</span>
            <span className="text-sm text-gray-600">@{userId}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeBg}`}>
            {hour < 10 ? "Early" : hour <= 11 ? "On Time" : "Late"}
            </span>
        </div>

        <div className="p-4 flex flex-col gap-3">
            <div className="flex items-start gap-2">
                <MdOutlineHistory className="text-indigo-500 mt-1" size={20} />
                <div>
                    <span className="font-semibold text-indigo-700 text-sm">Yesterday:</span>
                    <p className="text-gray-700 text-sm mt-1">{yesterday}</p>
                </div>
            </div>

            <div className="flex items-start gap-2">
                <MdOutlineToday className="text-green-500 mt-1" size={20} />
                <div>
                    <span className="font-semibold text-green-700 text-sm">Today:</span>
                    <p className="text-gray-700 text-sm mt-1">{today}</p>
                </div>
            </div>

            {blockers && (
            <div className="flex items-start gap-2">
                <BiBlock className="text-red-500 mt-1" size={20} />
                <div>
                    <span className="font-semibold text-red-700 text-sm">Blockers:</span>
                    <p className="text-gray-700 text-sm mt-1">{blockers}</p>
                </div>
            </div>
            )}
        </div>
      </div>

      <div className="flex flex-wrap justify-end items-end px-4 py-2 bg-gray-50 border-t border-gray-200 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <AiOutlineClockCircle />
          <span>{bakuTime.format("hh:mm A")}</span>
        </div>
        <div className="flex items-center gap-1">
          <MdOutlineToday />
          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
        </div>
      </div>
    </div>
  );
}

export default StandupCard
