import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const CoursesList = () => {

  const { input } = useParams();
  const { allCourses, navigate } = useContext(AppContext);

  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter(
              (item) => item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  // Search bar styling
  const searchBarClassName =
    "md:mt-2 mt-4 bg-white text-black border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 md:max-w-md placeholder-gray-500 transition-all duration-200";

  return (
    <div
      className='min-h-screen'
      style={{ backgroundImage: 'linear-gradient(to top, #00004d, #ADD8E6)' }}
    >
      <div className="flex-grow">
        <div className="md:p-10 p-4 pt-8 text-left">
          {/* Header & Search */}
          <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
            <div>
              <h1 className='text-4xl font-extrabold text-gray-900'>Project List</h1>
              <p className='text-gray-600'>
                <span
                  onClick={() => navigate('/')}
                  className='text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors'
                >
                  Home
                </span>
                <span className='text-gray-400'> / </span>
                <span>Project List</span>
              </p>
            </div>

            <SearchBar data={input} className={searchBarClassName} />
          </div>

          {/* Active Filter Tag */}
          {input && (
            <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-700 bg-white shadow-md rounded-full'>
              <p>{input}</p>
              <img
                onClick={() => navigate('/course-list')}
                className='cursor-pointer w-4 h-4 opacity-70 hover:opacity-100 transition-opacity'
                src={assets.cross_icon}
                alt="Clear Search"
              />
            </div>
          )}

          <div className='border-t border-gray-200 mt-8 pt-6'></div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-8 px-2 md:p-0">
            {filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
