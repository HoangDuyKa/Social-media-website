import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "Redux/Slice/app";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const Auth = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Auth) {
      const socket = io("http://localhost:3001/", {
        query: {
          userId: Auth._id,
        },
      });

      setSocket(socket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (users) => {
        // setOnlineUsers(users);
        dispatch(setOnlineUsers({ onlineUsers: users }));
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();

        setSocket(null);
      }
    }
  }, [Auth]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
