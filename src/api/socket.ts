import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";

const socket = io(socketUrl, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: false,
});

export default socket;
