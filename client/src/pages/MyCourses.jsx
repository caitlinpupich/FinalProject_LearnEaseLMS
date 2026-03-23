import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';
import DiscussionRoom from './DiscussionRoom'; // Ensure this component is created

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackId, setShowFeedbackId] = useState(null); // Tracks Rate Course toggle
  const [activeChatId, setActiveChatId] = useState(null);     // Tracks Discussion toggle

  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  // Fetch only the courses this specific student is enrolled in
  const fetchMyEnrolledData = async () => {
    try {
      const res = await axios.get('/api/users/profile', config);
      setMyCourses(res.data.enrolledCourses || []);
      setLoading(false);
    } catch (err) {
      console.error("Could not retrieve your personal scrolls:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEnrolledData();
  }, []);

  // Function to unenroll from a class
  const handleDrop = async (courseId) => {
    if (!window.confirm("Are you sure you want to drop this course from your curriculum?")) return;

    try {
      await axios.put(`/api/courses/drop/${courseId}`, {}, config);
      setMyCourses(myCourses.filter(course => course._id !== courseId));
      alert("Course successfully removed from your studies.");
    } catch (err) {
      console.error("Drop failed:", err);
      alert(err.response?.data?.message || "Failed to drop course.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4e4bc] flex items-center justify-center font-serif italic">
      Consulting the archives...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4e4bc] p-8 font-serif">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-[#2c1e14] mb-2 italic font-bold">My Active Studies</h1>
        <p className="text-[#d4af37] uppercase tracking-widest text-xs mb-8 font-bold border-b border-[#d4af37]/30 pb-4">
          Personal Curriculum for {JSON.parse(localStorage.getItem('user'))?.fullName}
        </p>

        {myCourses.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-lg shadow-inner border border-dashed border-gray-300">
            <p className="text-gray-500 italic mb-4">You have not yet declared a path of study.</p>
            <a href="/library" className="text-[#4a6741] font-bold underline hover:text-[#3a5233]">
              Visit the Great Hall to Enroll
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {myCourses.map(course => (
              <div 
                key={course._id} 
                className="bg-white p-6 rounded-lg shadow-md border-l-8 border-[#4a6741] transition group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h2 className="text-xl font-bold text-[#2c1e14]">{course.title}</h2>
                    <p className="text-sm text-gray-600 italic mt-1">{course.description}</p>
                    <p className="text-xs font-bold text-[#d4af37] mt-3 uppercase tracking-tighter">
                      Professor {course.instructor?.fullName || "Staff"}
                    </p>

                    {/* NEW: DISCUSSION TOGGLE BUTTON */}
                    <button 
                      onClick={() => setActiveChatId(activeChatId === course._id ? null : course._id)}
                      className="mt-4 flex items-center gap-2 text-[11px] font-bold text-[#2b4b7c] uppercase tracking-widest hover:text-black transition"
                    >
                      {activeChatId === course._id ? "▼ Hide Discussion" : "▶ Open Discussion Room"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
                    <a 
                      href={course.contentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#2c1e14] text-[#f4e4bc] px-6 py-2 rounded font-bold text-sm hover:bg-black transition text-center shadow-md"
                    >
                      Enter Class
                    </a>
                    
                    <button 
                      onClick={() => setShowFeedbackId(showFeedbackId === course._id ? null : course._id)}
                      className="text-[10px] font-bold text-[#d4af37] hover:text-[#2c1e14] uppercase tracking-widest transition-colors text-center border border-[#d4af37]/40 py-1 rounded"
                    >
                      {showFeedbackId === course._id ? 'Close Review' : 'Rate Course'}
                    </button>
                  </div>
                </div>

                {/* NESTED DISCUSSION ROOM */}
                {activeChatId === course._id && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <DiscussionRoom courseId={course._id} />
                  </div>
                )}

                {/* NESTED FEEDBACK FORM */}
                {showFeedbackId === course._id && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <FeedbackForm 
                      courseId={course._id} 
                      onFinished={() => setShowFeedbackId(null)} 
                    />
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <button 
                    onClick={() => handleDrop(course._id)}
                    className="text-[10px] font-bold text-red-800 hover:text-red-600 uppercase tracking-widest transition-colors"
                  >
                    Drop Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;