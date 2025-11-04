// src/pages/educator/MyCourses.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyCourses = () => {
  const { currency, isEducator, isAdmin, token, backendUrl } = useContext(AppContext);
  const [localEducatorCourses, setLocalEducatorCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      if (!token) return toast.error('No authentication token found');

      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setLocalEducatorCourses(data.courses);
      } else {
        toast.error(data.message || "Failed to fetch educator courses.");
      }
    } catch (error) {
      console.error("Educator course fetch error:", error);
      setLocalEducatorCourses([]);
    }
  };

  useEffect(() => {
    if (isEducator || isAdmin) {
      fetchEducatorCourses();
    } else {
      setLocalEducatorCourses([]);
    }
  }, [isEducator, isAdmin]);

  return localEducatorCourses ? (
    <div
      className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0"
      style={{ backgroundImage: 'linear-gradient(to top, #000041, #410000)' }}
    >
      <div className="w-full">
        <h2 className="pb-5 text-2xl font-semibold text-white">
          My Projects ({localEducatorCourses.length})
        </h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white/10 border border-white/20 shadow-xl backdrop-blur-md hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
          <table className="md:table-auto table-fixed w-full">
            <thead className="text-white bg-white/30 border-b border-white/50 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Projects</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
              </tr>
            </thead>
          </table>

          <div className="w-full max-h-[60vh] overflow-y-auto">
            <table className="md:table-auto table-fixed w-full">
              <tbody className="text-sm text-gray-200">
                {localEducatorCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-white/20 hover:bg-white/10 transition-colors duration-150"
                  >
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <img src={course.courseThumbnail} alt="Course" className="w-16" />
                      <span className="truncate hidden md:block">{course.courseTitle}</span>
                    </td>
                    <td className="px-4 py-3">
                      {currency}{' '}
                      {Math.floor(
                        (course.enrolledStudents?.length || 0) *
                          (course.coursePrice - (course.discount * course.coursePrice) / 100)
                      )}
                    </td>
                    <td className="px-4 py-3">{course.enrolledStudents?.length || 0}</td>
                    <td className="px-4 py-3">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
