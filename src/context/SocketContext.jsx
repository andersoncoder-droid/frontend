// SocketContext.jsx
// Provides Socket.io context for real-time communication.
// Connects to backend and handles reconnection logic.

import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // useEffect: Connects to Socket.io server and sets up error handling.
    try {
      const token = localStorage.getItem("token");
      const newSocket = io("http://localhost:3001", {
        auth: { token },
        transports: ["websocket", "polling"], // Añadir opciones de transporte
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect_error", (err) => {
        console.log("Socket connection error:", err.message);
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    } catch (error) {
      console.error("Socket connection failed:", error);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
