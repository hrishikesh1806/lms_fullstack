import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { Line } from 'rc-progress';

const MyEnrollments = () => {

    const { userData, enrolledCourses, fetchUserEnrolledCourses, navigate, backendUrl, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext)

    const [progressArray, setProgressData] = useState([])

    const getCourseProgress = async () => {
        try {
            const token = await getToken();

            // Use Promise.all to handle multiple async operations
            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/get-course-progress`,
                        { courseId: course._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    // Calculate total lectures
                    let totalLectures = calculateNoOfLectures(course);

                    const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
                    return { totalLectures, lectureCompleted };
                })
            );

            setProgressData(tempProgressArray);
        } catch (error) {
            // Assuming toast is available globally or imported
            // If toast is not imported, you might want to use console.error or similar
            // toast.error(error.message); 
            console.error(error.message);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUserEnrolledCourses()
        }
    }, [userData])

    useEffect(() => {

        if (enrolledCourses.length > 0) {
            getCourseProgress()
        }

    }, [enrolledCourses])

    return (
        // -------------------------------------------------------------------------
        // MODIFIED: Background Gradient (Dark Blue at top, Dark Red at bottom, blending in the middle)
        // -------------------------------------------------------------------------
        <div 
            className='min-h-screen'
            // Darkest Blue (#000041) at the top, Darkest Red (#410000) at the bottom
            style={{ backgroundImage: 'linear-gradient(to top, #000041, #410000)' }}
        > 
            <div className='md:px-36 px-8 pt-10'>

                <h1 className='text-2xl font-bold text-white mb-6'>My Enrollments</h1>

                {/* ------------------------------------------------------------------------- */}
                {/* Table Container Styling: Increased transparency slightly for better contrast */}
                {/* ------------------------------------------------------------------------- */}
                <div className="flex flex-col w-full overflow-x-auto rounded-lg shadow-xl 
                                bg-white/10 
                                backdrop-blur-md
                                transform hover:scale-[1.01] 
                                hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] 
                                transition-all duration-300 ease-in-out mt-10">

                    <table className="table-auto w-full">
                        
                        {/* ------------------------------------------------------------------------- */}
                        {/* Table Header with transparent white background (bg-white/30) */}
                        {/* ------------------------------------------------------------------------- */}
                        <thead className="text-white bg-white/30 border-b border-white/50 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3 font-semibold truncate">Project</th>
                                <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Duration</th>
                                <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Completed</th>
                                <th className="px-4 py-3 font-semibold truncate">Status</th>
                            </tr>
                        </thead>

                        <tbody className="text-white divide-y divide-white/20">
                            {enrolledCourses.map((course, index) => (
                                <tr key={index} className="border-b border-white/20 hover:bg-white/20 transition-colors duration-150">
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 ">
                                        <img src={course.courseThumbnail} alt="" className="w-14 sm:w-24 md:w-28" />
                                        <div className='flex-1'>
                                            {/* Course title text color to white */}
                                            <p className='mb-1 max-sm:text-sm text-white font-medium'>{course.courseTitle}</p>
                                            {/* Changed Progress Bar color to a neutral white/gray to work with both red and blue */}
                                            <Line 
                                                className='bg-white/50 rounded-full' 
                                                strokeWidth={2} 
                                                percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures : 0} 
                                                // Neutral color for progress bar
                                                strokeColor="#a0a0a0" 
                                            />
                                        </div>
                                    </td>
                                    {/* Table Data text colors changed to white */}
                                    <td className="px-4 py-3 max-sm:hidden">{calculateCourseDuration(course)}</td>
                                    <td className="px-4 py-3 max-sm:hidden">
                                        {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}
                                        <span className='text-xs ml-2'>Lectures</span>
                                    </td>
                                    <td className="px-4 py-3 max-sm:text-right">
                                        {/* Action button kept distinct for functionality */}
                                        <button onClick={() => navigate('/player/' + course._id)} className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white rounded-md hover:bg-blue-700 transition-colors duration-200'>
                                            {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'Completed' : 'On Going'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Message for zero enrollments */}
                {enrolledCourses.length === 0 && (
                    <p className="p-10 text-center text-white bg-white/20 rounded-lg w-full shadow-xl mt-10">
                        You have not enrolled in any project yet.
                    </p>
                )}

            </div>
        </div>
    )
}

export default MyEnrollments