import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { createContext, ReactNode, useContext, useState } from "react";
import React from "react";
interface User {
  username: string;
  name: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  client: StreamVideoClient | undefined;
  setClient: (client: StreamVideoClient | undefined) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = (props: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<StreamVideoClient>();
  return (
    <UserContext.Provider value={{ user, setUser, client, setClient }}>
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
