import { FaBars } from "react-icons/fa"
import { Link, useLocation } from "react-router"
import { IoMdClose } from "react-icons/io"
import { useState } from "react"

function Sidebar() {    
    const {pathname} = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const links = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Standups", path: "/standups" },
        { name: "Team", path: "/team" },
        { name: "Vacations", path: "/vacations" },
        { name: "Blockers", path: "/blockers" },
    ]

    return (
        <>
            <aside className="bg-white shadow-md w-64 lg:flex flex-col hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b">
                    <h1 className="text-xl font-bold text-gray-800 capitalize">{pathname.slice(1)}</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {links.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-2 rounded-lg ${
                                pathname === link.path ? "font-bold bg-gray-200" : "text-gray-700"
                            } hover:bg-gray-200`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>
            {!mobileOpen &&
                <div className="lg:hidden fixed top-4 left-4 z-50">
                    <button
                    onClick={() => setMobileOpen(true)}
                    className="bg-white/50 p-2 rounded-md shadow-md"
                    >
                        <FaBars />
                    </button>
                </div>
            }

            <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-40 lg:hidden`}>
                <div className="px-6 py-4 flex items-center justify-between border-b">
                    <h1 className="text-xl font-bold text-gray-800 capitalize">{pathname.slice(1)}</h1>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="text-gray-500"
                    >
                        <IoMdClose />
                    </button>
                </div>
                <nav className="px-4 py-6 space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileOpen(false)}
                            className={`block px-4 py-2 rounded-lg ${
                                pathname === link.path
                                ? "font-bold bg-gray-200"
                                : "text-gray-700"
                            } hover:bg-gray-200`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar