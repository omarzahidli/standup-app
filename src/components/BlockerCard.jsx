import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"


dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)


function BlockerCard({blocker}) {
    const dateObj = dayjs(blocker?.timestamp).tz("Asia/Baku")
    return (
        <div className="bg-white shadow-md rounded-xl p-4 border-l-4 border-red-500 flex flex-col justify-between hover:shadow-lg transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{blocker?.userName}</h3>
                <span className="text-sm text-gray-500">{dateObj.format("hh:mm A")} ({dateObj.fromNow()})</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">
                {blocker?.blockers}
            </p>
            <div className="text-right mt-2 text-xs text-gray-400">
                Submitted on: {dayjs(blocker.date).format("YYYY-MM-DD")}
            </div>
        </div>
    )
}

export default BlockerCard