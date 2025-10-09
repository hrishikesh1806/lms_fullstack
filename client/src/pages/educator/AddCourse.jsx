import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios'
import { AppContext } from '../../context/AppContext';

const AddCourse = () => {

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    // MODIFIED: Destructure fetchAllCourses from AppContext
    const { backendUrl, getToken, fetchAllCourses } = useContext(AppContext)

    const [courseTitle, setCourseTitle] = useState('')
    const [coursePrice, setCoursePrice] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [image, setImage] = useState(null)
    const [chapters, setChapters] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentChapterId, setCurrentChapterId] = useState(null);
    const [lectureDetails, setLectureDetails] = useState({
        lectureTitle: '',
        lectureDuration: '',
        lectureUrl: '',
        isPreviewFree: false,
    });

    const handleChapter = (action, chapterId) => {
        if (action === 'add') {
            const title = prompt('Enter Chapter Name:');
            if (title) {
                const newChapter = {
                    chapterId: uniqid(),
                    chapterTitle: title,
                    chapterContent: [],
                    collapsed: false,
                    chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
                };
                setChapters([...chapters, newChapter]);
            }
        } else if (action === 'remove') {
            setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
        } else if (action === 'toggle') {
            setChapters(
                chapters.map((chapter) =>
                    chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
                )
            );
        }
    };

    const handleLecture = (action, chapterId, lectureIndex) => {
        if (action === 'add') {
            setCurrentChapterId(chapterId);
            setShowPopup(true);
        } else if (action === 'remove') {
            setChapters(
                chapters.map((chapter) => {
                    if (chapter.chapterId === chapterId) {
                        chapter.chapterContent.splice(lectureIndex, 1);
                    }
                    return chapter;
                })
            );
        }
    };

    const addLecture = () => {
        setChapters(
            chapters.map((chapter) => {
                if (chapter.chapterId === currentChapterId) {
                    const newLecture = {
                        ...lectureDetails,
                        lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
                        lectureId: uniqid()
                    };
                    chapter.chapterContent.push(newLecture);
                }
                return chapter;
            })
        );
        setShowPopup(false);
        setLectureDetails({
            lectureTitle: '',
            lectureDuration: '',
            lectureUrl: '',
            isPreviewFree: false,
        });
    };

    const handleSubmit = async (e) => {
        try {

            e.preventDefault();

            if (!image) {
                toast.error('Thumbnail Not Selected')
                return
            }

            if(chapters.length === 0){
                toast.error('Please add at least one chapter.')
                return
            }

            const courseData = {
                courseTitle,
                courseDescription: quillRef.current.root.innerHTML,
                coursePrice: Number(coursePrice),
                discount: Number(discount),
                courseContent: chapters,
            }

            const formData = new FormData()
            formData.append('courseData', JSON.stringify(courseData))
            formData.append('image', image)

            const token = await getToken()

            const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                toast.success(data.message)

                // ********************** THE FIX **********************
                // Call fetchAllCourses to refresh the global project list state
                await fetchAllCourses();
                // *****************************************************

                setCourseTitle('')
                setCoursePrice(0)
                setDiscount(0)
                setImage(null)
                setChapters([])
                // Clear the rich text editor content
                if(quillRef.current) {
                    quillRef.current.root.innerHTML = ""
                }
            } else (
                toast.error(data.message)
            )

        } catch (error) {
            toast.error(error.message)
        }

    };

    useEffect(() => {
        // Initiate Quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            });
        }
    }, []);

    // Use a different outer container to set the background
    return (
        <div className='min-h-screen bg-amber-50 md:p-10 p-4'>

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Project</h1>

            {/* Main Form Container - Added professional styling */}
            <div className='bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full mx-auto
                            transform hover:scale-[1.01]
                            hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]
                            transition-all duration-300 ease-in-out'>

                <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full text-gray-600'>

                    {/* Course Title */}
                    <div className='flex flex-col gap-2'>
                        <label className='font-medium text-gray-700'>Project Title</label>
                        <input
                            onChange={e => setCourseTitle(e.target.value)}
                            value={courseTitle}
                            type="text"
                            placeholder='e.g., SalesForce Consultant'
                            className='outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-blue-400 transition-colors'
                            required
                        />
                    </div>

                    {/* Course Description (Quill Editor) */}
                    <div className='flex flex-col gap-2'>
                        <label className='font-medium text-gray-700'>Project Description</label>
                        <div ref={editorRef} className="bg-white border border-gray-300 rounded"></div>
                    </div>

                    {/* Price, Discount & Thumbnail */}
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label className='font-medium text-gray-700'>Project Price ($)</label>
                            <input
                                onChange={e => setCoursePrice(e.target.value)}
                                value={coursePrice}
                                type="number"
                                placeholder='0'
                                min={0}
                                className='outline-none py-2.5 w-32 px-3 rounded border border-gray-300 focus:border-blue-400 transition-colors'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label className='font-medium text-gray-700'>Discount %</label>
                            <input
                                onChange={e => setDiscount(e.target.value)}
                                value={discount}
                                type="number"
                                placeholder='0'
                                min={0}
                                max={100}
                                className='outline-none py-2.5 w-32 px-3 rounded border border-gray-300 focus:border-blue-400 transition-colors'
                                required
                            />
                        </div>

                        <div className='flex flex-col items-center gap-3 mt-2'>
                            <label className='font-medium text-gray-700'>Project Thumbnail</label>
                            <label htmlFor='thumbnailImage' className='flex items-center gap-3 cursor-pointer p-2 rounded-lg border-2 border-dashed border-blue-300 hover:bg-blue-50 transition-colors'>
                                <img src={assets.file_upload_icon} alt="" className='p-2 bg-blue-500 rounded w-10 h-10' />
                                <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
                                {image ? (
                                    <img className='max-h-12 w-20 object-cover rounded' src={URL.createObjectURL(image)} alt="Thumbnail Preview" />
                                ) : (
                                    <span className='text-sm text-gray-500'>Upload Image</span>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Adding Chapters & Lectures */}
                    <h2 className='text-xl font-semibold text-gray-800 border-b pb-2 mt-4'>Project Content</h2>
                    <div>
                        {chapters.map((chapter, chapterIndex) => (
                            <div key={chapterIndex} className="bg-gray-50 border border-gray-200 rounded-lg mb-4 shadow-sm">
                                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-blue-100/50">
                                    <div className="flex items-center">
                                        <img
                                            className={`mr-3 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"} w-3 h-3`}
                                            onClick={() => handleChapter('toggle', chapter.chapterId)}
                                            src={assets.dropdown_icon}
                                            alt="Toggle"
                                        />
                                        <span className="font-semibold text-gray-800">{chapterIndex + 1}. {chapter.chapterTitle}</span>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <span className="text-sm text-gray-500">{chapter.chapterContent.length} Lectures</span>
                                        <img
                                            onClick={() => handleChapter('remove', chapter.chapterId)}
                                            src={assets.cross_icon}
                                            alt="Remove"
                                            className='cursor-pointer w-4 h-4 text-red-500 hover:scale-110 transition-transform'
                                        />
                                    </div>
                                </div>

                                {!chapter.collapsed && (
                                    <div className="p-4">
                                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                                            <div key={lectureIndex} className="flex justify-between items-center py-2 px-3 mb-2 bg-white rounded border border-gray-100 hover:bg-gray-50">
                                                <span className='text-sm text-gray-700'>
                                                    <span className="font-medium mr-2">{lectureIndex + 1}. {lecture.lectureTitle}</span>
                                                    <span className="text-gray-500">({lecture.lectureDuration} mins)</span>
                                                    {lecture.isPreviewFree && <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">FREE</span>}
                                                </span>
                                                <img
                                                    onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                                                    src={assets.cross_icon}
                                                    alt="Remove"
                                                    className='cursor-pointer w-3 h-3'
                                                />
                                            </div>
                                        ))}
                                        <div
                                            className="inline-flex items-center gap-1 bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded cursor-pointer mt-2 hover:bg-blue-600 transition-colors"
                                            onClick={() => handleLecture('add', chapter.chapterId)}>
                                            <img src={assets.add_icon_white} alt="Add" className='w-4 h-4' />
                                            Add Lecture
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div
                            className="flex justify-center items-center bg-violet-500 text-white font-semibold py-3 rounded-lg cursor-pointer mt-6 hover:bg-violet-600 transition-colors"
                            onClick={() => handleChapter('add')}>
                            + Add New Chapter
                        </div>

                        {/* Add Lecture Popup */}
                        {showPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
                                <div className="bg-white text-gray-700 p-6 rounded-xl shadow-2xl relative w-full max-w-sm">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Add Lecture</h2>

                                    <div className="flex flex-col gap-3">
                                        <div className="mb-2">
                                            <label className='font-medium'>Lecture Title</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 focus:border-blue-500 outline-none"
                                                value={lectureDetails.lectureTitle}
                                                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className='font-medium'>Duration (minutes)</label>
                                            <input
                                                type="number"
                                                className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 focus:border-blue-500 outline-none"
                                                value={lectureDetails.lectureDuration}
                                                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className='font-medium'>Lecture URL (Video Link)</label>
                                            <input
                                                type="text"
                                                className="mt-1 block w-full border border-gray-300 rounded py-2 px-3 focus:border-blue-500 outline-none"
                                                value={lectureDetails.lectureUrl}
                                                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 my-2">
                                            <label className='font-medium'>Is Preview Free?</label>
                                            <input
                                                type="checkbox" className='mt-1 scale-125 accent-blue-500'
                                                checked={lectureDetails.isPreviewFree}
                                                onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type='button'
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold mt-4 hover:bg-blue-700 transition-colors"
                                        onClick={addLecture}>
                                        Add Lecture
                                    </button>

                                    <img
                                        onClick={() => setShowPopup(false)}
                                        src={assets.cross_icon}
                                        className='absolute top-4 right-4 w-5 cursor-pointer text-gray-500 hover:text-gray-800'
                                        alt="Close"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className='bg-green-600 text-white w-full py-3 px-8 rounded-lg font-bold my-4 hover:bg-green-700 transition-colors'>
                        ADD Project
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCourse;