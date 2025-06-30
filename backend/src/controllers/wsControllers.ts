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
      senderSocket = ws;
      break;
     case "receiver":
      receiverSocket = ws;
      break;
     case "createOffer":
        if(ws != senderSocket){
          return
        }
        receiverSocket?.send(JSON.stringify({
          type : "createOffer", sdp : data.sdp
        }))
      break
     case "createAnswer":
        if(ws != receiverSocket) {
          return
        }
        senderSocket?.send(JSON.stringify({
          type : "createAnswer",sdp : data.sdp
        }))
      break
      case "iceCandidate" :
        if(ws == senderSocket){
          receiverSocket?.send(JSON.stringify({type : "iceCandidate", candidate : data.candidate}))
        }
        else if (ws == receiverSocket){
          receiverSocket?.send(JSON.stringify({type : "iceCandidate", candidate : data.candidate}))
        }
        break
      default:
        return
  }
}
