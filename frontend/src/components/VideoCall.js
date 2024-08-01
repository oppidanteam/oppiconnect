import React, { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../context/SocketContext';

const VideoCall = () => {
  const socket = useContext(SocketContext);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const otherUser = useRef();
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;

      socket.on('offer', handleReceiveCall);

      socket.on('answer', handleAnswer);

      socket.on('ice-candidate', handleNewICECandidateMsg);

      socket.on('callAccepted', () => {
        setCallAccepted(true);
      });
    });
  }, []);

  const handleReceiveCall = (incoming) => {
    peerRef.current = createPeer(incoming.caller, false);
    peerRef.current.ontrack = handleTrackEvent;
    peerRef.current.setRemoteDescription(new RTCSessionDescription(incoming.sdp)).then(() => {
      userVideo.current.srcObject.getTracks().forEach(track => {
        peerRef.current.addTrack(track, userVideo.current.srcObject);
      });
    }).then(() => {
      peerRef.current.createAnswer().then(answer => {
        peerRef.current.setLocalDescription(answer);
        const payload = {
          target: incoming.caller,
          caller: socket.id,
          sdp: peerRef.current.localDescription
        };
        socket.emit('answer', payload);
      });
    });
  };

  const handleAnswer = (message) => {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
  };

  const handleNewICECandidateMsg = (incoming) => {
    const candidate = new RTCIceCandidate(incoming);
    peerRef.current.addIceCandidate(candidate).catch(e => console.log(e));
  };

  const handleTrackEvent = (event) => {
    partnerVideo.current.srcObject = event.streams[0];
  };

  const createPeer = (userID, initiator) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        },
        {
          urls: "stun:stun.l.google.com:19302"
        }
      ]
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  };

  const handleNegotiationNeededEvent = (userID) => {
    peerRef.current.createOffer().then(offer => {
      return peerRef.current.setLocalDescription(offer);
    }).then(() => {
      const payload = {
        target: userID,
        caller: socket.id,
        sdp: peerRef.current.localDescription
      };
      socket.emit('offer', payload);
    }).catch(e => console.log(e));
  };

  const handleICECandidateEvent = (e) => {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate
      };
      socket.emit('ice-candidate', payload);
    }
  };

  const callUser = (id) => {
    peerRef.current = createPeer(id, true);
    otherUser.current = id;
    userVideo.current.srcObject.getTracks().forEach(track => {
      peerRef.current.addTrack(track, userVideo.current.srcObject);
    });
    setIsCallStarted(true);
  };

  return (
    <div>
      <div>
        <video autoPlay ref={userVideo} />
        <video autoPlay ref={partnerVideo} />
      </div>
      <div>
        {isCallStarted && !callAccepted && <h4>Calling...</h4>}
        {callAccepted && <h4>Call in Progress</h4>}
        {!isCallStarted && (
          <button onClick={() => callUser('other-user-id')}>Call</button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
