import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formMode, setFormMode] = useState('course'); // 'course' or 'user'

  const [newCourse, setNewCourse] = useState({ title: '', description: '', contentUrl: '', instructor: '' });
  const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', role: 'learner' });

  const [isEditing, setIsEditing] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { 'x-auth-token': token } };

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [userRes, courseRes] = await Promise.all([
        axios.get('/api/admin/users', config),
        axios.get('/api/courses', config)
      ]);
      setUsers(userRes.data);
      setCourses(courseRes.data);
    } catch (err) {
      console.error("Ledger access denied", err);
    }
  };

  // --- USER MANAGEMENT (Using /api/auth and /api/admin/users) ---
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await axios.put(`/api/admin/users/${isEditing}`, {
          fullName: newUser.fullName,
          role: newUser.role.toLowerCase()
        }, config);
        setUsers(users.map(u => u._id === isEditing ? res.data : u));
        alert("Member records revised.");
      } else {
        const res = await axios.post('/api/auth/register', {
          ...newUser,
          role: newUser.role.toLowerCase()
        });
        // Add new user to state (adjust based on register response)
        const created = { _id: res.data.userId, ...newUser, role: newUser.role.toLowerCase() };
        setUsers([...users, created]);
        alert("New appointment successful.");
      }
      resetForms();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Expel this member from the Ledger?")) {
      try {
        await axios.delete(`/api/admin/users/${id}`, config);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert("Expulsion failed.");
      }
    }
  };

  // --- COURSE MANAGEMENT ---
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await axios.put(`/api/courses/${isEditing}`, newCourse, config);
        setCourses(courses.map(c => c._id === isEditing ? res.data : c));
        alert("Course records updated in the Library!");
      } else {
        // Creation usually goes to /add
        const res = await axios.post('/api/admin/courses/add', newCourse, config);
        setCourses([res.data, ...courses]);
        alert("New scroll added to the collection!");
      }
      resetForms();
    } catch (err) {
      console.error("Course update failed:", err.response);
      alert("The update spell failed. Check the Ledger.");
    }
  };

  // Helper to start editing
  const startEditUser = (user) => {
    setFormMode('user');
    setIsEditing(user._id);
    setNewUser({ fullName: user.fullName, email: user.email, role: user.role, password: '' });
  };

  const startEditCourse = (course) => {
    setFormMode('course');
    setIsEditing(course._id);
    setNewCourse({
      title: course.title,
      description: course.description,
      contentUrl: course.contentUrl,
      instructor: course.instructor?._id || course.instructor || ''
    });
  };

  const resetForms = () => {
    setNewCourse({ title: '', description: '', contentUrl: '', instructor: '' });
    setNewUser({ fullName: '', email: '', password: '', role: 'learner' });
    setIsEditing(null);
  };

  const facultyMembers = users.filter(u => u.role?.toLowerCase() === 'faculty');

  return (
    <div className="min-h-screen bg-parchment p-10 font-serif">
      <h1 className="text-4xl text-hogwarts-green mb-10 border-b-2 border-dark-wood/20 pb-4 italic">Headmaster's Ledger</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* FORM SECTION */}
        <div className="lg:col-span-1">
          <section className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-gold-leaf sticky top-24">
            <div className="flex mb-6 border-b pb-4 justify-around">
              <button onClick={() => { setFormMode('course'); resetForms(); }} className={`text-xs font-bold uppercase ${formMode === 'course' ? 'text-hogwarts-green underline' : 'text-gray-400'}`}>Course</button>
              <button onClick={() => { setFormMode('user'); resetForms(); }} className={`text-xs font-bold uppercase ${formMode === 'user' ? 'text-hogwarts-green underline' : 'text-gray-400'}`}>Faculty/Student</button>
            </div>

            {formMode === 'course' ? (
              <form onSubmit={handleCourseSubmit} className="space-y-4">
                <input type="text" placeholder="Title" className="w-full p-2 border-b outline-none" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} required />
                <select className="w-full p-2 border-b outline-none" value={newCourse.instructor} onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} required>
                  <option value="">Select Professor...</option>
                  {facultyMembers.map(p => <option key={p._id} value={p._id}>{p.fullName}</option>)}
                </select>
                <textarea placeholder="Description" className="w-full p-2 border-b h-20 outline-none" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} required />
                <input type="text" placeholder="URL" className="w-full p-2 border-b outline-none" value={newCourse.contentUrl} onChange={(e) => setNewCourse({ ...newCourse, contentUrl: e.target.value })} required />
                <button className="w-full bg-hogwarts-green text-parchment py-2 rounded font-bold hover:bg-black transition">{isEditing ? 'Update Records' : 'Sign & Publish'}</button>
              </form>
            ) : (
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-2 border-b outline-none" value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} required />
                <input type="email" placeholder="Email" className="w-full p-2 border-b outline-none" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required disabled={isEditing} />
                {!isEditing && <input type="password" placeholder="Password" className="w-full p-2 border-b outline-none" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />}
                <select className="w-full p-2 border-b outline-none" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  <option value="learner">Learner</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
                <button className="w-full bg-dark-wood text-parchment py-2 rounded font-bold hover:bg-black transition">{isEditing ? 'Update Member' : 'Add Member'}</button>
              </form>
            )}
            {isEditing && <button onClick={resetForms} className="w-full text-xs text-gray-500 mt-4 uppercase underline">Cancel</button>}
          </section>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl text-dark-wood mb-4 italic font-semibold">Registered Scholars</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-dark-wood/10">
              <table className="w-full text-left">
                <thead className="bg-dark-wood text-parchment text-xs uppercase">
                  <tr><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-hogwarts-green">{user.fullName}</td>
                      <td className="p-4 text-xs font-bold uppercase text-gray-400">{user.role}</td>
                      <td className="p-4 text-right flex justify-end gap-3 text-xs font-bold uppercase">
                        <button onClick={() => startEditUser(user)} className="text-blue-500 hover:underline">Edit</button>
                        <button onClick={() => deleteUser(user._id)} className="text-red-500 hover:underline">Expel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-dark-wood mb-4 italic font-semibold">Library Management</h2>
            <div className="space-y-3">
              {courses.map(course => (
                <div key={course._id} className="bg-white p-4 flex justify-between items-center shadow border-l-4 border-hogwarts-green">
                  <span className="font-bold text-dark-wood">{course.title}</span>
                  <div className="flex gap-4 text-xs font-bold uppercase">
                    <button onClick={() => startEditCourse(course)} className="text-blue-600 underline">Edit</button>
                    <button onClick={() => deleteCourse(course._id)} className="text-red-700 underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;