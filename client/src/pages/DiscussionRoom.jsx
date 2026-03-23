import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiscussionRoom = ({ courseId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    const res = await axios.get(`/api/discussion/${courseId}`, { headers: { 'x-auth-token': token } });
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Polling every 5s for "live" feel
    return () => clearInterval(interval);
  }, [courseId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    try {
      const res = await axios.post(`/api/discussion/${courseId}`, { content: newMsg }, { headers: { 'x-auth-token': token } });
      setMessages([...messages, res.data]);
      setNewMsg("");
    } catch (err) { alert("Message failed to send."); }
  };

  return (
    <div className="bg-white rounded-lg shadow-inner border border-gray-200 flex flex-col h-[400px]">
      <div className="p-3 border-b bg-gray-50 font-bold text-xs uppercase text-dark-wood">Class Discussion</div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m._id} className={`flex flex-col ${m.sender._id === JSON.parse(localStorage.getItem('user'))._id ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-gray-400 mb-1">{m.sender.fullName} ({m.sender.role})</span>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${m.sender.role === 'faculty' ? 'bg-blue-100 border border-blue-200' : 'bg-gray-100'}`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
        <input 
          value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Share a thought with the class..."
          className="flex-1 text-sm p-2 border rounded-md outline-none focus:border-gold-leaf"
        />
        <button type="submit" className="bg-dark-wood text-white px-4 py-1 rounded text-xs font-bold uppercase">Send</button>
      </form>
    </div>
  );
};

export default DiscussionRoom;