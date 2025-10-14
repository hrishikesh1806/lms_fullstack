
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const SideBar = () => {

  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/educator', 
      icon: assets.home_icon, 
      hoverClass: 'hover:bg-blue-100 hover:text-blue-800' 
    },
    { 
      name: 'Add Projects', 
      path: '/educator/add-course', 
      icon: assets.add_icon, 
      hoverClass: 'hover:bg-green-100 hover:text-green-800' 
    },
    { 
      name: 'My Projects', 
      path: '/educator/my-courses', 
      icon: assets.my_course_icon, 
      hoverClass: 'hover:bg-purple-100 hover:text-purple-800' 
    },
    { 
      name: 'Students', 
      path: '/educator/student-enrolled', 
      icon: assets.person_tick_icon,
      hoverClass: 'hover:bg-pink-100 hover:text-pink-800' 
    },
  ];

  return isEducator && (
    <div className='md:w-64 w-16 
            bg-gray-900 
            min-h-[calc(100vh-64px)] 
            border-r border-gray-700 
            py-2 
            flex flex-col 
            sticky top-0'>
      
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/educator'}
          className={({ isActive }) =>
            // The hover/active styling remains the same
            `flex items-center md:flex-row flex-col md:justify-start justify-center 
              py-3.5 md:py-4 md:px-6 gap-3 
              text-gray-300 font-medium 
              transition-all duration-150 ease-in-out
              transform
              
              ${isActive
                ? 'bg-gray-800 text-indigo-400 border-l-4 border-indigo-500 shadow-inner' 
                : `border-l-4 border-transparent ${item.hoverClass} hover:shadow-[0_4px_6px_-1px_rgba(252,211,77,0.5)] hover:scale-[1.01]` 
              }`
          }
        >
          {/* Icon styling: Added 'invert' to make the icon appear white against the dark background */}
          <img 
            src={item.icon} 
            alt={item.name} 
            className={`w-5 h-5 invert ${item.name === 'Students' ? 'w-6 h-6' : ''}`} 
          />
          
          {/* Text is hidden on small screens */}
          <p className='md:block hidden'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;