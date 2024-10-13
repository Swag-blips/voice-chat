import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Main from "./pages/main";
import SignInPage from "./pages/auth/signin";
import Room from "./pages/room";
import { StreamCall } from "@stream-io/video-react-sdk";
import { useUser } from "../context/UserContext";

function App() {
  const { call } = useUser();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/room"
          element={
            call ? (
              <StreamCall call={call}>
                <Room />
              </StreamCall>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
