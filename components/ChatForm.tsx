"use client";
import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { motion } from "framer-motion";

const ChatForm = ({ onSend }: { onSend: (message: string) => void }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto px-4 py-3"
    >
      <div className="flex gap-4 items-center bg-white p-2 rounded-xl shadow-md border border-blue-100">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-5 py-3 text-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all placeholder:text-gray-400 text-base shadow-sm"
          placeholder="Type your message..."
        />
        
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          <FiSend className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ChatForm;