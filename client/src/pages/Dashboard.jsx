import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/courses', {
                    headers: { 'x-auth-token': token }
                });
                setCourses(res.data);
            } catch (err) {
                console.error("Error fetching courses", err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen p-8 bg-parchment">
            <header className="mb-12 border-b-2 border-dark-wood/20 pb-6">
                <h1 className="text-4xl font-bold text-hogwarts-green italic">Available Curriculum</h1>
                <p className="text-dark-wood font-medium">Welcome back, Scholar.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <div
                        key={course._id}
                        /* 1. Added 'flex flex-col' to make the card a vertical column */
                        className="flex flex-col bg-white border-l-8 border-hogwarts-green shadow-xl p-6 rounded-r-lg hover:translate-y-[-5px] transition-transform duration-300"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest text-gold-leaf">Course Tome</span>
                        <h3 className="text-2xl font-bold text-dark-wood mt-2 mb-3">{course.title}</h3>

                        {/* 2. Added 'grow' here. This pushes everything below it (the button) to the bottom */}
                        <p className="grow text-gray-700 leading-relaxed mb-6 italic">
                            "{course.description}"
                        </p>

                        <Link
                            to={`/course/${course._id}`}
                            className="w-full bg-hogwarts-green text-parchment py-3 rounded hover:bg-opacity-90 transition font-bold shadow-md text-center"
                        >
                            Study Material
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;