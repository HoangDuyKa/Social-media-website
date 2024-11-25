import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const VideoCall = ({ match }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  const roomId = match.params.roomId; // Room ID from URL
  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    socket.current = io("http://localhost:5000"); // Backend URL

    peerConnection.current = new RTCPeerConnection(config);

    // Join the room
    socket.current.emit("join-room", roomId);

    // Handle local media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.current.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit("ice-candidate", roomId, event.candidate);
          }
        };
      });

    // Handle WebRTC signaling
    socket.current.on("offer", async (offer) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.current.emit("answer", roomId, answer);
    });

    socket.current.on("answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.current.on("ice-candidate", async (candidate) => {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // Create offer when a new user connects
    socket.current.on("user-connected", async () => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.current.emit("offer", roomId, offer);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomId]);

  return (
    <div>
      <h1>Video Call Room: {roomId}</h1>
      <div>
        <video ref={localVideoRef} autoPlay muted />
        <video ref={remoteVideoRef} autoPlay />
      </div>
    </div>
  );
};

export default VideoCall;
