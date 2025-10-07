import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets'; 

const CoursesSection = () => {
    const { allCourses } = useContext(AppContext);

    return (
        <div 
            // MAIN SECTION CONTAINER: High padding kept for visual weight.
            className="relative w-full text-white overflow-hidden py-40 md:py-60 bg-cover bg-center bg-scroll" 
            style={{
                backgroundImage: `url(${assets.CourseSection_bg})`, 
            }}
        >
            {/* 1. OVERLAY LAYER (z-10): Increased darkness and added a subtle gradient for depth */}
            <div className="absolute inset-0 z-10 bg-black/60 bg-gradient-to-t from-black/70 to-black/30"></div> 
            
            {/* 2. CONTENT WRAPPER (z-30) */}
            <div className="relative z-30 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
                
                {/* Header Text: Larger, bolder, more professional font style */}
                <h2 className="text-5xl font-extrabold text-white leading-tight mb-4">
                    Unlock Your Potential. Start Learning Today.
                </h2>
                
                {/* Subtext: Clearer, lighter font */}
                <p className="md:text-xl text-gray-300 font-light max-w-3xl mx-auto mb-16">
                    Discover our exclusive, top-rated courses across coding, design, business, and more, all crafted by industry leaders.
                </p>
                
                {/* Course Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:my-16 my-10 gap-8"> 
                    {allCourses.slice(0, 4).map((course, index) => (
                        <div key={index}>
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
                
                {/* Call-to-Action Button: Larger, more prominent, and professional styling */}
                <Link 
                    to={'/course-list'} 
                    onClick={() => scrollTo(0, 0)}
                    className="
                        mt-10 inline-block 
                        px-10 py-4 
                        rounded-full 
                        bg-orange-600 hover:bg-orange-700 
                        transition duration-300 
                        text-white text-lg font-bold 
                        shadow-lg shadow-orange-600/50 
                        transform hover:scale-[1.02]
                    "
                >
                    Explore All 100+ Courses
                </Link>
            </div>
        </div>
    );
};

export default CoursesSection;