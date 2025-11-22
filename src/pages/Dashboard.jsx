import Sidebar from "../components/Sidebar"
import { IoIosTrendingUp } from "react-icons/io"
import { useGetStatisticsQuery } from "../store/standupsApi"
import { FaUsers, FaCheck } from "react-icons/fa"
import { MdPending } from "react-icons/md"
import { FiLoader } from "react-icons/fi"


function Dashboard() {
    const { data, isFetching, isLoading } = useGetStatisticsQuery()
    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col my-4 mx-6">
                    <h1 className="text-2xl md:text-4xl font-bold text-center">Team Standup Dashboard</h1>
                    <h5 className="text-gray-600 mt-2 text-center">Track daily progress and team updates</h5>
                    <div className="flex flex-wrap gap-2 my-4">
                        <div className="flex-1/4 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Standups</p>
                                    {isLoading || isFetching ? 
                                        <FiLoader className="animate-spin" size={32} />
                                        :
                                        <p className="text-3xl font-bold text-gray-800">{data?.submittedToday + data?.pendingToday || 0}</p>
                                    }
                                </div>
                                <IoIosTrendingUp className="text-blue-500" size={32} />
                            </div>
                        </div>
                        <div className="flex-1/4 bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Participation Rate</p>
                                    {isLoading || isFetching ? 
                                        <FiLoader className="animate-spin" size={32} />
                                        :
                                        <p className="text-3xl font-bold text-gray-800">{data?.participationRate || 0}%</p>
                                    }
                                </div>
                                <FaUsers className="text-orange-500" size={32} />
                            </div>
                        </div>
                        <div className="flex-1/4 bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Submitted</p>
                                    {isLoading || isFetching ? 
                                        <FiLoader className="animate-spin" size={32} />
                                        :
                                        <p className="text-3xl font-bold text-gray-800">{data?.submittedToday || 0}</p>
                                    }
                                </div>
                                <FaCheck className="text-green-500" size={32} />
                            </div>
                        </div>
                        <div className="flex-1/4 bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Pending</p>
                                    {isLoading || isFetching ? 
                                        <FiLoader className="animate-spin" size={32} />
                                        :
                                        <p className="text-3xl font-bold text-gray-800">{data?.pendingToday || 0}</p>
                                    }
                                </div>
                                <MdPending className="text-yellow-500" size={32} />
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard