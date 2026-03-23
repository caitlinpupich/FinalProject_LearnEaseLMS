import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ courseId, onFinished }) => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.post(`/api/courses/${courseId}/rate`, 
        { score, comment }, 
        { headers: { 'x-auth-token': token } }
      );
      setSubmitted(true);
      alert("Feedback cast successfully!");
      if(onFinished) onFinished(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit feedback.");
    }
  };

  if (submitted) return <p className="text-sm italic text-hogwarts-green">Feedback recorded. Thank you!</p>;

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border border-gold-leaf/20">
      <h4 className="text-xs uppercase font-bold text-dark-wood mb-2">Rate your studies</h4>
      
      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setScore(num)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition ${
              score >= num ? 'bg-gold-leaf text-black' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <textarea
        className="w-full p-2 text-sm border rounded bg-white"
        placeholder="How was the curriculum? (Optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        type="submit"
        className="mt-2 w-full bg-dark-wood text-parchment py-1 text-xs uppercase font-bold rounded hover:bg-black transition"
      >
        Submit Review
      </button>
    </form>
  );
};

export default FeedbackForm;