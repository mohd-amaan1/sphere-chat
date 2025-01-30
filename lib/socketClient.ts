"use client";

import { io } from "socket.io-client";

// Use environment variable for WebSocket server URL
const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3000";

export const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true, // Allow credentials if needed
  transports: ["websocket"], // Use WebSocket protocol for better performance
});
