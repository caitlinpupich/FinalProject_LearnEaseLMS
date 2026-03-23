import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentLibrary = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        // Fetching from your standard courses route
        // Ensure backend .populates('ratings.userId', 'fullName')
        const res = await axios.get('/api/courses', config);
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("The Library doors are locked:", err);
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.put(`/api/courses/enroll/${courseId}`, {}, config);
      alert("You have been officially enrolled in this curriculum!");
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed. See the Headmaster.");
    }
  };

  // Helper to calculate the average stars
  const calculateAverage = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, curr) => acc + curr.score, 0);
    return (total / ratings.length).toFixed(1);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4e4bc] flex items-center justify-center italic text-[#2c1e14]">
      Unrolling the scrolls...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4e4bc] p-8 font-serif">
      <header className="text-center mb-12">
        <h1 className="text-5xl text-[#2c1e14] mb-2 italic tracking-tight font-bold">The Great Hall</h1>
        <div className="h-1 w-32 bg-[#d4af37] mx-auto mb-4 shadow-sm"></div>
        <p className="text-gray-700 italic">Expand your mind, scholar. Choose your path wisely.</p>
      </header>

      {courses.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[#2c1e14]/20 rounded-xl">
          <p className="text-xl text-gray-500 italic">The library shelves are currently empty...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white border-t-8 border-[#4a6741] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col group overflow-hidden"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded">
                    {course.contentType || 'Scroll'}
                  </span>
                  
                  {/* STAR RATING BADGE */}
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    <span className="text-[#d4af37] text-xs font-bold">★ {calculateAverage(course.ratings)}</span>
                    <span className="text-[10px] text-gray-400">({course.ratings?.length || 0})</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-[#2c1e14] mb-3 group-hover:text-[#4a6741] transition-colors leading-tight">
                  {course.title}
                </h2>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                  "{course.description}"
                </p>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm text-[#2c1e14] font-semibold">
                    <span className="text-gray-400 font-normal uppercase text-[10px] block tracking-tighter">Instructor</span>
                    Professor {course.instructor?.fullName || 'Staff'}
                  </p>
                </div>

                {/* PUBLIC REVIEWS SECTION */}
                <div className="mt-6">
                  <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-3 border-b border-gray-50 pb-1">
                    Student Testimonials
                  </h3>
                  <div className="max-h-32 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {course.ratings && course.ratings.length > 0 ? (
                      course.ratings.map((rev, idx) => (
                        <div key={idx} className="bg-gray-50 p-2 rounded text-xs border-l-2 border-[#d4af37]/40">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-[#2c1e14]">{rev.userId?.fullName || "Anonymous"}</span>
                            <span className="text-[#d4af37]">{'★'.repeat(rev.score)}</span>
                          </div>
                          <p className="text-gray-500 italic leading-tight">"{rev.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-gray-400 italic">No feedback scrolls found for this path.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-lg flex gap-2">
                <button 
                  onClick={() => handleEnroll(course._id)}
                  className="flex-1 bg-[#4a6741] text-white py-2 rounded font-bold hover:bg-black transition-colors shadow-sm text-sm"
                >
                  Enroll
                </button>
                <a 
                  href={course.contentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#2c1e14] text-[#2c1e14] rounded font-bold hover:bg-[#2c1e14] hover:text-[#f4e4bc] transition-all text-sm flex items-center"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLibrary;