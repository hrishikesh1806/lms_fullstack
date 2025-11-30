import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {
  const { backendUrl, userData } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  // Fetch JWT token directly from localStorage (manual auth system)
  const getToken = () => localStorage.getItem('token');

  const fetchEnrolledStudents = async (courseId = '') => {
    try {
      const token = getToken();
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      const url = courseId
        ? `${backendUrl}/api/educator/enrolled-students?courseId=${courseId}`
        : `${backendUrl}/api/educator/enrolled-students`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        // Sort / reverse for newest first
        setEnrolledStudents(data.enrolledStudents.reverse());
        if (data.courses) {
          setCourses(data.courses);
        }
      } else {
        toast.error(data.message || 'Failed to load enrolled students');
      }
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      toast.error('Failed to fetch enrolled students');
      setEnrolledStudents([]); // prevent null crash
    }
  };

  useEffect(() => {
    // Allow educator and admin to view this page
    if (userData?.role === 'educator' || userData?.role === 'admin') {
      fetchEnrolledStudents();
    } else {
      setEnrolledStudents([]); // empty for students
    }
  }, [userData]);

  // Handle course selection change
  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
    fetchEnrolledStudents(courseId);
  };

  // 🟥 For non-educator/admin users, show restricted access message
  if (userData?.role !== 'educator' && userData?.role !== 'admin') {
    return (
      <div
        className="min-h-screen flex flex-col items-center md:p-10 p-4"
        style={{
          backgroundImage: 'linear-gradient(to top, #000041, #410000)',
        }}
      >
        <h1 className="text-2xl font-bold text-white mb-6 max-w-5xl w-full">
          Enrolled Students
        </h1>
        <div className="flex flex-col max-w-5xl w-full overflow-x-auto rounded-lg shadow-xl
                        bg-white/10 backdrop-blur-md border border-white/20 p-8">
          <p className="text-white text-center">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // 🟦 Main UI for Educator
  return enrolledStudents ? (
    <div
      className="min-h-screen flex flex-col items-center md:p-10 p-4"
      style={{
        backgroundImage: 'linear-gradient(to top, #000041, #410000)',
      }}
    >
      <h1 className="text-2xl font-bold text-white mb-6 max-w-5xl w-full">
        Enrolled Students
      </h1>

      {/* Course Filter Dropdown */}
      {courses.length > 0 && (
        <div className="mb-6 max-w-5xl w-full">
          <label htmlFor="course-select" className="block text-white text-sm font-medium mb-2">
            Filter by Course:
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full md:w-96 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/30
                       text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500
                       focus:border-orange-500 transition-all duration-200"
          >
            <option value="" className="bg-gray-800 text-white">All Courses</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id} className="bg-gray-800 text-white">
                {course.courseTitle}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className="flex flex-col max-w-5xl w-full overflow-x-auto rounded-lg shadow-xl
                    bg-white/10 backdrop-blur-md border border-white/20
                    transform hover:scale-[1.01]
                    hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)}
                    transition-all duration-300 ease-in-out"
      >
        <table className="table-auto w-full">
          <thead className="text-white bg-white/30 border-b border-white/50 text-sm text-left">
            <tr>
              <th className="px-6 py-3 font-semibold text-center hidden sm:table-cell w-[50px]">#</th>
              <th className="px-6 py-3 font-semibold w-1/4">Student Name</th>
              <th className="px-6 py-3 font-semibold w-auto">Project Title</th>
              <th className="px-6 py-3 font-semibold hidden sm:table-cell w-[120px]">Date Enrolled</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-200 divide-y divide-white/20">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="hover:bg-white/10 transition-colors duration-150">
                <td className="px-6 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                <td className="px-6 py-3 flex items-center space-x-3 whitespace-nowrap">
                  <img
                    src={item.student?.imageUrl || '/default-avatar.png'}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-white/50"
                  />
                  <span className="font-medium text-white">{item.student?.name || 'Unknown'}</span>
                </td>
                <td className="px-6 py-3 truncate max-w-[200px]">{item.courseTitle}</td>
                <td className="px-6 py-3 text-gray-400 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {enrolledStudents.length === 0 && (
          <p className="p-4 text-center text-white/80 bg-white/10 rounded-b-lg w-full border-t border-white/20">
            No students have enrolled yet.
          </p>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
