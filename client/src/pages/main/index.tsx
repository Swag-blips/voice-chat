import { Call, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "../../../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

interface NewRoom {
  name: string;
  description: string;
}

interface Room {
  id: string;
  title: string;
  description: string;
  participantsLength: number;
  createdBy: string;
}

type CustomCallData = {
  description?: string;
  title?: string;
};
const Main = () => {
  const { client, user, setCall, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (client) fetchListOfCalls();
  }, [client]);
  const [newRoom, setNewRoom] = useState<NewRoom>({
    name: "",
    description: "",
  });
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  const hashRoomName = (roomName: string): string => {
    const hash = CryptoJS.SHA256(roomName).toString(CryptoJS.enc.Base64);

    return hash.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const getCallInfo = async (call: Call): Promise<Room> => {
    const callInfo = await call.get();
    const customData = callInfo.call.custom;
    const { title, description } = (customData || {}) as CustomCallData;
    const participantsLength = callInfo.members.length ?? 0;
    const createdBy = callInfo.call.created_by.name ?? "";
    const id = callInfo.call.id ?? "";

    return {
      id,
      title: title ?? "",
      description: description ?? "",
      participantsLength,
      createdBy,
    };
  };

  const fetchListOfCalls = async () => {
    const callsQueryResponse = await client?.queryCalls({
      filter_conditions: {
        ongoing: true,
      },
      limit: 4,
      watch: true,
    });

    if (!callsQueryResponse) {
      alert("Error getting calls");
    } else {
      const roomPromises = await callsQueryResponse.calls.map((call) =>
        getCallInfo(call)
      );

      const rooms = await Promise.all(roomPromises);
      setAvailableRooms(rooms);
    }
  };
  const createRoom = async () => {
    const { name, description } = newRoom;

    if (!client || !user || !name || !description) return;

    const call = client.call("audio_room", hashRoomName(name));

    await call.join({
      create: true,
      data: {
        members: [{ user_id: user.username }],
        custom: {
          title: name,
          description,
        },
      },
    });

    setCall(call);
    navigate("/room");
  };

  const joinCall = async (callID: string) => {
    const call = client?.call("audio_room", callID);

    try {
      await call?.join();
      setCall(call);
      navigate("/room");
    } catch (error) {
      alert("Error while joining call. wait for room to be live");
    }
  };
  if (isLoading) return <h1>...</h1>;
  if (!user || !client) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <StreamVideo client={client}>
      <div className="home">
        <h1>Welcome {user?.name}</h1>
        <div className="form">
          <h2>Create your own room</h2>
          <input
            placeholder="Room name..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom((prev) => ({ ...prev, name: e?.target.value }))
            }
          />
          <input
            placeholder="Room Description.."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewRoom((prev) => ({ ...prev, description: e?.target.value }))
            }
          />
          <button
            onClick={createRoom}
            style={{ backgroundColor: "rgb(125,7,236" }}
          >
            Create a room
          </button>
        </div>
        {availableRooms.length !== 0 ? (
          <>
            <h2>Available rooms</h2>
            <div className="grid">
              {availableRooms.map((room) => (
                <div
                  className="card"
                  key={room.id}
                  onClick={() => joinCall(room.id)}
                >
                  <h4>{room.title}</h4>
                  <p>{room.description}</p>
                  <p>{room.participantsLength} participants</p>
                  <p>Created by: {room.createdBy}</p>
                  <div className="shine"></div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h2>No available rooms at the moment</h2>
        )}
      </div>
    </StreamVideo>
  );
};

export default Main;
