import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate } from "react-router-dom";

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const roomID = urlParams.get("device");
  const userName = urlParams.get("user");
  const receiver = urlParams.get("receiver");
  const token = urlParams.get("token");
  const [socket, setSocket] = React.useState(null);
  const [response, setResponse] = React.useState({});

  const navigate = useNavigate();

  console.log("response", response);
  console.log("roomID", roomID);
  console.log("userName", userName);
  console.log("receiver", receiver);
  console.log("token", token);

  if (!roomID || !userName || !token) {
    return navigate(-1);
  }
  if (!token) {
    return alert("You are not allowed to access this Call");
  }

  //////////////////////////////// web socket setup ////////////////////////////////////////////////////////////

  React.useEffect(() => {
    const newSocket = new WebSocket(
      `wss://abc.winaclaim.com/ws/call/${roomID}/?token=${token}`
    );
    newSocket.onopen = () => {
      console.log("socket open");
    };
    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("response data", data);
      setResponse(data);
    };
    newSocket.onerror = () => {
      console.log("socket error");
    };
    newSocket.onclose = () => {
      console.log("socket close");
    };
    setSocket(newSocket);
  }, []);

  ////////////////////////////////////////// audio call setup //////////////////////////////////////////////////////////

  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 1130639396;
    const serverSecret = "ba7955818db26946558996cc10d4e749";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      userName
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      showPreJoinView: false,
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID,
        },
      ],
      onUserAvatarSetter: () => {},
      turnOnCameraWhenJoining: false,
      showScreenSharingButton: false,
      showAudioVideoSettingsButton: false,
      showUserList: true,
      showMoreButton: false,
      showMyCameraToggleButton: false,
      showChat: false,
      showRoomDetailsButton: false,
      showUserName: true,
      showTextChat: false,
      maxUsers: 2,
      showRoomTimer: true,
      showUserName: false,
      onUserJoin: () => {
        console.log("user joined");
      },
      onJoinRoom: () => {
        console.log("onJoinRoom");
      },
      onLeaveRoom: () => {
        navigate(-1);
        const data = {
          action: "end_call",
          call_id: response?.call_id,
          device_id: response?.device_id,
        };
        socket.send(JSON.stringify(data));
        console.log("onLeaveRoom");
      },
      onUserLeave: () => {
        navigate(-1);
        console.log("onUserLeave");
        const data = {
          action: "end_call",
          call_id: response?.call_id,
          device_id: response?.device_id,
        };
        socket.send(JSON.stringify(data));
      },
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        audioOnly: true,
        video: false,
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
