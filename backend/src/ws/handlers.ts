import { WebSocket } from 'ws';
import { processMessage } from '../controllers/wsControllers';



export function handleMessage(ws: WebSocket, message: string) {
  try {
    const data = JSON.parse(message);
    processMessage(ws, data);
  } catch (err) {
    ws.send(JSON.stringify({ error: 'Invalid message format' }));
  }
}
