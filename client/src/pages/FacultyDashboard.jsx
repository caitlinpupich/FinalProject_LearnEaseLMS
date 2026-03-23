import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  
  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const [studentRes, courseRes] = await Promise.all([
          axios.get('/api/users/students', config),
          axios.get('/api/courses', config)
        ]);
        setStudents(studentRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error("Access to Faculty records denied.");
      }
    };
    fetchFacultyData();
  }, []);

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/courses/${editingCourse._id}`, editingCourse, config);
      setCourses(courses.map(c => c._id === res.data._id ? res.data : c));
      setEditingCourse(null);
      alert("Curriculum updated successfully.");
    } catch (err) {
      alert("Failed to update course.");
    }
  };

  return (
    <div className="min-h-screen bg-parchment p-8 font-serif">
      <h1 className="text-4xl text-dark-wood mb-8 italic border-b-2 border-gold-leaf pb-2">Professor's Lounge</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* STUDENT ROSTER */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-hogwarts-green italic">Student Roster</h2>
          <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr><th className="p-4">Student Name</th><th className="p-4">Email</th></tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold">{s.fullName}</td>
                    <td className="p-4 text-sm text-gray-500">{s.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* COURSE MANAGEMENT */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-hogwarts-green italic">Manage Curriculum</h2>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course._id} className="bg-white p-4 rounded shadow border-l-4 border-gold-leaf flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-dark-wood">{course.title}</h3>
                  <p className="text-xs text-gray-400">Instructor: {course.instructor?.fullName || 'Staff'}</p>
                </div>
                <button 
                  onClick={() => setEditingCourse(course)}
                  className="text-xs font-bold uppercase text-blue-600 hover:underline"
                >
                  Edit Syllabus
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Edit {editingCourse.title}</h2>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <input 
                className="w-full p-2 border-b" 
                value={editingCourse.title} 
                onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} 
              />
              <textarea 
                className="w-full p-2 border-b h-24" 
                value={editingCourse.description} 
                onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} 
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-hogwarts-green text-white py-2 rounded">Save Changes</button>
                <button type="button" onClick={() => setEditingCourse(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;