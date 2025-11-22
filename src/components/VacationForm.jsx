import Modal from "../components/Modal"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"
import { useGetTeamMembersQuery, useSubmitVacationMutation } from "../store/standupsApi"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { FiLoader } from "react-icons/fi"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"


dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(utc)
dayjs.extend(timezone)

function VacationForm({setModalOpen, vacations}) {    
    const [submitVacation, { isLoading: isSubmitting }] = useSubmitVacationMutation()
    const { data: users } = useGetTeamMembersQuery()
    
    const vacationSchema = Yup.object().shape({
        userName: Yup.string().required("User is required"),
        startDate: Yup.date()
            .required("Start date is required")
            .min(dayjs().format("YYYY-MM-DD"), "Start date cannot be in the past")
            .max(dayjs().add(1, "year").format("YYYY-MM-DD"), "Start date cannot be more than 1 year ahead"),
        endDate: Yup.date()
            .required("End date is required")
            .test(
                "is-after-start",
                "End date must be after start date",
                function (value) {
                    const { startDate } = this.parent;
                    return dayjs(value).isAfter(dayjs(startDate));
                }
            )
            .max(dayjs().add(1, "year").format("YYYY-MM-DD"), "Start date cannot be more than 1 year ahead"),
        reason: Yup.string()
            .min(5, "Reason must be at least 5 characters"),
    })

    const savedDraft = JSON.parse(localStorage.getItem("vacationDraft")) || {
        userName: "",
        startDate: "",
        endDate: "",
        reason: "",
    }

    async function handleVacation(values, { resetForm, setSubmitting} ) {
        const totalMembers = users?.length || 1
        const nextId = (vacations?.length + 1).toString().padStart(3, "0")
        const user = users?.find((u) => u.username === values.userName)
        const payload = {
            id: `vacation_${nextId}`,
            userId: user?.id || "",
            userName: user?.name|| "",
            startDate: values.startDate,
            endDate: values.endDate,
            reason: values.reason,
            status: "pending"
        }
        const newStart = dayjs(values.startDate)
        const newEnd = dayjs(values.endDate)
        const userVacations = vacations?.filter(v => v.userId === user?.id) || []

        const hasApprovedConflict = userVacations?.some(v => {
            if (v.status !== "approved") return false

            const start = dayjs(v.startDate)
            const end = dayjs(v.endDate)

            return (
                newStart.isSameOrBefore(end) &&
                newEnd.isSameOrAfter(start)
            )
        })

        if (hasApprovedConflict) {
            toast.error("You already have an approved vacation during these dates.")
            setSubmitting(false)
            return
        }

        const hasOverlap = userVacations.some(v => {
            const start = dayjs(v.startDate)
            const end = dayjs(v.endDate)
            return (
                newStart.isSameOrBefore(end) &&
                newEnd.isSameOrAfter(start)
            )
        })

        if (hasOverlap) {
            toast.error("Your vacation dates overlap with another vacation request.")
            setSubmitting(false)
            return
        }

        const overlappingVacations = vacations?.filter(v => {
            if (v.status !== "approved" && v.status !== "pending") return false

            return (
                !dayjs(values.endDate).isBefore(dayjs(v.startDate)) &&
                !dayjs(values.startDate).isAfter(dayjs(v.endDate))
            )
        })

        const vacationRate = overlappingVacations?.length / totalMembers

        if (vacationRate > 0.3) {
            const confirmSubmit = window.confirm(
                `Warning: ${Math.round(vacationRate * 100)}% of the team will be on vacation in this period! Do you want to continue?`
            );
            if (!confirmSubmit) {
                setSubmitting(false)
                return
            }
        }

        try {
            await submitVacation(payload).unwrap()
            setModalOpen(false)
            resetForm()
            localStorage.removeItem("vacationDraft")
            toast.success("Successfully submitted a vacation")
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
                <h2 className="text-2xl font-semibold mb-4">New Vacation</h2>
                <Formik
                    initialValues={savedDraft}
                    validationSchema={vacationSchema}
                    onSubmit={handleVacation}
                >
                    {({ values, resetForm }) => {
                        useEffect(() => {
                            localStorage.setItem("vacationDraft", JSON.stringify(values))
                        }, [values])
                        return(
                            <Form className="space-y-4">
                                <div>
                                    <label htmlFor="userName" className="block text-gray-700 font-medium mb-1">Team Member</label>
                                    <Field
                                        as="select"
                                        id="userName"
                                        name="userName"
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
                                        name="userName"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="startDate" className="block font-medium">Start Date</label>
                                    <Field
                                        id="startDate"
                                        type="date"
                                        name="startDate"
                                        className="w-full p-2 border rounded"
                                    />
                                    <ErrorMessage
                                        name="startDate"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block font-medium">End Date</label>
                                    <Field
                                        id="endDate"
                                        type="date"
                                        name="endDate"
                                        className="w-full p-2 border rounded"
                                    />
                                    <ErrorMessage
                                        name="endDate"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="reason" className="block font-medium">Reason</label>
                                    <Field
                                        id="reason"
                                        as="textarea"
                                        name="reason"
                                        className="w-full p-2 border rounded"
                                        rows={3}
                                    />
                                    <ErrorMessage
                                        name="reason"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm();
                                            localStorage.removeItem("vacationDraft");
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

export default VacationForm