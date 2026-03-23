import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Get user data and role safely
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token');
  const role = user?.role?.toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Keep the Login page clean by not showing the navbar if there's no token
  if (!token) return null;

  return (
    <nav className="bg-[#2c1e14] text-[#f4e4bc] shadow-2xl border-b-4 border-[#d4af37] sticky top-0 z-50 font-serif">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO / HOME */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="text-2xl italic font-bold tracking-tighter group-hover:text-[#d4af37] transition-colors">
            LearnEase <span className="text-[#d4af37] text-sm uppercase tracking-widest not-italic ml-1">LMS</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-4">
          
          {/* 1. SHARED: THE GREAT HALL */}
          <Link 
            to="/library" 
            className="text-[10px] sm:text-xs uppercase tracking-widest text-white hover:bg-white/10 px-3 py-2 rounded transition-all font-bold"
          >
            The Great Hall
          </Link>

          {/* 2. STUDENT ONLY: MY CURRICULUM */}
          {role === 'learner' && (
            <Link 
              to="/my-courses" 
              className="text-[10px] sm:text-xs uppercase tracking-widest bg-[#4a6741] text-white hover:bg-[#3a5233] px-3 py-2 rounded shadow-md transition-all font-bold border border-[#f4e4bc]/20"
            >
              My Curriculum
            </Link>
          )}

          {/* 3. FACULTY ONLY: PROFESSOR'S LOUNGE */}
          {role === 'faculty' && (
            <Link 
              to="/faculty" 
              className="text-[10px] sm:text-xs uppercase tracking-widest bg-[#2b4b7c] text-white hover:bg-[#1e355b] px-3 py-2 rounded shadow-md transition-all font-bold border border-[#f4e4bc]/20"
            >
              Professor's Lounge
            </Link>
          )}

          {/* 4. ADMIN ONLY: HEADMASTER'S LEDGER */}
          {role === 'admin' && (
            <Link
              to="/admin"
              className="text-[10px] sm:text-xs uppercase tracking-widest bg-[#d4af37] text-black hover:bg-[#b8962e] px-3 py-2 rounded shadow-md transition-all font-bold"
            >
              Headmaster's Ledger
            </Link>
          )}

          {/* USER INFO & LOGOUT */}
          <div className="flex items-center gap-4 border-l border-[#f4e4bc]/20 pl-6 ml-2">
            <div className="text-right hidden md:block">
              <p className="text-[10px] italic text-[#d4af37] leading-none mb-1 uppercase tracking-tighter">
                {role === 'admin' ? 'Headmaster' : role === 'faculty' ? 'Professor' : 'Scholar'}
              </p>
              <p className="text-sm font-bold leading-tight text-white">{user?.fullName || 'Anonymous'}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-700/80 hover:bg-red-600 text-white text-[10px] uppercase font-bold py-2 px-4 rounded border border-red-400/50 transition-all whitespace-nowrap shadow-lg"
            >
              Exit School
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;