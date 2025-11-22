import { BiPlus } from "react-icons/bi"
import Sidebar from "../components/Sidebar"
import StandupCard from "../components/StandupCard"
import { useGetStandupsQuery, useGetTeamMembersQuery } from "../store/standupsApi"
import { useEffect, useState } from "react"
import StandupForm from "../components/StandupForm"
import { FaCalendarAlt, FaExclamationTriangle, FaFilter, FaSort, FaUser } from "react-icons/fa"
import { FiLoader } from "react-icons/fi"

function Standups() {
    const [filters, setFilters] = useState({})
    const { data: standups, isLoading, isFetching } = useGetStandupsQuery()
    const { data: users } = useGetTeamMembersQuery()
    const [modalOpen, setModalOpen] = useState(false)
    const [listStandups, setListStandups] = useState([])
    const [allStandups, setAllStandups] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("");
    const [itemsPerPage] = useState(10)
    const [paginatedStandups, setPaginatedStandups] = useState([])
    const [showFilters, setShowFilters] = useState(false)
    const totalPages = Math.ceil(listStandups?.length / itemsPerPage);   
    useEffect(() => {
        setAllStandups(standups)
        setListStandups(standups)
    }, [standups])

    useEffect(() => {
        const startIdx = (currentPage - 1) * itemsPerPage
        const endIdx = startIdx + itemsPerPage
        setPaginatedStandups(listStandups?.slice(startIdx, endIdx))
    }, [listStandups, currentPage])
    
    function applyFilters() {
        let result = [...(standups || [])]

        if (filters.length == 0) return;

        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate)
            const end = new Date(filters.endDate)

            if (end < start) {
                alert("End date cannot be earlier than start date")
                return
            }
        }

        if (filters.user) {
            result = result.filter(s => s.userId === filters.user)
        }

        if (filters.startDate) {
            result = result.filter(s => s.date >= filters.startDate)
        }

        if (filters.endDate) {
            result = result.filter(s => s.date <= filters.endDate)
        }

        if (filters.blockers === "yes") {
            result = result.filter(s => s.blockers?.trim() !== "")
        }
        if (filters.blockers === "no") {
            result = result.filter(s => !s.blockers?.trim())
        }

        if (filters.sort === "date_asc") {
            result.sort((a, b) => new Date(a.date) - new Date(b.date))
        }
        if (filters.sort === "date_desc") {
            result.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
        if (filters.sort === "user_asc") {
            result.sort((a, b) => a.userName.localeCompare(b.userName))
        }
        if (filters.sort === "user_desc") {
            result.sort((a, b) => b.userName.localeCompare(a.userName))
        }
        if (filters.sort === "time_asc") {
            result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        }
        if (filters.sort === "time_desc") {
            result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        }

        if (search) {
            const sLower = search.toLowerCase();
            result = result.filter(s =>
                s.userName.toLowerCase().includes(sLower) ||
                s.yesterday.toLowerCase().includes(sLower) ||
                s.today.toLowerCase().includes(sLower) ||
                (s.blockers && s.blockers.toLowerCase().includes(sLower))
            )
        }

        setListStandups(result)
        setShowFilters(false)
        setCurrentPage(1)
    }
    useEffect(() => {
        if (!allStandups) return

        let result = [...allStandups]
        if (filters.user) result = result.filter(s => s.userId === filters.user)
        if (filters.startDate) result = result.filter(s => s.date >= filters.startDate)
        if (filters.endDate) result = result.filter(s => s.date <= filters.endDate)
        if (filters.blockers === "yes") result = result.filter(s => s.blockers?.trim())
        if (filters.blockers === "no") result = result.filter(s => !s.blockers?.trim())

        if (filters.sort) {
            if (filters.sort === "date_asc") result.sort((a, b) => new Date(a.date) - new Date(b.date))
            if (filters.sort === "date_desc") result.sort((a, b) => new Date(b.date) - new Date(a.date))
            if (filters.sort === "user_asc") result.sort((a, b) => a.userName.localeCompare(b.userName))
            if (filters.sort === "user_desc") result.sort((a, b) => b.userName.localeCompare(a.userName))
            if (filters.sort === "time_asc") result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            if (filters.sort === "time_desc") result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        }
        if (search) {
            const sLower = search.toLowerCase()
            result = result.filter(s =>
                s.userName.toLowerCase().includes(sLower) ||
                s.yesterday.toLowerCase().includes(sLower) ||
                s.today.toLowerCase().includes(sLower) ||
                (s.blockers && s.blockers.toLowerCase().includes(sLower))
            );
        }

        setListStandups(result)
        setCurrentPage(1)
    }, [allStandups, search])
    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex flex-col flex-1 my-4 mx-6">
                    <div className="flex flex-col md:flex-row mb-2 items-center justify-between">
                        <div className="flex items-center mb-4 gap-2">
                            <h1 className="text-2xl md:text-4xl font-bold">Viewing Standups</h1>
                            <span className="text-2xl md:text-4xl font-bold">({listStandups?.length || 0})</span>
                        </div>
                            <div className="flex w-full md:w-auto flex-col md:flex-row md:items-center justify-center md:justify-end gap-2">
                                <button onClick={() => setShowFilters(!showFilters)} className="rounded-lg bg-amber-300 px-4 py-2 hover:bg-orange-500 hover:text-white transition duration-150">
                                    Filter/Sort By
                                </button>
                                <input
                                    id="search"
                                    name="search"
                                    type="search"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>
                    </div>
                    {showFilters &&
                        <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 space-y-6 mb-4">
                            <div className="flex items-center gap-2 text-gray-700 font-semibold text-lg">
                                <FaFilter className="text-blue-500" />
                                Standup Filters
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <FaUser className="text-gray-500" />
                                    Filter by User
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                    value={filters.user || ""}
                                    onChange={(e) => setFilters({ user: e.target.value })}
                                >
                                    <option value="">All Users</option>
                                    {users?.map((u) => (
                                        <option key={u.id} value={u.id}>
                                        {u.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <FaCalendarAlt className="text-gray-500" />
                                    Date Range
                                </label>
                                <div className="flex flex-wrap md:flex-nowrap gap-2">
                                    <input
                                        type="date"
                                        value={filters.startDate || ""}
                                        onChange={(e) =>
                                        setFilters({ ...filters, startDate: e.target.value })
                                        }
                                        className="flex-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                    <input
                                        type="date"
                                        value={filters.endDate || ""}
                                        onChange={(e) =>
                                        setFilters({ ...filters, endDate: e.target.value })
                                        }
                                        className="flex-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <FaExclamationTriangle className="text-yellow-500" />
                                    Has Blockers
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                    value={filters.blockers || ""}
                                    onChange={(e) => setFilters({ ...filters, blockers: e.target.value })}
                                >
                                    <option value="">All</option>
                                    <option value="yes">With Blockers</option>
                                    <option value="no">No Blockers</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <FaSort className="text-purple-500" />
                                    Sort By
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                                    value={filters.sort || ""}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                >
                                    <option value="">Default</option>
                                    <option value="date_asc">Date ↑</option>
                                    <option value="date_desc">Date ↓</option>
                                    <option value="user_asc">User (A–Z)</option>
                                    <option value="user_desc">User (Z–A)</option>
                                    <option value="time_asc">Submission Time ↑</option>
                                    <option value="time_desc">Submission Time ↓</option>
                                </select>
                            </div>
                            <div className="flex justify-between pt-3">
                                <button
                                    onClick={() => setFilters({})}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => applyFilters()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    }
                    {isLoading || isFetching ?
                        <div className="flex items-center justify-center my-auto">
                            <FiLoader className="animate-spin" size={64} />
                        </div>
                    : (!paginatedStandups || paginatedStandups?.length === 0) ?
                        <div className="flex justify-center items-center py-20 text-gray-500 text-lg">
                            No standups found
                        </div>
                    :
                        <div className="grid grid-cols md:grid-cols-2 gap-4">
                            {paginatedStandups?.map((standup, idx) => (
                                <StandupCard key={idx} standup={standup} />
                            ))}
                        </div>
                    }
                    {totalPages > 1 &&
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(p - 1, 1));
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            disabled={currentPage === 1}
                                className={`px-3 py-1 rounded border ${
                                    currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-black text-white"
                                }`}
                            >
                            Prev
                            </button>

                            <span>
                                {currentPage} of {totalPages}
                            </span>

                            <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(p + 1, totalPages));
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded border ${
                                    currentPage === totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-black text-white"
                                }`}
                            >
                            Next
                            </button>
                        </div>
                    }
                    <button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-1 p-4 rounded-full bg-black text-white text-2xl fixed bottom-5 right-5 hover:animate-pulse cursor-pointer">
                        <BiPlus size={32} /> 
                    </button>
                    { modalOpen && <StandupForm setModalOpen={setModalOpen} standups={standups} /> }
                </div>
            </div>
        </>
    )
}

export default Standups