import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component to force the window to scroll to the top (0, 0) 
 * whenever the route path changes.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This is the essential fix for React Router scroll behavior.
    window.scrollTo(0, 0); 
  }, [pathname]);

  // This component renders nothing, it only handles the side effect of scrolling.
  return null;
};

export default ScrollToTop;