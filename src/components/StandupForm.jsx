import Modal from "../components/Modal"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { useGetTeamMembersQuery, useGetVacationsQuery, useSubmitStandupMutation } from "../store/standupsApi"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { FiLoader } from "react-icons/fi"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

function StandupForm({setModalOpen, standups}) {
    const [submitStandup, { isLoading: isSubmitting }] = useSubmitStandupMutation()
    const { data: users } = useGetTeamMembersQuery()
    const { data: vacations } = useGetVacationsQuery()

    const StandupSchema = Yup.object().shape({
        username: Yup.string().required("Team member is required"),
        yesterday: Yup.string()
            .min(10, "Must be at least 10 characters")
            .max(500, "Max 500 characters")
            .required("Yesterday field is required"),
        today: Yup.string()
            .min(10, "Must be at least 10 characters")
            .max(500, "Max 500 characters")
            .required("Today field is required"),
        blockers: Yup.string()
            .min(10, "Must be at least 10 characters")
            .max(300, "Max 300 characters")
    })
    
    const savedDraft = JSON.parse(localStorage.getItem("standupDraft")) || {
        username: "",
        yesterday: "",
        today: "",
        blockers: "",
    }

    async function handleStandup(values, { resetForm, setSubmitting} ) {
        const today = dayjs().tz("Asia/Baku").format("YYYY-MM-DD")

        const hasSubmittedToday = standups?.some(
            (s) => s.userId === values.username.slice(1) && s.date === today
        )

        if (hasSubmittedToday) {
            toast.error("This team member has already submitted a standup today.")
            return
        }

        const user = users?.find((u) => u.username === values.username)
        const nextId = (standups?.length + 1).toString().padStart(3, "0")

        const payload = {
            id: `standup_${nextId}`,
            userId: user?.id || "",
            userName: user?.name || "",
            date: today,
            timestamp: dayjs().tz("Asia/Baku").format(),
            yesterday: values.yesterday,
            today: values.today,
            blockers: values.blockers,
        }

        const isOnVacation = vacations?.some((vac) => vac.userId === user?.id && dayjs(today).isBetween(dayjs(vac.startDate).startOf("day"), dayjs(vac.endDate).endOf("day"), null, "[]"))

        if (isOnVacation) {
            toast.error("This team member is on vacation and cannot submit a standup today.");
            setSubmitting(false)
            return
        }

        try {
            await submitStandup(payload).unwrap()
            setModalOpen(false)
            resetForm()
            localStorage.removeItem("standupDraft")
            toast.success("Successfully submitted a standup")
        } catch (error) {
            toast.error(error)
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Modal setModalOpen={setModalOpen}>
                <h2 className="text-2xl font-semibold mb-4">New Standup</h2>
                <Formik
                    initialValues={savedDraft}
                    validationSchema={StandupSchema}
                    onSubmit={handleStandup}
                >
                    {({ values, resetForm }) => {
                        useEffect(() => {
                            localStorage.setItem("standupDraft", JSON.stringify(values))
                        }, [values])
                        return(
                            <Form className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Team Member</label>
                                    <Field
                                        as="select"
                                        id="username"
                                        name="username"
                                        className="p-2 w-full rounded-lg border"
                                    >
                                        <option value="" disabled>
                                            Select a username
                                        </option>
                                        {users?.map((u, idx) => (
                                            <option key={idx} value={u.username}>
                                                {u.username}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="username"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="yesterday" className="block text-gray-700 font-medium mb-1">Yesterday</label>
                                    <Field
                                        as="textarea"
                                        id="yesterday"
                                        name="yesterday"
                                        minLength={10}
                                        maxLength={500}
                                        placeholder="What did you do yesterday?"
                                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="yesterday"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="today" className="block text-gray-700 font-medium mb-1">Today</label>
                                    <Field
                                        as="textarea"
                                        id="today"
                                        name="today"
                                        minLength={10}
                                        maxLength={500}
                                        placeholder="What will you do today?"
                                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="today"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="blockers" className="block text-gray-700 font-medium mb-1">Blockers</label>
                                    <Field
                                        as="textarea"
                                        id="blockers"
                                        name="blockers"
                                        minLength={10}
                                        maxLength={300}
                                        placeholder="Any blockers?"
                                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <ErrorMessage
                                        name="blockers"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm()
                                            localStorage.removeItem("standupDraft")
                                            setModalOpen(false)
                                        }}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        {isSubmitting ? <FiLoader className="animate-spin" /> : "Submit"}
                                    </button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </Modal>   
        </>
    )
}

export default StandupForm