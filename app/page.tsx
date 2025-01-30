"use client";
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { socket } from "@/lib/socketClient";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [userName, setUserName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessages((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", data);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isNearBottom = 
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Company Heading */}
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        ChatSphere
      </motion.h1>

      <motion.div 
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {!joined ? (
          <div className="p-6 md:p-8 space-y-6">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Join Chat Room
            </motion.h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 md:px-6 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm md:text-base"
              />
              <input
                type="text"
                placeholder="Room Name"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full px-4 py-3 md:px-6 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm md:text-base"
              />
              <motion.button
                onClick={handleJoinRoom}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm md:text-base"
              >
                Join Now
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[500px] md:h-[600px]">
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600">
              <h1 className="text-lg md:text-xl font-bold text-white">
                Room: <span className="font-normal">{room}</span>
              </h1>
              <p className="text-blue-100 mt-1 text-sm md:text-base">Welcome, {userName}</p>
            </div>
            
            <div 
              className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 relative"
              onScroll={handleScroll}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: msg.sender === userName ? 100 : -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChatMessage
                      sender={msg.sender}
                      message={msg.message}
                      isOwnMessage={msg.sender === userName}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  onClick={scrollToBottom}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-24 md:bottom-28 right-4 md:right-8 p-2 md:p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                  title="Scroll to bottom"
                >
                  <FiArrowDown className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="p-3 md:p-4 border-t border-gray-100 bg-white">
              <ChatForm onSend={handleSendMessage} />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}