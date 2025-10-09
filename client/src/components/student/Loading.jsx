import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // This logic ensures the page navigates after 5 seconds if a path is specified.
    if (path) {
      const timer = setTimeout(() => {
        navigate(`/${path}`);
      }, 5000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [path, navigate]); // Added 'path' and 'navigate' to dependency array

  return (
    // 1. Full-screen container with a subtle background and flex centering
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      
      {/* 2. Enhanced Spinner: Better size, depth, and brand-aligned colors */}
      <div 
        className="w-16 h-16 sm:w-20 sm:h-20 
                   border-4 border-gray-200 
                   border-t-4 border-t-indigo-600  // Strong primary color
                   rounded-full 
                   shadow-xl                      // Added shadow for depth
                   animate-spin"
      >
      </div>

      {/* 3. Loading Text: Provides context and a smooth transition */}
      <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">
        Loading content, please wait...
      </p>
      
      {/* 4. Optional: Add a simple animation delay indicator (e.g., three pulsing dots) */}
       <div className="flex space-x-2 mt-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>

    </div>
  );
};

export default Loading;