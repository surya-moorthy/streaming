import { useEffect, useState } from "react";
import { data } from "react-router-dom";

function Sender() {

    const [socket,setSocket] = useState<WebSocket | null>(null);
 
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:3000");
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type : "sender"
            }))
        }

        setSocket(socket);
    },[])

    async function startSendingVideo() {
        if (!socket) return;
        const pc = new RTCPeerConnection();
        pc.onnegotiationneeded = async () => {
            console.log("negotiation needed");
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.send(JSON.stringify({
                type : "createOffer" , sdp : pc.localDescription
            }))
        }

        pc.onicecandidate = (event) => {
            if(event.candidate) {
                socket.send(JSON.stringify({
                    type : "iceCandidate", candidate : event.candidate
                }));
            }
        }

       

        socket.onmessage = async (event) => {
  try {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);

    if (message.type === "createAnswer" && message.sdp) {
      if (message.sdp.type && message.sdp.sdp) {
        console.log("Setting remote description:", message.sdp);
        await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
      } else {
        console.error("Invalid SDP format:", message.sdp);
      }
    }   

    else if (message.type === "iceCandidate" && message.candidate) {
      if (pc.remoteDescription && pc.remoteDescription.type) {
        console.log("Adding ICE candidate:", message.candidate);
        await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
      } else {
        console.warn("ICE candidate received before remoteDescription was set:", message.candidate);
        // Optionally: store in queue to add later
      }
    }

  } catch (error) {
    console.error("❌ Error handling WebSocket message:", error);
  }
};

            const stream = await navigator.mediaDevices.getUserMedia({video : true , audio : true});
            stream.getTracks().forEach((track) => {
                console.log("track sent");
                pc.addTrack(track, stream);
            });
    }

    return (
        <div>
             Sender
             <button onClick={startSendingVideo}>Send video</button>
        </div>
    )
}

export default Sender;
