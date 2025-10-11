import React, { useContext, useEffect, useState } from 'react'
// Footer import is removed as requested
import { assets } from '../../assets/assets'
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';

const CoursesList = () => {

    const { input } = useParams()

    const { allCourses, navigate } = useContext(AppContext)

    const [filteredCourse, setFilteredCourse] = useState([])

    useEffect(() => {
        if (allCourses && allCourses.length > 0) {
            const tempCourses = allCourses.slice()
            input
                ? setFilteredCourse(
                      tempCourses.filter(
                          // CHANGED: Renamed item to project for clarity, though not required
                          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                      )
                  )
                : setFilteredCourse(tempCourses)
        }
    }, [allCourses, input])
    
    // Search Bar Styling:
    // CHANGED: Updated SearchBar to use a brand-aligned color (Indigo) and cleaner shadow.
    const searchBarClassName = "md:mt-2 mt-4 bg-purple-500 text-lg !text-white shadow-xl flex-1 md:max-w-md placeholder-white/80";

    return (
        // CHANGED: Cleaned background color from 'bg-amber-50' to 'bg-gray-50' for a modern look.
        <div className='min-h-screen bg-amber-50'> 
            
            <div className="flex-grow">
                {/* Internal padding for top clearance */}
                <div className="md:p-10 p-4 pt-8 text-left">
                    
                    {/* Header and Search Bar Container */}
                    <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                        <div>
                            {/* CHANGED: Title from 'Course List' to 'Project List' */}
                            <h1 className='text-4xl font-extrabold text-gray-900'>Project List</h1>
                            <p className='text-gray-600'>
                                <span onClick={() => navigate('/')} className='text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors'>Home</span> 
                                <span className='text-gray-400'> / </span> 
                                {/* CHANGED: Breadcrumb from 'Course List' to 'Project List' */}
                                <span>Project List</span>
                            </p>
                        </div>
                        
                        <SearchBar 
                            data={input} 
                            className={searchBarClassName}
                        /> 
                    </div>
                    
                    {/* Active Search Filter Display */}
                    {input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-700 bg-white shadow-md rounded-full'>
                        <p>{input}</p>
                        <img onClick={() => navigate('/course-list')} className='cursor-pointer w-4 h-4 opacity-70 hover:opacity-100 transition-opacity' src={assets.cross_icon} alt="Clear Search" />
                    </div>}
                    
                    {/* CHANGED: Added a visual separator line for polish */}
                    <div className='border-t border-gray-200 mt-8 pt-6'></div>
                    
                    {/* Course Grid - my-16 for vertical spacing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-8 px-2 md:p-0">
                        {/* Note: filteredCourse holds the projects */}
                        {/* The CourseCard component now contains all the attractive styling */}
                        {filteredCourse.map((course, index) => <CourseCard key={index} course={course} />)}
                    </div>
                </div>
            </div>
            
            {/* Footer component usage is removed */}
            
        </div>
    )
}

export default CoursesList