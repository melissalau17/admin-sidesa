import React, { useEffect } from "react";
import { Alert } from "react-native";
import { io } from "socket.io-client";
import AppNavigator from "./navigation";

const socket = io("https://si-desa2.onrender.com");

export default function App() {
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        socket.on("notification", (data) => {
            console.log("Notifikasi baru diterima:", data);

            let alertTitle = "Notifikasi Baru";
            let alertMessage = data.message || "Ada pembaruan!";

            if (data.title === "Laporan Baru") {
                alertTitle = data.title;
                alertMessage = `${data.body}`;
            } else if (data.title === "Berita Baru Diterbitkan!") {
                alertTitle = data.title;
                alertMessage = data.message;
            } else if (data.title === "Pengguna Baru!") {
                alertTitle = data.title;
                alertMessage = data.message;
            }

            Alert.alert(alertTitle, alertMessage);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <AppNavigator />;
}
