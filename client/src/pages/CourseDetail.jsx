import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/courses/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setCourse(res.data);
        
        // Check if the current user's ID is in the enrolledStudents array
      } catch (err) {
        console.error("Error fetching course", err);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/courses/enroll/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      alert("Your name has been added to the parchment!");
      setIsEnrolled(true);
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <div className="p-20 text-center italic text-dark-wood">Consulting the archives...</div>;

  return (
    <div className="min-h-screen bg-parchment p-8">
      {/* ... (Previous Header/Link Code) ... */}
      
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg p-10 border-t-8 border-hogwarts-green">
        <h1 className="text-4xl font-serif text-dark-wood mb-4">{course.title}</h1>
        <p className="text-gold-leaf font-bold mb-6">Instructor: {course.instructor?.fullName || 'Staff'}</p>
        
        <p className="italic text-gray-700 mb-10">"{course.description}"</p>

        <div className="border-t border-dark-wood/10 pt-8">
          {isEnrolled ? (
            <div className="bg-hogwarts-green/10 p-6 rounded border border-hogwarts-green/20">
              <h3 className="text-hogwarts-green font-bold mb-4">✨ You are enrolled in this class.</h3>
              <a 
                href={course.contentUrl} 
                target="_blank" 
                className="bg-hogwarts-green text-parchment px-6 py-3 rounded font-bold hover:bg-opacity-90 inline-block"
              >
                Access Secret Knowledge (View Content)
              </a>
            </div>
          ) : (
            <button 
              onClick={handleEnroll}
              disabled={loading}
              className="bg-dark-wood text-parchment px-10 py-4 rounded font-bold hover:bg-black transition disabled:opacity-50"
            >
              {loading ? "Signing Roster..." : "Sign the Roster (Enroll)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;