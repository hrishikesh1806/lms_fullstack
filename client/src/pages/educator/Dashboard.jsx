import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {

  const { backendUrl, isEducator, currency, getToken } = useContext(AppContext)

  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {

      const token = await getToken()

      const { data } = await axios.get(backendUrl + '/api/educator/dashboard',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {

    if (isEducator) {
      fetchDashboardData()
    }

  }, [isEducator])

  // Removed the static studentsData array as it's not being used in the return block

  return dashboardData ? (
    // -----------------------------------------------------------------------------------
    // Main Container Styling: CHANGED bg-gray-50 to bg-amber-50 for a warm, skin-color/beige look
    // -----------------------------------------------------------------------------------
    <div className='min-h-screen bg-amber-50 flex flex-col items-start gap-10 md:p-10 p-4'>
      
      {/* ----------------------------------------------------------------------------- */}
      {/* METRIC CARDS SECTION */}
      {/* ----------------------------------------------------------------------------- */}
      <div className='w-full'>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Educator Dashboard</h1>
        
        <div className='flex flex-wrap gap-6 items-center'>
          
          {/* Card 1: Total Enrolments */}
          {/* Cleaned up styling: used a light background, border removal, better shadow */}
           <div className='flex items-center gap-4 bg-red-200 p-6 w-72 rounded-xl 
                       shadow-xl 
                       transform hover:scale-[1.03] 
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out'>
            <img src={assets.patients_icon} alt="Enrolments Icon" className='w-10 h-10 filter brightness-90 saturate-200 hue-rotate-200 text-indigo-500'/>
            <div>
              <p className='text-3xl font-bold text-indigo-600'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-sm text-gray-500'>Total Enrollments</p>
            </div>
          </div>
          {/* Card 2: Total Courses */}
          <div className='flex items-center gap-4 bg-violet-200 p-6 w-72 rounded-xl 
                       shadow-xl 
                       transform hover:scale-[1.03] 
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out'>
            <img src={assets.appointments_icon} alt="Courses Icon" className='w-10 h-10 filter brightness-90 saturate-200 hue-rotate-200 text-indigo-500'/>
            <div>
              <p className='text-3xl font-bold text-indigo-600'>{dashboardData.totalCourses}</p>
              <p className='text-sm text-gray-500'>Total Projects</p>
            </div>
          </div>
          
          {/* Card 3: Total Earnings */}
          <div className='flex items-center gap-4 bg-orange-200 p-6 w-72 rounded-xl 
                       shadow-xl 
                       transform hover:scale-[1.03] 
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out'>
            <img src={assets.earning_icon} alt="Earnings Icon" className='w-10 h-10 filter brightness-90 saturate-200 hue-rotate-200 text-indigo-500'/>
            <div>
              {/* Used toLocaleString for better currency formatting */}
              <p className='text-3xl font-bold text-green-600'>
                {currency}{Math.floor(dashboardData.totalEarnings).toLocaleString()}
              </p>
              <p className='text-sm text-gray-500'>Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------------- */}
      {/* LATEST ENROLMENTS TABLE SECTION */}
      {/* ----------------------------------------------------------------------------- */}
      <div className='w-full'>
        <h2 className="pb-4 text-xl font-semibold text-gray-700">Latest Enrollments</h2>
        
        {/* Table Container: Clean background, removed harsh border, added shadow */}
        <div className="flex flex-col max-w-5xl w-full overflow-x-auto rounded-lg shadow-xl bg-white
                       transform hover:scale-[1.03] 
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out">
          <table className="table-auto w-full">
            
            {/* Table Header: Darker text, better background for contrast */}
            <thead className="text-gray-700 bg-blue-300 border-b border-gray-200 text-sm text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-center hidden sm:table-cell w-[50px]">#</th>
                <th className="px-6 py-3 font-semibold w-1/4">Student Name</th>
                <th className="px-6 py-3 font-semibold w-auto">Project Title</th>
                <th className="px-6 py-3 font-semibold hidden md:table-cell w-[120px] text-right">Enrolled Date</th>
              </tr>
            </thead>
            
            <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className="hover:bg-indigo-50/50 transition-colors duration-150">
                  
                  {/* Index */}
                  <td className="px-6 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                  
                  {/* Student Name */}
                  <td className="px-6 py-3 flex items-center space-x-3 whitespace-nowrap">
                    <img
                      src={item.student.imageUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                    <span className="font-medium text-gray-800">{item.student.name}</span>
                  </td>
                  
                  {/* Course Title */}
                  <td className="px-6 py-3 truncate max-w-[250px]">{item.courseTitle}</td>
                  
                  {/* Enrolled Date (Placeholder/Example implementation - assuming your API doesn't provide it yet) */}
                  <td className="px-6 py-3 text-sm text-gray-400 hidden md:table-cell text-right">
                    {item.enrolledDate || 'N/A'}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Optional message for zero enrolments */}
        {dashboardData.enrolledStudentsData.length === 0 && (
            <p className="p-4 text-center text-gray-500 bg-white rounded-b-lg max-w-5xl w-full border-t border-gray-200  shadow-xl 
                       transform hover:scale-[1.03] 
                       hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                       transition-all duration-300 ease-in-out">
                No recent enrollments found.
            </p>
            
        )}
      </div>
    </div>
  ) : <Loading />
}

export default Dashboard