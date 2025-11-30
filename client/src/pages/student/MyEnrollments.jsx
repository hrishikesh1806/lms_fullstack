import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';

const MyEnrollments = () => {
  const { userData, enrolledCourses, fetchUserEnrolledCourses, navigate } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [localCourses, setLocalCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (!userData) return;
        if (!userData._id) {
          toast.warn('Please log in to see your enrollments');
          setLoading(false);
          return;
        }

        await fetchUserEnrolledCourses();
        setLocalCourses(enrolledCourses || []);
        console.log('Enrolled courses loaded:', enrolledCourses);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        toast.error('Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [userData, fetchUserEnrolledCourses, enrolledCourses]);

  const handleBackToHome = () => navigate('/');

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '500',
        }}
      >
        Loading your enrolled courses...
      </div>
    );
  }

  if (!userData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #141E30, #243B55)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h2>Please log in to view your enrolled courses.</h2>
      </div>
    );
  }

  if (!localCourses || localCourses.length === 0) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #141E30, #243B55)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>
          You haven’t enrolled in any courses yet.
        </h2>
        <button
          onClick={handleBackToHome}
          style={{
            background: 'linear-gradient(90deg, #007bff, #00c6ff)',
            color: 'white',
            border: 'none',
            padding: '10px 25px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <div style={{ padding: '40px 60px' }}>
        <button
          onClick={handleBackToHome}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '20px',
            boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
          }}
        >
          ← Back to Home
        </button>

        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '2rem',
            color: '#1f2937',
          }}
        >
          My Enrollments
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px',
            marginBottom: '40px',
          }}
        >
          {localCourses.map((course) => (
            <div
              key={course._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <img
                src={course.courseThumbnail}
                alt={course.courseTitle}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                }}
              />
              <div style={{ padding: '15px' }}>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    marginBottom: '8px',
                    color: '#111827',
                  }}
                >
                  {course.courseTitle}
                </h3>
                <p
                  style={{
                    color: '#4b5563',
                    fontSize: '0.95rem',
                    marginBottom: '10px',
                  }}
                >
                  {course.description?.slice(0, 80)}...
                </p>
                <Line percent={course.progress || 0} strokeWidth="3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyEnrollments;
