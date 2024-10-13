import {
  Call,
  StreamVideoClient,
  User as StreamUserType,
} from "@stream-io/video-react-sdk";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import React from "react";
import Cookies from "universal-cookie";
interface User {
  username: string;
  name: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  client: StreamVideoClient | undefined;
  setClient: (client: StreamVideoClient | undefined) => void;
  call: Call | undefined;
  setCall: (call: Call | undefined) => void;
  isLoading: boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = (props: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [call, setCall] = useState<Call>();
  const [client, setClient] = useState<StreamVideoClient>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const cookies = new Cookies();
  useEffect(() => {
    const token = cookies.get("token");
    const username = cookies.get("username");
    const name = cookies.get("name");

    if (!token || !username || !name) {
      setIsLoading(false);
      return;
    }

    const user: StreamUserType = {
      id: username,
      name,
    };

    const myClient = new StreamVideoClient({
      apiKey: import.meta.env.VITE_STREAM_API_KEY,
      user,
      token,
    });
    setClient(myClient);
    setUser({ username, name });
    setIsLoading(false);

    return () => {
      myClient.disconnectUser();
      setClient(undefined);
      setUser(null);
    };
  }, []);
  return (
    <UserContext.Provider
      value={{ user, setUser, client, setClient, call, setCall, isLoading }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUSer must be within a provider");
  }

  return context;
};
