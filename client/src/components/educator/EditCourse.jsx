import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useAuth } from '@clerk/clerk-react';
import Loading from '../student/Loading'; 
import BackButton from '../student/BackButton'; 

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { backendUrl } = useContext(AppContext);
    const { getToken } = useAuth();

    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState(''); 
    const [courseThumbnail, setCourseThumbnail] = useState(null); 
    const [existingImageUrl, setExistingImageUrl] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);

    // --- 1. Fetch Existing Course Data ---
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
                if (data.success) {
                    setCourseTitle(data.courseData.courseTitle);
                    setCourseDescription(data.courseData.courseDescription);
                    setExistingImageUrl(data.courseData.courseThumbnail);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Error fetching course data for editing.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [id, backendUrl]);

    // --- 2. Handle Form Submission (Update Logic) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('courseTitle', courseTitle);
        formData.append('courseDescription', courseDescription);
        
        // IMPORTANT: The key 'courseThumbnail' must match the key used in backend upload middleware
        if (courseThumbnail) {
            formData.append('courseThumbnail', courseThumbnail);
        }

        try {
            const token = await getToken();
            
            const response = await axios.put(
                `${backendUrl}/api/educator/update/${id}`, // NOTE: The path is adjusted to /api/educator/update/:id to match your educatorRouter mounting structure
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data', 
                    },
                }
            );

            if (response.data.success) {
                toast.success("Course updated successfully!");
                navigate(`/course/${id}`); 
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("An error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className='pt-20'><Loading /></div>;

    return (
        <div className='py-16 bg-gray-50 min-h-screen'>
            <div className='md:px-36 px-8 pt-8 text-left'>
                <BackButton />
            </div>

            <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-4">
                <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-4 mb-6">
                    Edit Course: {courseTitle}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Name */}
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                            Course Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            required
                        />
                    </div>

                    {/* Course Description */}
                    <div>
                        <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                            Short Description
                        </label>
                        <textarea
                            id="description"
                            rows="4"
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            required
                        />
                    </div>

                    {/* Image Management */}
                    <div className='border-t pt-6'>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Thumbnail</h3>
                        
                        {/* Current Image Preview */}
                        <div className="mb-4">
                            <label className="block text-base font-medium text-gray-700 mb-2">
                                Current Image:
                            </label>
                            {existingImageUrl && (
                                <img 
                                    src={existingImageUrl} 
                                    alt="Current Course Thumbnail" 
                                    className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                                />
                            )}
                        </div>

                        {/* File Input for New Image */}
                        <div>
                            <label htmlFor="thumbnail" className="block text-base font-medium text-gray-700 mb-2">
                                Upload New Thumbnail (optional)
                            </label>
                            <input
                                type="file"
                                id="thumbnail"
                                accept="image/*"
                                onChange={(e) => setCourseThumbnail(e.target.files[0])}
                                className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition duration-150"
                            />
                            {courseThumbnail && (
                                <p className='text-sm text-green-600 mt-2'>
                                    New file selected: **{courseThumbnail.name}**
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-md hover:shadow-lg"
                    >
                        {isLoading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCourse;