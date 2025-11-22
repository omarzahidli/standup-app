function VacationCard({ vacation }) {
    
    const { userName, startDate, endDate, reason, status } = vacation

    const statusColor = status === "approved" ? "bg-green-100 text-green-800" 
    : status === "pending" ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-800"

    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2 hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{userName}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                    {status?.charAt(0).toUpperCase() + status?.slice(1)}
                </span>
            </div>
            <div className="text-sm text-gray-600">
                <p><span className="font-medium">From:</span> {startDate}</p>
                <p><span className="font-medium">To:</span> {endDate}</p>
            </div>
            {reason &&
                <div className="text-gray-700">
                    <p><span className="font-medium">Reason:</span> {reason}</p>
                </div>
            }
        </div>
    );
}

export default VacationCard


