import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()
    const { getToken } = useAuth()
    const { user } = useUser()

    const [showLogin, setShowLogin] = useState(false)
    const [isEducator,setIsEducator] = useState(false)
    const [allCourses, setAllCourses] = useState([])
    const [userData, setUserData] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])

    // Fetch All Courses
    const fetchAllCourses = async () => { 
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');
            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch UserData (Crucial for setting isEducator state)
    const fetchUserData = async () => {
        try {
            // CRITICAL CHECK: Only set to TRUE if explicitly 'educator'. Otherwise, FALSE.
            if (user?.publicMetadata?.role === 'educator') {
                setIsEducator(true)
            } else {
                setIsEducator(false) 
            }

            const token = await getToken();

            const { data } = await axios.get(backendUrl + '/api/user/data',
                { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
            } else (
                toast.error(data.message)
            )

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        const token = await getToken();
        const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses',
            { headers: { Authorization: `Bearer ${token}` } })

        if (data.success) {
            setEnrolledCourses(data.enrolledCourses.reverse())
        } else (
            toast.error(data.message)
        )
    }

    // Utility Functions (kept for context)
    const calculateChapterTime = (chapter) => { /* ... */ }
    const calculateCourseDuration = (course) => { /* ... */ }
    const calculateRating = (course) => { /* ... */ }
    const calculateNoOfLectures = (course) => { /* ... */ }
    

    useEffect(() => {
        fetchAllCourses()
    }, [])

    // Fetch User's Data if User is Logged In
    useEffect(() => {
        if (user) { 
            fetchUserData()
            fetchUserEnrolledCourses()
        } else {
            // CRITICAL: Force reset the role status when user logs out
            setIsEducator(false);
        }
    }, [user])

    const value = {
        showLogin, setShowLogin,
        backendUrl, currency, navigate,
        userData, setUserData, getToken,
        allCourses, fetchAllCourses,
        enrolledCourses, fetchUserEnrolledCourses,
        calculateChapterTime, calculateCourseDuration,
        calculateRating, calculateNoOfLectures,
        isEducator,setIsEducator
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}