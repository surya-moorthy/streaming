import { useEffect, useRef } from "react";

function Receiver() {

    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:3000");
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type : "receiver"
            }))
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            let pc: RTCPeerConnection | null = null;
            
            if(message.type == "createOffer"){
               pc = new RTCPeerConnection();
                await pc.setRemoteDescription(message.sdp);
                
                 pc.onicecandidate = (event) => {
                    if(event.candidate) {
                        socket.send(JSON.stringify({
                            type : "iceCandidate", candidate : event.candidate
                        }));
                    }else if(message.type == "iceCandidate"){
                     pc?.addIceCandidate(message.candidate);
                }

                }

                const video = document.createElement('video');
                    console.log("getting video");
                    document.body.appendChild(video);

                pc.ontrack = (event) => {
                        video.srcObject = new MediaStream([event.track])
                        video.play();    
                }

                const answer = await pc.createAnswer();
                pc.setLocalDescription(answer);

                socket.send(JSON.stringify({
                    type : "createAnswer",
                    sdp : pc.localDescription
                }))
            }
        }
    },[])
    return (
        <div>
             Receiver
        </div>
    )
}

export default Receiver;