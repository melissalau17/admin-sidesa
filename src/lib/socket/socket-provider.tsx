"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define a more specific type if needed for your custom events
type SocketType = Socket | null;

const SocketContext = createContext<SocketType>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<SocketType>(null);

  useEffect(() => {
    const socketIo = io("https://si-desa2.onrender.com"); 
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketType => useContext(SocketContext);
