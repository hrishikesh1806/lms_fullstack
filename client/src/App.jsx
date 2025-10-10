// App.jsx (Final version with Edit Course feature completely removed)

import React, { useContext } from 'react'
import { Routes, Route, useLocation, useMatch } from 'react-router-dom'
import Navbar from './components/student/Navbar'
import Home from './pages/student/Home'
import CourseDetails from './pages/student/CourseDetails'
import CoursesList from './pages/student/CoursesList'

// --- Educator Component Imports ---
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Educator from './pages/educator/Educator'
// import EditCourse from './components/educator/EditCourse' // <<< REMOVED: Causing the import error
// ----------------------------------

import 'quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from 'react-toastify'
import Player from './pages/student/Player'
import MyEnrollments from './pages/student/MyEnrollments'
import Loading from './components/student/Loading'


const App = () => {

    const isEducatorRoute = useMatch('/educator/*');

    return (
        <div className="text-default min-h-screen bg-white">
            <ToastContainer />
            {!isEducatorRoute && <Navbar />}

            {/* Layout Fix: pt-24 pushes content down to clear the fixed Navbar */}
            <div className="pt-24"> 
                <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Student Routes */}
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/course-list" element={<CoursesList />} />
                    <Route path="/course-list/:input" element={<CoursesList />} />
                    <Route path="/my-enrollments" element={<MyEnrollments />} />
                    <Route path="/player/:courseId" element={<Player />} />
                    <Route path="/loading/:path" element={<Loading />} />
                    
                    {/* === REMOVED: EDIT COURSE ROUTE === */}
                    {/* <Route path="/edit-course/:id" element={<EditCourse />} /> */} 

                    {/* Educator Routes (Nested) */}
                    <Route path='/educator' element={<Educator />}>
                        <Route path='/educator' element={<Dashboard />} />
                        <Route path='add-course' element={<AddCourse />} />
                        <Route path='my-courses' element={<MyCourses />} />
                        <Route path='student-enrolled' element={<StudentsEnrolled />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )
}

export default App