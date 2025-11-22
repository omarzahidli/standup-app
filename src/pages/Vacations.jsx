import { BiPlus } from "react-icons/bi"
import Sidebar from "../components/Sidebar"
import VacationCard from "../components/VacationCard"
import { useGetVacationsQuery } from "../store/standupsApi"
import { useState } from "react"
import VacationForm from "../components/VacationForm"
import { FiLoader } from "react-icons/fi"

function Vacations() {
    const { data: vacations, isLoading, isFetching } = useGetVacationsQuery()
    const [modalOpen, setModalOpen] = useState(false)
    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex flex-col flex-1 my-4 mx-6">
                    <div className="flex justify-center items-center mb-4 gap-2">
                        <h1 className="text-2xl md:text-4xl font-bold">Viewing Vacations</h1>
                        <span className="text-2xl md:text-4xl font-bold">({vacations?.length || 0})</span>
                    </div>
                    {isLoading || isFetching ? 
                        <div className="flex items-center justify-center my-auto">
                            <FiLoader className="animate-spin" size={64} />
                        </div>
                    :(!vacations || vacations?.length === 0) ? 
                        <div className="flex justify-center items-center py-20 text-gray-500 text-lg">
                            No vacations found
                        </div>
                    :
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vacations?.map((vacation,idx) => (
                                <VacationCard key={idx} vacation={vacation} />
                            ))}
                        </div>
                    }
                    <button onClick={() => setModalOpen(true)} className="flex items-center justify-center gap-1 p-4 rounded-full bg-black text-white text-2xl fixed bottom-5 right-5 hover:animate-pulse cursor-pointer">
                        <BiPlus size={32} /> 
                    </button>
                    { modalOpen && <VacationForm setModalOpen={setModalOpen} vacations={vacations} /> }
                </div>
            </div>
        </>
    )
}

export default Vacations