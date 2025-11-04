// src/pages/educator/AddCourse.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import Quill from "quill";
import uniqid from "uniqid";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AddCourse = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, getToken, isEducator, isAdmin, navigate } = useContext(AppContext);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // ✅ Only allow educators/admins
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "educator" && role !== "admin") {
      toast.error("Access denied. Educators only.");
      navigate("/");
    }
  }, [navigate]);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
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
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!image) return toast.error("Please upload a project thumbnail.");
      if (chapters.length === 0)
        return toast.error("Please add at least one chapter.");

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message || "Project added successfully!");
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        if (quillRef.current) quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message || "Failed to add project");
      }
    } catch (error) {
      console.error("Add course error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <div
      className="min-h-screen md:p-10 p-4"
      style={{ backgroundImage: "linear-gradient(to top, #000041, #410000)" }}
    >
      <h1 className="text-2xl font-bold text-white mb-6">Add New Project</h1>

      <div
        className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full mx-auto
        transform hover:scale-[1.01]
        hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]
        transition-all duration-300 ease-in-out"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full text-gray-600"
        >
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Project Title</label>
            <input
              onChange={(e) => setCourseTitle(e.target.value)}
              value={courseTitle}
              type="text"
              placeholder="e.g., Salesforce Consultant"
              className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-blue-400 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              Project Description
            </label>
            <div
              ref={editorRef}
              className="bg-white border border-gray-300 rounded"
            ></div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Price ($)</label>
              <input
                onChange={(e) => setCoursePrice(e.target.value)}
                value={coursePrice}
                type="number"
                min={0}
                className="outline-none py-2.5 w-32 px-3 rounded border border-gray-300 focus:border-blue-400 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Discount %</label>
              <input
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                type="number"
                min={0}
                max={100}
                className="outline-none py-2.5 w-32 px-3 rounded border border-gray-300 focus:border-blue-400 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col items-center gap-3 mt-2">
              <label className="font-medium text-gray-700">Thumbnail</label>
              <label
                htmlFor="thumbnailImage"
                className="flex items-center gap-3 cursor-pointer p-2 rounded-lg border-2 border-dashed border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <img
                  src={assets.file_upload_icon}
                  alt=""
                  className="p-2 bg-blue-500 rounded w-10 h-10"
                />
                <input
                  type="file"
                  id="thumbnailImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  hidden
                />
                {image ? (
                  <img
                    className="max-h-12 w-20 object-cover rounded"
                    src={URL.createObjectURL(image)}
                    alt="Thumbnail Preview"
                  />
                ) : (
                  <span className="text-sm text-gray-500">Upload Image</span>
                )}
              </label>
            </div>
          </div>

          {/* Chapters + Lectures */}
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-4">
            Project Content
          </h2>

          {/* ...rest of your chapter + lecture UI remains same ... */}

          <button
            type="submit"
            className="bg-green-600 text-white w-full py-3 px-8 rounded-lg font-bold my-4 hover:bg-green-700 transition-colors"
          >
            ADD Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
