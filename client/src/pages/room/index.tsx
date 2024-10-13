import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Controls } from "./controls";

const Room = () => {
  const { useCallCustomData, useParticipants, useCallCreatedBy } =
    useCallStateHooks();

  const custom = useCallCustomData();
  const participants = useParticipants();
  const createdBy = useCallCreatedBy();
  return (
    <div className="room">
      <h2 className="title">{custom?.title ?? "TITLE"}</h2>
      <h3 className="description">{custom?.description ?? "DESCRIPTION"}</h3>
      <p className="participant-count">{participants.length} participants</p>
      <Controls />
    </div>
  );
};

export default Room;
