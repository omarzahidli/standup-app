import { IoMdClose } from "react-icons/io"

function Modal({children, setModalOpen}) {
    return (
        <div className="flex fixed top-0 left-0 justify-center items-center h-screen w-full bg-black/50">
            <div className="bg-white rounded-xl p-6 min-w-[90%] md:min-w-[60%] overflow-auto max-h-[90%]">
                <div className="flex justify-end">
                    <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white rounded-xl p-2 hover:bg-red-700 cursor-pointer">
                        <IoMdClose size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal