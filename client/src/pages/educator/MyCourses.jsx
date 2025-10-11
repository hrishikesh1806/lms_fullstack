// src/pages/educator/MyCourses.jsx (Reverted/Initial)

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets'; 
import axios from 'axios';
import { toast } from 'react-toastify';

const MyCourses = () => {

  const { currency, isEducator, getToken, backendUrl } = useContext(AppContext);
  // Using local state and fetch, as the global state was not initially present for educator courses
  const [localEducatorCourses, setLocalEducatorCourses] = useState(null); 

  // Function to Fetch Educator's Specific Courses (as it likely was before global context change)
  const fetchEducatorCourses = async () => {
    try {
        const token = await getToken()

        const { data } = await axios.get(backendUrl + '/api/educator/courses', 
            { headers: { Authorization: `Bearer ${token}` } }
        )

        if (data.success) {
            setLocalEducatorCourses(data.courses) // Update local state
        } else {
            toast.error(data.message || "Failed to fetch educator courses.")
        }

    } catch (error) {
        console.error("Educator course fetch error:", error)
        // toast.error(error.message) 
    }
  }

  useEffect(() => {
    if (isEducator) {
        fetchEducatorCourses();
    }
  }, [isEducator]); 

  // Using the local state for rendering
  return localEducatorCourses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-amber-50" >
      <div className='w-full'>
        <h2 className="pb-5 text-2xl font-semibold">My Projects</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-red-200 border border-gray-500/20  shadow-xl   
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       " >
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Projects</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
                {/* Removed Action Column */}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {localEducatorCourses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img src={course.courseThumbnail} alt="Course Image" className="w-16" />
                    <span className="truncate hidden md:block">{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3">{currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))}</td>
                  <td className="px-4 py-3">{course.enrolledStudents.length}</td>
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                  {/* Removed Delete Action Cell */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : <Loading />
};

export default MyCourses;