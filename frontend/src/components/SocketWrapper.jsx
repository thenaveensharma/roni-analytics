/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketWrapper = ({
  coinId,
  days,
  handleLiveRequest,
  handlePerMinuteRequest,
}) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3030/");

    newSocket.emit("setup", coinId);

    newSocket.on("connected", () => {
      console.log(`Socket connected for ${coinId}`);
    });

    newSocket.on("price", handleLiveRequest);
    newSocket.on("price:interval", handlePerMinuteRequest);

    setSocket(newSocket);

    return () => {
      console.log(`Cleanup for ${coinId}`);
      newSocket.disconnect();
    };
  }, [coinId, handleLiveRequest, handlePerMinuteRequest]);

  return null; // This component doesn't render anything in the DOM
};

export default SocketWrapper;
