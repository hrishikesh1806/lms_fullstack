import React, { useContext, useEffect, useState } from 'react';

import Footer from '../../components/student/Footer';

import { assets } from '../../assets/assets';

import { useParams } from 'react-router-dom';

import axios from 'axios';

import { AppContext } from '../../context/AppContext';

import { toast } from 'react-toastify';

import humanizeDuration from 'humanize-duration'

import YouTube from 'react-youtube';

import Loading from '../../components/student/Loading';

import BackButton from '../../components/student/BackButton';


const CourseDetails = () => {

  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)

  // userData was removed from AppContext and is not used for this simple logic
  const { backendUrl, currency, calculateChapterTime, calculateCourseDuration, calculateRating, calculateNoOfLectures } = useContext(AppContext)


  const fetchCourseData = async () => {
    try {
      // NOTE: Assuming backendUrl is configured correctly in AppContext
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      // Improved error handling
      toast.error(error.response?.data?.message || error.message || "Failed to fetch course data")
    }
  }

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  const enrollCourse = async () => {
    // Dummy enrollment logic (since real enrollment check was removed/broken)
    if (isAlreadyEnrolled) {
      toast.info("You are already enrolled in this course!");
      return;
    }

    toast.success("Enrolling in course...");
    // Simulate API call
    setTimeout(() => {
      setIsAlreadyEnrolled(true); // Assuming successful enrollment
      toast.success("Enrollment successful!");
    }, 1500);
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  // The broken useEffect that relied on userData is intentionally removed/commented out
  // to prevent runtime errors after the Educator logic was reverted.


  return courseData ? (
    <>
      {/* Background: Reverting to a subtle gradient for professionalism */}
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-br from-indigo-50/70 via-blue-50/90 to-cyan-50/70"></div>

      {/* Back Button Container */}
      <div className='md:px-36 px-8 pt-8 text-left'>
        <BackButton />
      </div>

      {/* Main Content Layout */}
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-10 pt-4 text-left pb-16">

        <div className="max-w-xl z-10 text-gray-700">
          <h1 className="md:text-4xl text-3xl font-extrabold text-gray-900 leading-tight">
            {courseData.courseTitle}
          </h1>
          <p className="pt-3 md:text-lg text-base text-gray-600" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}>
          </p>

          {/* Enhanced Rating and Enrollment Section */}
          <div className='flex items-center space-x-4 pt-4 pb-2 text-sm'>
            <div className='flex items-center gap-1 text-yellow-600 font-semibold'>
              <p className='text-base'>{calculateRating(courseData)}</p>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt=''
                  className='w-4 h-4' />
                ))}
              </div>
            </div>
            <p className='text-blue-700 font-medium'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>
            <div className='h-4 w-px bg-gray-300'></div>
            <p className='text-gray-600'>**{courseData.enrolledStudents.length}** {courseData.enrolledStudents.length > 1 ? 'students enrolled' : 'student enrolled'}</p>
          </div>

          <p className='text-md mt-1'>Project by <span className='text-blue-600 font-semibold'>{courseData.educator.name}</span></p>

          {/* Project Highlights Card - Structured information */}
          <div className='border border-gray-200 bg-white p-6 rounded-lg shadow-md mt-8'>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Highlights</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <img src={assets.time_clock_icon} alt="clock icon" className='w-5 h-5 text-indigo-500' />
                <p className='text-sm md:text-base'>**Total Duration:** {calculateCourseDuration(courseData)}</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.lesson_icon} alt="lesson icon" className='w-5 h-5 text-indigo-500' />
                <p className='text-sm md:text-base'>**Total Lectures:** {calculateNoOfLectures(courseData)}</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.star} alt="star icon" className='w-5 h-5 text-indigo-500' />
                <p className='text-sm md:text-base'>**Certificate:** Included</p>
              </div>
              <div className="flex items-center gap-2">
                <img src={assets.down_arrow_icon} alt="download icon" className='w-5 h-5 text-indigo-500' />
                <p className='text-sm md:text-base'>**Resources:** Downloadable</p>
              </div>
            </div>
          </div>


          <div className="pt-12 text-gray-800">
            <h2 className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 mb-6">Project Structure</h2>
            <div className="pt-2">
              {courseData.courseContent.map((chapter, index) => (
                // Enhanced Accordion Styling
                <div key={index} className="border border-gray-200 bg-white mb-3 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer select-none bg-gray-50 hover:bg-gray-100"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={assets.down_arrow_icon} alt="arrow icon" className={`w-4 h-4 text-indigo-600 transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} />
                      <p className="font-semibold md:text-base text-sm text-gray-800">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm text-gray-500">{chapter.chapterContent.length} lectures | {calculateChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-[500px]" : "max-h-0"}`} >
                    <ul className="md:pl-12 pl-6 pr-4 py-3 text-gray-600 border-t border-gray-200 divide-y divide-gray-100">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-center justify-between py-2.5">
                          <div className="flex items-center gap-3 text-sm md:text-base">
                            <img src={assets.play_icon} alt="play icon" className="w-4 h-4 text-green-600" />
                            <p className='text-gray-700'>{lecture.lectureTitle}</p>
                          </div>
                          <div className='flex gap-4 items-center text-xs text-gray-500'>
                            {lecture.isPreviewFree && <p onClick={() => setPlayerData({
                              videoId: lecture.lectureUrl.split('/').pop()
                            })} className='text-blue-500 cursor-pointer font-medium hover:text-blue-700 transition'>Preview</p>}
                            <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 mb-6">Full Project Description</h3>
            <p className="rich-text pt-3 text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
            </p>
          </div>
        </div>

        {/* Sticky Purchase Card - Clear separation and strong visual hierarchy */}
        <div className="max-w-course-card z-20 shadow-xl rounded-lg overflow-hidden bg-white min-w-[300px] sm:min-w-[420px] md:sticky md:top-10 transition-shadow duration-300">
          {
            playerData
              ? <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />
              : <img src={courseData.courseThumbnail} alt="Course Thumbnail" className='w-full aspect-video object-cover' />
          }
          <div className="p-6">
            {/* Limited Time Offer */}
            <div className="flex items-center gap-2 mb-4 p-2 bg-red-50 rounded-md border border-red-200">
              <img className="w-4 h-4" src={assets.time_left_clock_icon} alt="time left clock icon" />
              <p className="text-red-600 font-medium text-sm">
                <span className="font-bold">5 days</span> left at this introductory price!
              </p>
            </div>

            {/* Price Block - Highly visible */}
            <div className="flex gap-3 items-baseline pt-1 pb-4">
              <p className="text-gray-900 md:text-5xl text-3xl font-extrabold">{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
              <p className="md:text-lg text-gray-500 line-through">{currency}{courseData.coursePrice}</p>
              <p className="md:text-lg text-green-600 font-semibold">{courseData.discount}% off</p>
            </div>

            {/* Enroll Button - Primary action color */}
            <button onClick={enrollCourse} className={`md:mt-4 mt-3 w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-300 ${isAlreadyEnrolled ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"}`}>
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            {/* What you'll get - Checkmark icons for clarity */}
            <div className="pt-8">
              <p className="md:text-xl text-lg font-bold text-gray-900 mb-3">What you'll get:</p>
              <ul className="space-y-3 text-sm md:text-base text-gray-600">
                <li className='flex items-start gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Lifetime access with free updates.
                </li>
                <li className='flex items-start gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Step-by-step, hands-on project guidance.
                </li>
                <li className='flex items-start gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Downloadable resources and source code.
                </li>
                <li className='flex items-start gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quizzes to test your knowledge.
                </li>
                <li className='flex items-start gap-3'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  **Certificate** of completion.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
};


export default CourseDetails;