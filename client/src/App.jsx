// App.jsx — Final version for MANUAL USER AUTH (JWT) only

import React, { useState } from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';

// ===== Student Components =====
import Navbar from './components/student/Navbar';
import Home from './pages/student/Home';
import CourseDetails from './pages/student/CourseDetails';
import CoursesList from './pages/student/CoursesList';
import Login from './pages/student/Login';
import Register from './pages/student/Register';
import Player from './pages/student/Player';
import MyEnrollments from './pages/student/MyEnrollments';
import Loading from './components/student/Loading';
import PaymentSuccess from './pages/student/PaymentSuccess';
import Purchase from './pages/student/Purchase';

// ===== Educator Components =====
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';

// ===== Styles =====
import 'quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');
  const [lastRegistered, setLastRegistered] = useState({ email: '', password: '' });

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {/* Show Navbar only on Student Side */}
      {!isEducatorRoute && <Navbar />}

      <div className="pt-0">
        <Routes>
          {/* ===== Student Routes ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/course-list" element={<CoursesList />} />
          <Route path="/course-list/:input" element={<CoursesList />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player />} />
          <Route path="/loading/:path" element={<Loading />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/purchase/:courseId" element={<Purchase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== Educator Routes (Nested) ===== */}
          <Route path="/educator" element={<Educator />}>
            <Route path="/educator" element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="student-enrolled" element={<StudentsEnrolled />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
