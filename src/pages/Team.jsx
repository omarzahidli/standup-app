import Sidebar from "../components/Sidebar"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { useGetStandupsQuery, useGetTeamMembersQuery, useGetVacationsQuery } from "../store/standupsApi"
import { FaUsers } from "react-icons/fa"
import { BiRefresh } from "react-icons/bi"
import { PiFireSimpleFill } from "react-icons/pi"
import isBetween from "dayjs/plugin/isBetween"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

function Team() {
    function refreshData() {
        fetchStandups()
        fetchUsers()
        fetchVacations()
    }

    setInterval(() => {
        refreshData()
    }, 30000)

    const { data: standups, refetch: fetchStandups } = useGetStandupsQuery()
    const { data: vacations, refetch: fetchVacations } = useGetVacationsQuery()
    const { data: users, refetch: fetchUsers } = useGetTeamMembersQuery()
    
    const today = dayjs().tz("Asia/Baku").format("YYYY-MM-DD")
    
    const standups4Today = standups?.filter((standup) => standup.date === today)
    const usersOnVacation = vacations?.filter(vacation => 
        dayjs(today).isBetween(
            dayjs(vacation.startDate).startOf("day"),
            dayjs(vacation.endDate).endOf("day"),
            "day",
            "[]"
        )
    )
    
    const pendingUsers = users?.filter((user) => {
        const hasSubmitted = standups4Today?.some(
            (standup) => standup.userId === user.id
        )

        const onVacation = usersOnVacation?.some(
            (vacation) => vacation.userId === user.id
        );

        return !hasSubmitted && !onVacation
    })

    const userStreaks = users?.map(user => {
        const userStandups = standups?.filter(s => s.userId === user.id)?.sort((a, b) => new Date(b.date) - new Date(a.date))
        let streak = 0
        let lastDate = null
        userStandups?.forEach(s => {
            const sDate = new Date(s.date)
            if (!lastDate) {
                streak = 1
            } 
            else {
                const diff = (lastDate - sDate) / (1000 * 60 * 60 * 24)
                if (diff === 1) streak++
            }
            lastDate = sDate
        })
        return { userId: user.id, streak }
    })
    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex flex-col gap-4 flex-1 my-4 mx-6">
                    <h1 className="text-center text-2xl md:text-4xl font-bold">Team Members</h1>
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-500 text-sm">Participation Rate</p>
                                <p className="text-3xl font-bold text-gray-800">{standups4Today?.length / users?.length * 100 || 0}%</p>
                            </div>
                            <FaUsers className="text-orange-500" size={32} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 p-6 bg-blue-100 rounded-2xl h-full">
                        <div className="bg-white rounded-xl shadow p-6 max-md:max-h-[330px] max-md:overflow-auto">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Submitted</h2>
                            <ul className="space-y-2">
                                {standups4Today?.length > 0 ? 
                                    standups4Today?.map((standup, idx) => {
                                        const time = dayjs(standup?.timestamp).tz("Asia/Baku");
                                        const hour = time.hour();
                                        let colorClass;
                                        if (hour < 10) colorClass = "text-green-500"
                                        else if (hour === 10) colorClass = "text-yellow-500"
                                        else colorClass = "text-red-500"
                                        return (
                                            <li key={idx} className={`${colorClass} flex justify-between items-center p-2 rounded hover:bg-gray-50`}>
                                                {
                                                    userStreaks?.some((streak) => streak.userId === standup?.userId) ?
                                                    <div className="flex items-center">
                                                        <div className="relative flex items-center justify-center">
                                                            <PiFireSimpleFill size={30} fill={"orange"} />
                                                            <span className="absolute text-white text-xs">{userStreaks?.filter((streak) => streak.userId == standup?.userId)[0].streak}</span>
                                                        </div>
                                                        <span>{standup?.userName}</span>
                                                    </div>
                                                    :
                                                    <span>{standup?.userName}</span>
                                                }
                                                <span className={`${colorClass}text-gray-400 text-sm`}>{dayjs(standup?.timestamp).tz("Asia/Baku").format("HH:mm A")}</span>
                                            </li>
                                        )
                                    })
                                    :
                                    <p>No submission yet!</p>
                                }
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6 max-md:max-h-[330px] max-md:overflow-auto">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pending</h2>
                            <ul className="space-y-2">
                                {pendingUsers?.length > 0 ?
                                    pendingUsers?.map((user, idx) => {
                                        return(
                                            <li key={idx} className="p-2 rounded hover:bg-gray-50">{user.name}</li>
                                        )
                                    })
                                    :
                                    <p>No pendings yet!</p>
                                }
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6 max-md:max-h-[330px] max-md:overflow-auto">
                            <h2 className="text-xl font-semibold mb-4 border-b pb-2">On Vacation</h2>
                            <ul className="space-y-2">
                                {usersOnVacation?.length > 0 ?
                                    usersOnVacation?.map((user, idx) => {
                                        return(
                                            <li key={idx} className="p-2 rounded hover:bg-gray-50">{user?.userName}</li>
                                        )
                                    })
                                    :
                                    <p>Nobody is on vacation yet!</p>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <button onClick={() => refreshData()} className="flex items-center justify-center gap-1 p-4 rounded-full bg-black text-white text-2xl fixed bottom-5 right-5 hover:animate-pulse cursor-pointer">
                    <BiRefresh size={32} /> 
                </button>
            </div>
        </>
    )
}

export default Team