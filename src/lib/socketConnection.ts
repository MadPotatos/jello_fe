// socketService.ts

import { io, Socket } from "socket.io-client";
import { Backend_URL } from "@/lib/Constants";
import { mutate } from "swr";

let socket: Socket | null = null;

export const connectSocket = (userId: string | number) => {
  if (!socket) {
    const backendUrl = Backend_URL || "";
    socket = io(backendUrl, {
      query: {
        userId,
      },
    });
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.on("newNotification", () => {
      mutate(`notifications-${userId}`);
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};
