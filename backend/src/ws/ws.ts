import { WebSocket, Server as WebSocketServer } from 'ws';

import { Server } from 'http';
import { handleMessage } from './handlers';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message: string) => {
      handleMessage(ws, message);
    });
  });
}
