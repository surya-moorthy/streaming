import { WebSocket } from 'ws';

interface MessagePayload {
  type: string;
  [key: string]: any;
}

let senderSocket : WebSocket | null = null;
let receiverSocket : WebSocket | null = null;

export function processMessage(ws: WebSocket, data: MessagePayload) {
  switch (data.type) {
     case "sender":
       console.log("sender set")
      senderSocket = ws;
      break;
     case "receiver":
      console.log("receiver set")
      receiverSocket = ws;
      break;
     case "createOffer":
        if(ws != senderSocket){
          return
        }
        console.log("answer received")
        receiverSocket?.send(JSON.stringify({
          type : "createOffer", sdp : data.sdp
        }))
      break
     case "createAnswer":
        if(ws != receiverSocket) {
          return
        }
        console.log("offer received")
        senderSocket?.send(JSON.stringify({
          type : "createAnswer",sdp : data.sdp
        }))
      break
      case "iceCandidate" :
        if(ws == senderSocket){
          receiverSocket?.send(JSON.stringify({type : "iceCandidate", candidate : data.candidate}))
          console.log("cancdidate received from the sender");
        }
        else if (ws == receiverSocket){
          senderSocket?.send(JSON.stringify({type : "iceCandidate", candidate : data.candidate}))
          console.log("cancdidate received from the receiver");
        }
        break
      default:
        return
  }
}
