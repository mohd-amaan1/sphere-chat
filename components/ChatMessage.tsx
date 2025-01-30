import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiCheck, FiCheckCircle, FiClock, FiInfo } from "react-icons/fi";
import { MessagesContainer } from "./scroller";

interface ChatMessageProps {
  sender: string;
  message: string;
  isOwnMessage: boolean;
  timestamp?: Date; 
  status?: "sent" | "delivered" | "read";
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

const ChatMessage = ({ 
  sender, 
  message, 
  isOwnMessage, 
  timestamp = new Date(), 
  status = "sent",
  isFirstInGroup = true,
  isLastInGroup = true
}: ChatMessageProps) => {
  const isSystemMessage = sender === "system";
  const messageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(messageRef, { margin: "50px 0px 0px 0px" });

  // Smooth scroll into view when message comes into viewport
  useEffect(() => {
    if (isInView && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isInView]);

  // Safely handle timestamp formatting
  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });


  return (
    <motion.div
      ref={messageRef}
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: isOwnMessage ? 100 : -100 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.5
      }}
      className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-1 group relative`}
    >
      <div
        className={`relative max-w-[70%] px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 
          ${
            isSystemMessage
              ? "bg-gradient-to-br from-purple-600 to-blue-500 text-white text-center text-sm font-semibold backdrop-blur-sm"
              : isOwnMessage
              ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
              : "bg-gradient-to-br from-gray-50 to-white text-gray-800 shadow-md hover:shadow-lg"
          }
          ${!isSystemMessage && (isOwnMessage ? "mr-2" : "ml-2")}
          ${isFirstInGroup ? "mt-4" : "mt-1"}
          before:content-[''] before:absolute before:w-3 before:h-3 before:rotate-45
          ${
            !isSystemMessage &&
            (isOwnMessage
              ? "before:-right-1.5 before:bg-indigo-600"
              : "before:-left-1.5 before:bg-white")
          }`}
      >
        {/* Message status indicator */}
        {isOwnMessage && !isSystemMessage && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute -right-5 bottom-2 flex items-center gap-1"
          >
            {status === "read" ? (
              <FiCheckCircle className="w-4 h-4 text-green-400" />
            ) : status === "delivered" ? (
              <FiCheckCircle className="w-4 h-4 text-gray-400" />
            ) : (
              <FiCheck className="w-4 h-4 text-gray-400" />
            )}
          </motion.div>
        )}

        {/* System message icon */}
        {isSystemMessage && (
          <FiInfo className="absolute -left-2 -top-2 bg-white text-purple-600 rounded-full p-1 box-content shadow-md" />
        )}

        {!isSystemMessage && isFirstInGroup && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs font-bold mb-1 ${
              isOwnMessage ? "text-blue-200" : "text-gray-500"
            }`}
          >
            {isOwnMessage ? "You" : sender}
          </motion.p>
        )}

        <motion.p
          className="text-sm leading-relaxed relative z-10"
          whileHover={{ scale: 1.01 }}
        >
          {message}
        </motion.p>

        {/* Timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center gap-1 absolute bottom-1 ${
            isOwnMessage ? "-right-24" : "-left-24"
          }`}
        >
          <FiClock className="w-3 h-3 text-gray-400" />
          <span
            className={`text-[0.6rem] font-medium ${
              isOwnMessage ? "text-gray-500" : "text-blue-700"
            }`}
          >
            {formattedTime}
          </span>
        </motion.div>

        {/* Typing indicator */}
        {!isLastInGroup && !isOwnMessage && !isSystemMessage && (
          <div className="absolute -bottom-4 left-0 flex space-x-[2px]">
            <MessagesContainer>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-gray-400 rounded-full"
                animate={{
                  y: [0, -3, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
              </MessagesContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;