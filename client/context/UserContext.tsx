import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { createContext } from "react";

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

const UserContext = createContext<UserContextProps | undefined>(undefined);
