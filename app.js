import React, { useEffect } from "react";
import { Alert } from "react-native";
import { io } from "socket.io-client";
import AppNavigator from "./navigation"; 

const socket = io("http://192.168.1.10:5000");

export default function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("notification", (data) => {
      console.log("New notification received:", data);

      Alert.alert("Notifikasi Baru", `Laporan: ${data.keluhan || "Ada laporan baru!"}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <AppNavigator />;
}
