import { FiAlertCircle } from "react-icons/fi"
import { Link } from "react-router"
import Sidebar from "../components/Sidebar"

function Error() {
  return (

    <>
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col gap-4 flex-1 my-4 mx-6 justify-center items-center">
                <h1 className="text-2xl md:text-4xl font-bold uppercase text-center">Page not found 404</h1>
                <FiAlertCircle className="text-red-500 text-6xl mx-auto mb-4" />
                <Link
                    to="/"
                    className="text-center inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    </>
  )
}

export default Error