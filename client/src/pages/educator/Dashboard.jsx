// client/src/pages/educator/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  const { backendUrl, isEducator, isAdmin, currency, token } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (!token) {
        setLoading(false);
        return toast.error('No authentication token found');
      }

      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        if (isAdmin) {
          setDashboardData({
            enrolledStudentsData: [],
            totalCourses: 0,
            totalEarnings: 0,
          });
        } else {
          toast.error(data.message || 'Failed to fetch dashboard data');
        }
      }
    } catch (error) {
      if (isAdmin) {
        setDashboardData({
          enrolledStudentsData: [],
          totalCourses: 0,
          totalEarnings: 0,
        });
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator || isAdmin) fetchDashboardData();
  }, [isEducator, isAdmin]);

  if (loading || !dashboardData) return <Loading />;

  return (
    <div
      className="min-h-screen flex flex-col items-start gap-10 md:p-10 p-4"
      style={{
        backgroundImage: 'linear-gradient(to top, #000041, #410000)',
      }}
    >
      {/* Header */}
      <div className="w-full">
        <h1 className="text-2xl font-bold text-white mb-6">
          {isAdmin ? 'Admin Dashboard' : 'Educator Dashboard'}
        </h1>

        {/* Cards */}
        <div className="flex flex-wrap gap-6 items-center">
          {/* Total Enrollments */}
          <div className="flex items-center gap-4 bg-white/10 p-6 w-72 rounded-xl backdrop-blur-md shadow-xl transform hover:scale-[1.03] transition-all duration-300">
            <img src={assets.patients_icon} alt="Enrollments Icon" className="w-10 h-10" />
            <div>
              <p className="text-3xl font-bold text-yellow-300">
                {dashboardData.enrolledStudentsData?.length || 0}
              </p>
              <p className="text-sm text-gray-200">Total Enrollments</p>
            </div>
          </div>

          {/* Total Courses */}
          <div className="flex items-center gap-4 bg-white/10 p-6 w-72 rounded-xl backdrop-blur-md shadow-xl transform hover:scale-[1.03] transition-all duration-300">
            <img src={assets.appointments_icon} alt="Courses Icon" className="w-10 h-10" />
            <div>
              <p className="text-3xl font-bold text-yellow-300">{dashboardData.totalCourses}</p>
              <p className="text-sm text-gray-200">Total Projects</p>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="flex items-center gap-4 bg-white/10 p-6 w-72 rounded-xl backdrop-blur-md shadow-xl transform hover:scale-[1.03] transition-all duration-300">
            <img src={assets.earning_icon} alt="Earnings Icon" className="w-10 h-10" />
            <div>
              <p className="text-3xl font-bold text-green-400">
                {currency}
                {Math.floor(dashboardData.totalEarnings || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-200">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Enrollments Table */}
      <div className="w-full">
        <h2 className="pb-4 text-xl font-semibold text-white">Latest Enrollments</h2>

        <div className="flex flex-col max-w-5xl w-full overflow-x-auto rounded-lg shadow-xl bg-white/10 backdrop-blur-md transform hover:scale-[1.03] transition-all duration-300">
          <table className="table-auto w-full">
            <thead className="text-white bg-white/30 border-b border-white/50 text-sm text-left">
              <tr>
                <th className="px-6 py-3 font-semibold text-center hidden sm:table-cell w-[50px]">#</th>
                <th className="px-6 py-3 font-semibold w-1/4">Student Name</th>
                <th className="px-6 py-3 font-semibold w-auto">Project Title</th>
                <th className="px-6 py-3 font-semibold hidden md:table-cell w-[120px] text-right">
                  Enrolled Date
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-200 divide-y divide-white/20">
              {dashboardData.enrolledStudentsData?.length > 0 ? (
                dashboardData.enrolledStudentsData.map((item, index) => (
                  <tr key={index} className="hover:bg-white/10 transition-colors duration-150">
                    <td className="px-6 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                    <td className="px-6 py-3 flex items-center space-x-3 whitespace-nowrap">
                      <img
                        src={item.student?.imageUrl || assets.default_profile}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-white/50"
                      />
                      <span className="font-medium text-white">{item.student?.name || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-3 truncate max-w-[250px]">{item.courseTitle || 'N/A'}</td>
                    <td className="px-6 py-3 text-sm text-gray-400 hidden md:table-cell text-right">
                      {item.enrolledDate || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-white/80">
                    No recent enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
