import { StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "../../../context/UserContext";
import { Navigate } from "react-router-dom";

const Main = () => {
  const { client } = useUser();

  if (!client) return <Navigate to="/sign-in" />;
  return <StreamVideo client={client}></StreamVideo>;
};

export default Main;
