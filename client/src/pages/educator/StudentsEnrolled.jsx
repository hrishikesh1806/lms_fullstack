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
    // Main Container Styling: UPDATED TO DASHBOARD'S GRADIENT (Blue at bottom to Red at top)
    // -------------------------------------------------------------------------
    <div className="min-h-screen flex flex-col items-center md:p-10 p-4"
        style={{
            // Background gradient now matches Dashboard: deep blue at bottom to deep red at top
            backgroundImage: 'linear-gradient(to top, #000041, #410000)'
        }}>
      
      <h1 className="text-2xl font-bold text-white mb-6 max-w-5xl w-full">Enrolled Students</h1> 

      {/* ------------------------------------------------------------------------- */}
      {/* Table Container Styling: Changed to use a translucent card style for consistency */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex flex-col max-w-5xl w-full overflow-x-auto rounded-lg shadow-xl 
                        bg-white/10 backdrop-blur-md border border-white/20 
                       transform hover:scale-[1.01] 
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out">
        
        <table className="table-auto w-full">
          
          {/* Table Header Styling: Changed to use translucent header like Dashboard */}
          <thead className="text-white bg-white/30 border-b border-white/50 text-sm text-left">
            <tr>
              <th className="px-6 py-3 font-semibold text-center hidden sm:table-cell w-[50px]">#</th>
              <th className="px-6 py-3 font-semibold w-1/4">Student Name</th>
              <th className="px-6 py-3 font-semibold w-auto">Project Title</th>
              <th className="px-6 py-3 font-semibold hidden sm:table-cell w-[120px]">Date Enrolled</th>
            </tr>
          </thead>
          
          {/* Table Body Styling: Changed text color and hover color for consistency */}
          <tbody className="text-sm text-gray-200 divide-y divide-white/20">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="hover:bg-white/10 transition-colors duration-150">
                <td className="px-6 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                
                {/* Student Name and Image */}
                <td className="px-6 py-3 flex items-center space-x-3 whitespace-nowrap">
                  <img
                    src={item.student.imageUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-white/50" // Adjusted border color
                  />
                  <span className="font-medium text-white">{item.student.name}</span>
                </td>
                
                {/* Course Title */}
                <td className="px-6 py-3 truncate max-w-[200px]">{item.courseTitle}</td>
                
                {/* Date */}
                <td className="px-6 py-3 text-gray-400 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Optional message for zero enrolments */}
        {enrolledStudents.length === 0 && (
            <p className="p-4 text-center text-white/80 bg-white/10 rounded-b-lg w-full border-t border-white/20">
                No students have enrolled yet.
            </p>
        )}
      </div>
    </div>
  ) : <Loading />
};

export default StudentsEnrolled;