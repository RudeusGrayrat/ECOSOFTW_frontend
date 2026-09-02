import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_SERVER_URL || "http://localhost:3002";
const socketUrl = apiUrl.replace(/\/api\/?$/, "");

const socket = io(socketUrl, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: false,
});

export default socket;
