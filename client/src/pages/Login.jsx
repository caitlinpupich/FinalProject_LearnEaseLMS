import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });

      // Inside Login.jsx onSubmit
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const role = res.data.user.role.toLowerCase();
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'faculty') {
          navigate('/faculty');
        } else {
          navigate('/library');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-4 font-serif">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl border-t-8 border-hogwarts-green">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-dark-wood italic">LearnEase LMS</h2>
          <p className="text-gold-leaf uppercase tracking-widest text-xs mt-2 font-bold">Entry to the Great Hall</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm mb-6 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark-wood mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hogwarts-green focus:border-transparent outline-none transition"
              placeholder="wizard@hogwarts.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-wood mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hogwarts-green focus:border-transparent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-hogwarts-green text-parchment py-4 rounded-lg font-bold shadow-lg hover:bg-black transition duration-300 transform hover:-translate-y-1"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;