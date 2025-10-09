import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {

  const { backendUrl, getToken, isEducator } = useContext(AppContext)

  const [enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-students',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        // Ensure purchaseDate is available for sorting/display
        setEnrolledStudents(data.enrolledStudents.reverse())
      } else {
        toast.success(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents()
    }
  }, [isEducator])

  return enrolledStudents ? (
    // -------------------------------------------------------------------------
    // Main Container Styling: Applied Dashboard's 'bg-amber-50'
    // -------------------------------------------------------------------------
    <div className="min-h-screen bg-amber-50 flex flex-col items-center md:p-10 p-4">
      
      <h1 className="text-2xl font-bold text-gray-800 mb-6 max-w-5xl w-full">Enrolled Students</h1>

      {/* ------------------------------------------------------------------------- */}
      {/* Table Container Styling: Applied Dashboard's shadow, hover, and white background */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex flex-col max-w-5xl w-full overflow-x-auto rounded-lg shadow-xl bg-white
                       transform hover:scale-[1.01] 
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out">
        
        <table className="table-auto w-full">
          
          {/* Table Header Styling: Applied Dashboard's 'bg-blue-300' and text styles */}
          <thead className="text-gray-700 bg-blue-300 border-b border-gray-200 text-sm text-left">
            <tr>
              <th className="px-6 py-3 font-semibold text-center hidden sm:table-cell w-[50px]">#</th>
              <th className="px-6 py-3 font-semibold w-1/4">Student Name</th>
              <th className="px-6 py-3 font-semibold w-auto">Project Title</th>
              <th className="px-6 py-3 font-semibold hidden sm:table-cell w-[120px]">Date Enrolled</th>
            </tr>
          </thead>
          
          <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="hover:bg-indigo-50/50 transition-colors duration-150">
                <td className="px-6 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                
                {/* Student Name and Image */}
                <td className="px-6 py-3 flex items-center space-x-3 whitespace-nowrap">
                  <img
                    src={item.student.imageUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <span className="font-medium text-gray-800">{item.student.name}</span>
                </td>
                
                {/* Course Title */}
                <td className="px-6 py-3 truncate max-w-[200px]">{item.courseTitle}</td>
                
                {/* Date */}
                <td className="px-6 py-3 text-gray-500 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Optional message for zero enrolments */}
        {enrolledStudents.length === 0 && (
            <p className="p-4 text-center text-gray-500 bg-white rounded-b-lg w-full border-t border-gray-200">
                No students have enrolled yet.
            </p>
        )}
      </div>
    </div>
  ) : <Loading />
};

export default StudentsEnrolled;